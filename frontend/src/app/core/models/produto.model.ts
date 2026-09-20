export interface DadosCadastroProduto {
  nome: string;
  descricao?: string;
  preco: number;
  idCategoria: number;
}

export interface DadosAtualizacaoProduto {
  nome?: string;
  descricao?: string;
  preco?: number;
  idCategoria?: number;
}

export interface ProdutoListagem {
  id: number;
  nome: string;
  descricao: string | null;
  preco: number;
  idCategoria: number;
}

export interface ProdutoDetalhamento {
  id: number;
  nome: string;
  descricao: string | null;
  preco: number;
  idCategoria: number;
  idRestaurante: number;
  ativo: boolean;
}