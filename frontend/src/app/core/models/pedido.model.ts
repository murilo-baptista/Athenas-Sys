import { ItemPedidoDetalhamento } from './item-pedido.model';

export interface DadosCadastroItemPedido {
  idProduto: number;
  quantidade: number;
  observacao?: string;
}

export interface DadosCadastroPedido {
  idMesa: number;
  idFuncionario: number;
  observacao?: string;
  itens: DadosCadastroItemPedido[];
}

export interface DadosAtualizacaoPedido {
  idMesa?: number;
  idFuncionario?: number;
  observacao?: string;
}

export interface PedidoListagem {
  id: number;
  dataHora: string;
  observacao: string | null;
  valorTotal: number;
  idMesa: number;
  idFuncionario: number;
}

export interface PedidoDetalhamento {
  id: number;
  dataHora: string;
  valorTotal: number;
  observacao: string | null;
  idRestaurante: number;
  idMesa: number;
  idFuncionario: number;
  itens: ItemPedidoDetalhamento[];
}