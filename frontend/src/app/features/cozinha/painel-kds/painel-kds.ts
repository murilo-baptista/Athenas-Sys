import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, interval } from 'rxjs';
import { PedidoService } from '../../../core/services/pedido.service';
import { Pedido, StatusPedido } from '../../../core/models/pedido.model';

type EtapaVisual = 'NOVO' | 'EM ANDAMENTO' | 'PRONTO' | 'ENTREGUE';

type EstadoEtapa = 'completo' | 'atual' | 'pendente';

type FiltroValor = 'todos' | StatusPedido | 'PRONTO';

interface Filtro {
  rotulo: string;
  valor: FiltroValor;
}

const INTERVALO_ATUALIZACAO_MS = 10000;

@Component({
  selector: 'app-painel-kds',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './painel-kds.html',
  styleUrl: './painel-kds.css'
})
export class PainelKdsComponent implements OnInit, OnDestroy {

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
  mensagemErro = '';

  private polling?: Subscription;

  constructor(
    private pedidoService: PedidoService
  ) {}

  ngOnInit(): void {
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
          'Não foi possível atualizar o painel de pedidos.';
      }
    });
  }

  etapaDoPedido(pedido: Pedido): EtapaVisual {
    if (pedido.status === 'ENTREGUE') {
      return 'ENTREGUE';
    }

    if (pedido.status === 'CANCELADO') {
      return 'EM ANDAMENTO';
    }

    if (pedido.horarioPronto) {
      return 'PRONTO';
    }

    return 'EM ANDAMENTO';
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
}