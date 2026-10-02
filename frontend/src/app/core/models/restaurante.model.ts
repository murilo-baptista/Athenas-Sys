export interface Restaurante {
  id?: number;
  nome: string;
  email: string;
  telefone: string;
  cnpj: string;
}

export interface CadastroRestauranteRequest {
  nome: string;
  email: string;
  telefone: string;
  cnpj: string;
  senha: string;
}

export interface AtualizarRestauranteRequest {
  nome: string;
  email: string;
  telefone: string;
}

export interface CadastroRestauranteResponse {
  restaurante: Restaurante;
  token: string;
}

/** PATCH /restaurantes/{id}/alterarSenha (DadosAlteracaoChave no back-end) */
export interface AlterarSenhaRequest {
  chaveAtual: string;
  chaveNova: string;
}