import { CargoFuncionario } from './funcionario.model';

export interface LoginRestauranteRequest {
  usuario: string;
  senha: string;
}

export interface LoginRestauranteResponse {
  token: string;
  restauranteId: number;
  nomeRestaurante: string;
}

/** O restaurante vem do token: o back não aceita mais restauranteId aqui. */
export interface LoginFuncionarioRequest {
  usuario: string;
  codigo: string;
}

export interface LoginFuncionarioResponse {
  token: string;
  funcionarioId: number;
  nomeFuncionario: string;
  cargo: CargoFuncionario;
}

export interface SessaoUsuario {
  token: string;
  tipo: 'RESTAURANTE' | 'FUNCIONARIO';
  idRestaurante: number;
  nomeRestaurante?: string;
  funcionarioId?: number;
  nomeFuncionario?: string;
  cargo?: CargoFuncionario;
}