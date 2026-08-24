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