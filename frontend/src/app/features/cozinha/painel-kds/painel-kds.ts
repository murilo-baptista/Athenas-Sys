import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

type StatusPedido = 'novo' | 'andamento' | 'pronto' | 'entregue';
type EstadoEtapa = 'completo' | 'atual' | 'pendente';
type EstadoBotao = 'pendente' | 'disponivel' | 'concluido';

interface Pedido {
  id: number;
  numero: string;
  mesa: number;
  itens: string[];
  horarioEnvio: string;
  status: StatusPedido;
  horarioPronto?: string;
  horarioEntregue?: string;
  minutosEmAndamento?: number;
}

interface Filtro {
  rotulo: string;
  valor: 'todos' | StatusPedido;
}

@Component({
  selector: 'app-painel-kds',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './painel-kds.html',
  styleUrl: './painel-kds.css'
})
export class PainelKdsComponent {

  filtroAtivo: 'todos' | StatusPedido = 'todos';

  filtros: Filtro[] = [
    { rotulo: 'Todos', valor: 'todos' },
    { rotulo: 'Novos', valor: 'novo' },
    { rotulo: 'Em Andamento', valor: 'andamento' },
    { rotulo: 'Prontos', valor: 'pronto' },
    { rotulo: 'Entregues', valor: 'entregue' }
  ];

  etapasOrdem: StatusPedido[] = ['novo', 'andamento', 'pronto', 'entregue'];

  pedidos: Pedido[] = [
    {
      id: 1,
      numero: '001',
      mesa: 5,
      itens: ['Filé de frango grelhado', '1 Lata de refrigerante'],
      horarioEnvio: '11:15',
      status: 'pronto',
      horarioPronto: '11:26'
    },
    {
      id: 2,
      numero: '002',
      mesa: 10,
      itens: ['Picanha grelhada', 'Risoto de camarão'],
      horarioEnvio: '12:22',
      status: 'andamento',
      minutosEmAndamento: 8
    },
    {
      id: 3,
      numero: '003',
      mesa: 2,
      itens: ['Filé com batata frita', '1 Suco de abacaxi'],
      horarioEnvio: '11:00',
      status: 'entregue',
      horarioEntregue: '11:20'
    }
  ];

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
      case 'novo':
        return 'Aguardando preparo';
      case 'andamento':
        return `Em andamento há ${pedido.minutosEmAndamento ?? 0} min`;
      case 'pronto':
        return `Pronto em ${pedido.horarioPronto ?? ''}`;
      case 'entregue':
        return `Entregue em ${pedido.horarioEntregue ?? ''}`;
      default:
        return '';
    }
  }

  /**
   * Estado do botão "Marcar como Em Andamento":
   * - disponível (clicável) quando o pedido está 'novo'
   * - concluído (verde, travado) quando já passou desse ponto
   */
  botaoAndamentoEstado(pedido: Pedido): EstadoBotao {
    if (pedido.status === 'novo') return 'disponivel';
    return 'concluido';
  }

  /**
   * Estado do botão "Pedido Pronto":
   * - pendente (cinza, travado) enquanto o pedido ainda é 'novo'
   * - disponível (clicável) quando está 'andamento'
   * - concluído (verde, travado) quando já está 'pronto' ou 'entregue'
   */
  botaoProntoEstado(pedido: Pedido): EstadoBotao {
    if (pedido.status === 'novo') return 'pendente';
    if (pedido.status === 'andamento') return 'disponivel';
    return 'concluido';
  }

  marcarComoAndamento(pedido: Pedido): void {
    if (pedido.status !== 'novo') {
      return;
    }
    pedido.status = 'andamento';
    pedido.minutosEmAndamento = 0;

    // TODO: notificar o back-end do início do preparo
  }

  marcarComoPronto(pedido: Pedido): void {
    if (pedido.status !== 'andamento') {
      return;
    }
    pedido.status = 'pronto';
    pedido.horarioPronto = this.horaAtual();

    // TODO: notificar o back-end / garçom que o pedido está pronto
  }

  private horaAtual(): string {
    const agora = new Date();
    const horas = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');
    return `${horas}:${minutos}`;
  }
}