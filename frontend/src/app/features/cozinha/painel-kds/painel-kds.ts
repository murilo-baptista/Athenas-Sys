import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, interval } from 'rxjs';
import { PedidoService } from '../../../core/services/pedido.service';
import { AuthService } from '../../../core/services/auth.service';
import { Pedido, StatusPedido } from '../../../core/models/pedido.model';

type EstadoEtapa = 'completo' | 'atual' | 'pendente';
type EstadoBotao = 'pendente' | 'disponivel' | 'concluido';

interface Filtro {
  rotulo: string;
  valor: 'todos' | StatusPedido;
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
  mensagemErro = '';

  private restauranteId!: number;
  private polling?: Subscription;

  constructor(private pedidoService: PedidoService, private authService: AuthService) {}

  ngOnInit(): void {
    this.restauranteId = this.authService.getRestauranteId()!;
    this.carregarPedidos();
    // KDS precisa refletir pedidos novos quase em tempo real.
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
        this.mensagemErro = 'Não foi possível atualizar o painel de pedidos.';
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

  /**
   * Estado do botão "Marcar como Em Andamento":
   * - disponível (clicável) quando o pedido está 'NOVO'
   * - concluído (verde, travado) quando já passou desse ponto
   */
  botaoAndamentoEstado(pedido: Pedido): EstadoBotao {
    if (pedido.status === 'NOVO') return 'disponivel';
    return 'concluido';
  }

  /**
   * Estado do botão "Pedido Pronto":
   * - pendente (cinza, travado) enquanto o pedido ainda é 'NOVO'
   * - disponível (clicável) quando está 'ANDAMENTO'
   * - concluído (verde, travado) quando já está 'PRONTO' ou 'ENTREGUE'
   */
  botaoProntoEstado(pedido: Pedido): EstadoBotao {
    if (pedido.status === 'NOVO') return 'pendente';
    if (pedido.status === 'ANDAMENTO') return 'disponivel';
    return 'concluido';
  }

  marcarComoAndamento(pedido: Pedido): void {
    if (pedido.status !== 'NOVO') {
      return;
    }

    const statusAnterior = pedido.status;
    pedido.status = 'ANDAMENTO';
    pedido.minutosEmAndamento = 0;

    this.pedidoService.atualizarStatus(pedido.id, 'ANDAMENTO').subscribe({
      error: () => {
        pedido.status = statusAnterior;
        this.mensagemErro = 'Não foi possível iniciar o preparo desse pedido.';
      }
    });
  }

  marcarComoPronto(pedido: Pedido): void {
    if (pedido.status !== 'ANDAMENTO') {
      return;
    }

    const statusAnterior = pedido.status;
    pedido.status = 'PRONTO';

    this.pedidoService.atualizarStatus(pedido.id, 'PRONTO').subscribe({
      next: (atualizado) => {
        pedido.horarioPronto = atualizado.horarioPronto;
      },
      error: () => {
        pedido.status = statusAnterior;
        this.mensagemErro = 'Não foi possível marcar esse pedido como pronto.';
      }
    });
  }
}