export type CargoFuncionario = 'GERENTE' | 'RECEPCAO' | 'GARCOM' | 'COZINHA';

export interface Funcionario {
  id: number;
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