/**
 * IMPORTANTE: no backend, quem tem status é o ItemPedido, não o Pedido
 * (br.com.athenassys.api.enums.StatusItemPedido). O Pedido não tem campo
 * "status" nem "numero" — cada item evolui de forma independente pela
 * cozinha.
 */
export type StatusItemPedido = 'PENDENTE' | 'EM_PREPARO' | 'PRONTO' | 'ENTREGUE' | 'CANCELADO';

export interface DadosAtualizacaoItemPedido {
  idProduto?: number;
  quantidade?: number;
  observacao?: string;
}

export interface ItemPedidoListagem {
  id: number;
  quantidade: number;
  observacao: string | null;
  valorUnitario: number;
  status: StatusItemPedido;
  idPedido: number;
  idProduto: number;
}

export interface ItemPedidoDetalhamento extends ItemPedidoListagem {
  idRestaurante: number;
}