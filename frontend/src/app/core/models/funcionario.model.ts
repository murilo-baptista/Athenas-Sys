export type CargoFuncionario = 'Gerente' | 'Garçom' | 'Recepção' | 'Cozinha';

export interface Funcionario {
  id?: number;
  restauranteId?: number;
  nome: string;
  cargo: CargoFuncionario;
}

export interface CriarFuncionarioRequest {
  nome: string;
  codigo: string;
  cargo: CargoFuncionario;
}

export interface AtualizarFuncionarioRequest {
  nome: string;
  cargo: CargoFuncionario;
}