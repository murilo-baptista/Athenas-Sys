import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type StatusPedido = 'novo' | 'andamento' | 'pronto' | 'entregue';
type EstadoEtapa = 'completo' | 'atual' | 'pendente';

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
  selector: 'app-lancamento-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lancamento-pedidos.html',
  styleUrl: './lancamento-pedidos.css'
})
export class LancamentoPedidosComponent {

  nomeGarcom: string = 'FULANO DE TAL';

  abaAtiva: 'novo' | 'andamento' = 'novo';

  mesasDisponiveis: number[] = Array.from({ length: 20 }, (_, i) => i + 1);
  mesaSelecionada: number | null = null;
  pedidoTexto: string = '';

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

  private proximoId: number = 4;

  enviarPedido(): void {
    if (!this.mesaSelecionada || !this.pedidoTexto.trim()) {
      return;
    }

    const itens = this.pedidoTexto
      .split('\n')
      .map(linha => linha.trim())
      .filter(linha => linha.length > 0);

    const novoPedido: Pedido = {
      id: this.proximoId++,
      numero: String(this.proximoId - 1).padStart(3, '0'),
      mesa: this.mesaSelecionada,
      itens,
      horarioEnvio: this.horaAtual(),
      status: 'novo'
    };

    this.pedidos.unshift(novoPedido);

    // TODO: enviar pedido para o back-end (cozinha)

    this.mesaSelecionada = null;
    this.pedidoTexto = '';
    this.abaAtiva = 'andamento';
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

  /**
   * Estado de cada um dos 4 passos (Novo, Em andamento, Pronto, Entregue).
   * idx vai de 0 a 3, na mesma ordem de etapasOrdem.
   */
  stepEstado(pedido: Pedido, idx: number): EstadoEtapa {
    const atual = this.statusIndex(pedido.status);
    if (idx < atual) return 'completo';
    if (idx === atual) return 'atual';
    return 'pendente';
  }

  /**
   * Estado de cada uma das 3 linhas que conectam os passos.
   * idx 0 = Novo -> Em andamento
   * idx 1 = Em andamento -> Pronto
   * idx 2 = Pronto -> Entregue
   * A esfera da linha vai se colorindo (cinza -> dourado -> bordô)
   * conforme o pedido avança nas etapas.
   */
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

  marcarComoEntregue(pedido: Pedido): void {
    if (pedido.status !== 'pronto') {
      return;
    }
    pedido.status = 'entregue';
    pedido.horarioEntregue = this.horaAtual();

    // TODO: notificar o back-end da entrega do pedido
  }

  private horaAtual(): string {
    const agora = new Date();
    const horas = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');
    return `${horas}:${minutos}`;
  }
}