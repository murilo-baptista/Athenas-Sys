export type StatusPedido = 'EM ANDAMENTO' | 'ENTREGUE' | 'CANCELADO';

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
  funcionario: number;
  observacao: string;
  itens: string[];
}

export interface AtualizarPedidoRequest {
  idMesa: number;
  idFuncionario: number;
  observacao: string;
}

export interface AtualizarStatusPedidoRequest {
  status: StatusPedido;
}