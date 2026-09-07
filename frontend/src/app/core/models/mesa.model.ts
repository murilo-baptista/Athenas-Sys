export type StatusMesa = 'OCUPADA' | 'LIVRE';

export interface Mesa {
  id?: number;
  numero: number;
  capacidade: number;
  status?: StatusMesa;
}

export interface CriarMesaRequest {
  numero: number;
  capacidade: number;
}

export interface AtualizarMesaRequest {
  numero: number;
  capacidade: number;
}