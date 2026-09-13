export type StatusMesa = 'LIVRE' | 'OCUPADA';

export interface DadosCadastroMesa {
  numero: number;
  capacidade: number;
}

export interface DadosAtualizacaoMesa {
  numero?: number;
  capacidade?: number;
}

export interface MesaListagem {
  id: number;
  numero: number;
  capacidade: number;
  status: StatusMesa;
}

export interface MesaDetalhamento {
  id: number;
  idRestaurante: number;
  numero: number;
  capacidade: number;
  status: StatusMesa;
  ativo: boolean;
}