export type StatusReserva = 'ATIVA' | 'CONCLUIDA' | 'CANCELADA';

export interface DadosCadastroReserva {
  idMesa: number;
  numPessoas: number;
  nomeCliente: string;
  /** Apenas dígitos, 10 ou 11 caracteres (regra do backend: \d{10,11}) */
  telefone: string;
  /** formato ISO aceito pelo Jackson/LocalDateTime, ex: "2026-09-20T20:30:00" */
  dataHora: string;
}

export interface DadosAtualizacaoReserva {
  idMesa?: number;
  numPessoas?: number;
  nomeCliente?: string;
  telefone?: string;
  dataHora?: string;
}

export interface ReservaListagem {
  id: number;
  idMesa: number;
  numPessoas: number;
  nomeCliente: string;
  telefone: string;
  dataHora: string;
  status: StatusReserva;
}

export interface ReservaDetalhamento extends ReservaListagem {
  idRestaurante: number;
}