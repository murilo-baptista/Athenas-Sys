import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription, interval } from 'rxjs';
import { PedidoService } from '../../../core/services/pedido.service';
import { AuthService } from '../../../core/services/auth.service';
import { Pedido } from '../../../core/models/pedido.model';

type EtapaVisual = 'NOVO' | 'EM ANDAMENTO' | 'PRONTO' | 'ENTREGUE';

type EstadoEtapa = 'completo' | 'atual' | 'pendente';

type FiltroValor = 'todos' | 'EM ANDAMENTO' | 'PRONTO' | 'ENTREGUE' | 'CANCELADO';

interface Filtro {
  rotulo: string;
  valor: FiltroValor;
}

const INTERVALO_ATUALIZACAO_MS = 15000;

@Component({
  selector: 'app-lancamento-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lancamento-pedidos.html',
  styleUrl: './lancamento-pedidos.css'
})
export class LancamentoPedidosComponent
  implements OnInit, OnDestroy {

  nomeGarcom = '';

  abaAtiva: 'novo' | 'andamento' = 'novo';

  mesasDisponiveis: number[] = Array.from(
    { length: 20 },
    (_, i) => i + 1
  );

  mesaSelecionada: number | null = null;
  pedidoTexto = '';

  filtroAtivo: FiltroValor = 'todos';

  filtros: Filtro[] = [
    { rotulo: 'Todos', valor: 'todos' },
    { rotulo: 'Em Andamento', valor: 'EM ANDAMENTO' },
    { rotulo: 'Prontos', valor: 'PRONTO' },
    { rotulo: 'Entregues', valor: 'ENTREGUE' },
    { rotulo: 'Cancelados', valor: 'CANCELADO' }
  ];

  etapasOrdem: EtapaVisual[] = [
    'NOVO',
    'EM ANDAMENTO',
    'PRONTO',
    'ENTREGUE'
  ];

  pedidos: Pedido[] = [];
  carregando = false;
  enviando = false;
  mensagemErro = '';

  private polling?: Subscription;

  constructor(
    private pedidoService: PedidoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.nomeGarcom =
      this.authService.getSessao()?.nomeFuncionario ?? '';

    this.carregarPedidos();

    this.polling = interval(INTERVALO_ATUALIZACAO_MS)
      .subscribe(() => this.carregarPedidos());
  }

  ngOnDestroy(): void {
    this.polling?.unsubscribe();
  }

  private carregarPedidos(): void {
    this.carregando = this.pedidos.length === 0;
    this.mensagemErro = '';

    this.pedidoService.listar().subscribe({
      next: (pedidos) => {
        this.pedidos = pedidos;
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
        this.mensagemErro =
          'Não foi possível atualizar os pedidos.';
      }
    });
  }

  etapaDoPedido(pedido: Pedido): EtapaVisual {
    if (pedido.status === 'ENTREGUE') {
      return 'ENTREGUE';
    }

    if (pedido.horarioPronto) {
      return 'PRONTO';
    }

    return 'EM ANDAMENTO';
  }

  enviarPedido(): void {
    this.mensagemErro = '';

    if (!this.mesaSelecionada || !this.pedidoTexto.trim()) {
      return;
    }

    const funcionario =
      this.authService.getSessao()?.funcionarioId;

    if (!funcionario) {
      this.mensagemErro =
        'Não foi possível identificar o funcionário.';
      return;
    }

    const itens = this.pedidoTexto
      .split('\n')
      .map(linha => linha.trim())
      .filter(linha => linha.length > 0);

    this.enviando = true;

    this.pedidoService.criar({
      mesa: this.mesaSelecionada,
      funcionario,
      observacao: itens.join('\n'),
      itens
    }).subscribe({
      next: (novoPedido) => {
        this.pedidos.unshift(novoPedido);

        this.mesaSelecionada = null;
        this.pedidoTexto = '';
        this.abaAtiva = 'andamento';
        this.enviando = false;
      },
      error: () => {
        this.enviando = false;
        this.mensagemErro =
          'Não foi possível enviar o pedido para a cozinha.';
      }
    });
  }

  pedidosFiltrados(): Pedido[] {
    if (this.filtroAtivo === 'todos') {
      return this.pedidos;
    }

    if (this.filtroAtivo === 'PRONTO') {
      return this.pedidos.filter(
        pedido =>
          pedido.status === 'EM ANDAMENTO' &&
          !!pedido.horarioPronto
      );
    }

    return this.pedidos.filter(
      pedido => pedido.status === this.filtroAtivo
    );
  }

  statusIndex(etapa: EtapaVisual): number {
    return this.etapasOrdem.indexOf(etapa);
  }

  stepEstado(
    pedido: Pedido,
    idx: number
  ): EstadoEtapa {
    const atual = this.statusIndex(
      this.etapaDoPedido(pedido)
    );

    if (idx < atual) {
      return 'completo';
    }

    if (idx === atual) {
      return 'atual';
    }

    return 'pendente';
  }

  linhaEstado(
    pedido: Pedido,
    idx: number
  ): EstadoEtapa {
    const atual = this.statusIndex(
      this.etapaDoPedido(pedido)
    );

    if (atual > idx) {
      return 'completo';
    }

    if (atual === idx) {
      return 'atual';
    }

    return 'pendente';
  }

  textoStatus(pedido: Pedido): string {
    if (pedido.status === 'CANCELADO') {
      return 'Pedido cancelado';
    }

    if (pedido.status === 'ENTREGUE') {
      return `Entregue em ${pedido.horarioEntregue ?? ''}`;
    }

    if (pedido.horarioPronto) {
      return `Pronto em ${pedido.horarioPronto}`;
    }

    return `Em andamento há ${pedido.minutosEmAndamento ?? 0} min`;
  }

  marcarComoEntregue(pedido: Pedido): void {
    if (
      pedido.status !== 'EM ANDAMENTO' ||
      !pedido.horarioPronto
    ) {
      return;
    }

    this.pedidoService.entregar(pedido.id).subscribe({
      next: (atualizado) => {
        const index = this.pedidos.findIndex(
          p => p.id === pedido.id
        );

        if (index !== -1) {
          this.pedidos[index] = atualizado;
        }
      },
      error: () => {
        this.mensagemErro =
          'Não foi possível confirmar a entrega do pedido.';
      }
    });
  }
}