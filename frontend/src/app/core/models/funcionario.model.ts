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

/** Usado no endpoint .../funcionarios/{id}/alterarCodigo — exige a senha do próprio funcionário como confirmação, e o novo código é definido pelo gerente. */
export interface AlterarCodigoRequest {
  senha: string;
  novoCodigo: string;
}