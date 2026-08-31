import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription, interval } from 'rxjs';
import { PedidoService } from '../../../core/services/pedido.service';
import { AuthService } from '../../../core/services/auth.service';
import { Pedido, StatusPedido } from '../../../core/models/pedido.model';

type EstadoEtapa = 'completo' | 'atual' | 'pendente';

interface Filtro {
  rotulo: string;
  valor: 'todos' | StatusPedido;
}

const INTERVALO_ATUALIZACAO_MS = 15000;

@Component({
  selector: 'app-lancamento-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lancamento-pedidos.html',
  styleUrl: './lancamento-pedidos.css'
})
export class LancamentoPedidosComponent implements OnInit, OnDestroy {

  nomeGarcom = '';

  abaAtiva: 'novo' | 'andamento' = 'novo';

  mesasDisponiveis: number[] = Array.from({ length: 20 }, (_, i) => i + 1);
  mesaSelecionada: number | null = null;
  pedidoTexto = '';

  filtroAtivo: 'todos' | StatusPedido = 'todos';

  filtros: Filtro[] = [
    { rotulo: 'Todos', valor: 'todos' },
    { rotulo: 'Novos', valor: 'NOVO' },
    { rotulo: 'Em Andamento', valor: 'ANDAMENTO' },
    { rotulo: 'Prontos', valor: 'PRONTO' },
    { rotulo: 'Entregues', valor: 'ENTREGUE' }
  ];

  etapasOrdem: StatusPedido[] = ['NOVO', 'ANDAMENTO', 'PRONTO', 'ENTREGUE'];

  pedidos: Pedido[] = [];
  carregando = false;
  enviando = false;
  mensagemErro = '';

  private restauranteId!: number;
  private polling?: Subscription;

  constructor(private pedidoService: PedidoService, private authService: AuthService) {}

  ngOnInit(): void {
    this.restauranteId = this.authService.getRestauranteId()!;
    this.nomeGarcom = this.authService.getSessao()?.nomeFuncionario ?? '';

    this.carregarPedidos();
    // Atualiza a lista periodicamente para refletir o andamento na cozinha.
    this.polling = interval(INTERVALO_ATUALIZACAO_MS).subscribe(() => this.carregarPedidos());
  }

  ngOnDestroy(): void {
    this.polling?.unsubscribe();
  }

  private carregarPedidos(): void {
    this.carregando = this.pedidos.length === 0;

    this.pedidoService.listar(this.restauranteId).subscribe({
      next: (pedidos) => {
        this.pedidos = pedidos;
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
        this.mensagemErro = 'Não foi possível atualizar os pedidos.';
      }
    });
  }

  enviarPedido(): void {
    this.mensagemErro = '';

    if (!this.mesaSelecionada || !this.pedidoTexto.trim()) {
      return;
    }

    const itens = this.pedidoTexto
      .split('\n')
      .map(linha => linha.trim())
      .filter(linha => linha.length > 0);

    this.enviando = true;

    this.pedidoService.criar({
      mesa: this.mesaSelecionada,
      itens,
      restauranteId: this.restauranteId
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
        this.mensagemErro = 'Não foi possível enviar o pedido para a cozinha.';
      }
    });
  }

  pedidosFiltrados(): Pedido[] {
    if (this.filtroAtivo === 'todos') {
      return this.pedidos;
    }
    return this.pedidos.filter(p => p.status === this.filtroAtivo);
  }

  statusIndex(status: StatusPedido): number {
    return this.etapasOrdem.indexOf(status);
  }

  stepEstado(pedido: Pedido, idx: number): EstadoEtapa {
    const atual = this.statusIndex(pedido.status);
    if (idx < atual) return 'completo';
    if (idx === atual) return 'atual';
    return 'pendente';
  }

  linhaEstado(pedido: Pedido, idx: number): EstadoEtapa {
    const atual = this.statusIndex(pedido.status);
    if (atual > idx) return 'completo';
    if (atual === idx) return 'atual';
    return 'pendente';
  }

  textoStatus(pedido: Pedido): string {
    switch (pedido.status) {
      case 'NOVO':
        return 'Aguardando preparo';
      case 'ANDAMENTO':
        return `Em andamento há ${pedido.minutosEmAndamento ?? 0} min`;
      case 'PRONTO':
        return `Pronto em ${pedido.horarioPronto ?? ''}`;
      case 'ENTREGUE':
        return `Entregue em ${pedido.horarioEntregue ?? ''}`;
      default:
        return '';
    }
  }

  marcarComoEntregue(pedido: Pedido): void {
    if (pedido.status !== 'PRONTO') {
      return;
    }

    const statusAnterior = pedido.status;
    pedido.status = 'ENTREGUE'; // atualização otimista

    this.pedidoService.atualizarStatus(pedido.id, 'ENTREGUE').subscribe({
      next: (atualizado) => {
        pedido.horarioEntregue = atualizado.horarioEntregue;
      },
      error: () => {
        pedido.status = statusAnterior;
        this.mensagemErro = 'Não foi possível confirmar a entrega do pedido.';
      }
    });
  }
}