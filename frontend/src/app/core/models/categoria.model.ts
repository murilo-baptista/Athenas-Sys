export interface DadosCadastroCategoria {
  nome: string;
}

export interface DadosAtualizacaoCategoria {
  nome?: string;
}

export interface CategoriaListagem {
  id: number;
  nome: string;
}

export interface CategoriaDetalhamento {
  id: number;
  idRestaurante: number;
  nome: string;
  ativo: boolean;
}