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

export interface LoginFuncionarioRequest {
  usuario: string;
  codigo: string;
  restauranteId: number;
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
  restauranteId: number;
  nomeRestaurante?: string;
  funcionarioId?: number;
  nomeFuncionario?: string;
  cargo?: CargoFuncionario;
}