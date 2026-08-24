export type StatusMesa = 'OCUPADA' | 'DISPONIVEL' | 'RESERVADA';

export interface Mesa {
  id?: number;
  restauranteId?: number;
  numero: string;
  capacidade: number;
  status?: StatusMesa;
  reserva?: Reserva | null;
}

export interface CriarMesaRequest {
  numero: string;
  capacidade: number;
  restauranteId: number;
}

export interface Reserva {
  id?: number;
  mesaId?: number;
  cliente: string;
  telefone: string;
  data: string;
  horario: string;
  pessoas: number;
}