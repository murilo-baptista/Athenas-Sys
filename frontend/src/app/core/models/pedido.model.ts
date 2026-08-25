export type StatusPedido = 'NOVO' | 'ANDAMENTO' | 'PRONTO' | 'ENTREGUE';

export interface Pedido {
  id: number;
  numero: string;
  mesa: number;
  itens: string[];
  status: StatusPedido;
  horarioEnvio: string;
  horarioPronto?: string;
  horarioEntregue?: string;
  minutosEmAndamento?: number;
}

export interface CriarPedidoRequest {
  mesa: number;
  itens: string[];
  restauranteId: number;
}

export interface AtualizarStatusPedidoRequest {
  status: StatusPedido;
}