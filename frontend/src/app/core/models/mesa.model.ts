export type StatusMesa = 'OCUPADA' | 'LIVRE' | 'RESERVADA'; //remover RESERVADA quando for alterar esse arquivo

export interface Mesa {
  id?: number;
  numero: number;
  capacidade: number;
  status?: StatusMesa;
//  Reserva é entidade independente no backend, não campo de Mesa.
//  Mantido só pra não quebrar mapa-mesas.ts hoje. Remover quando esse componente for reescrito.
  reserva?: Reserva | null;
}

export interface CriarMesaRequest {
  numero: number;
  capacidade: number;
}

export interface AtualizarMesaRequest {
  numero: number;
  capacidade: number;
}

//  remover
export interface Reserva {
  id?: number;
  mesaId?: number;
  cliente: string;
  telefone: string;
  data: string;
  horario: string;
  pessoas: number;
}