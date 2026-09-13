export type StatusPedido = 'EM ANDAMENTO' | 'ENTREGUE' | 'CANCELADO';

export interface Pedido {
  id: number;
  status: StatusPedido;
  horarioEnvio: string;
  observacao?: string;
  valorTotal: number;
  mesa: number;
  funcionario: number;
  horarioPronto?: string;
  horarioEntregue?: string;
  minutosEmAndamento?: number;
}

export interface CriarPedidoRequest {
  mesa: number;
  funcionario: number;
  observacao?: string;
  itens: string[];
}

export interface AtualizarPedidoRequest {
  mesa: number;
  funcionario: number;
  observacao?: string;
}