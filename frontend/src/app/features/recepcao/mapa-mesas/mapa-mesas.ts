import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Reserva {
  cliente: string;
  telefone: string;
  data: string;
  horario: string;
  pessoas: number;
}

interface Mesa {
  numero: string;
  lugares: number;
  status: 'ocupada' | 'disponivel' | 'reservada';
  reserva: Reserva | null;
}

@Component({
  selector: 'app-mapa-mesas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mapa-mesas.html',
  styleUrl: './mapa-mesas.css'
})
export class MapaMesasComponent {

  mesas: Mesa[] = [
    { numero: '01', lugares: 3, status: 'ocupada', reserva: null },
    { numero: '02', lugares: 4, status: 'disponivel', reserva: null },
    { numero: '03', lugares: 6, status: 'ocupada', reserva: null },
    { numero: '04', lugares: 2, status: 'ocupada', reserva: null },
    {
      numero: '04', lugares: 4, status: 'reservada',
      reserva: { cliente: 'Maria Souza', telefone: '(11) 99999-0000', data: '2026-07-28', horario: '20:30', pessoas: 4 }
    },
    { numero: '05', lugares: 6, status: 'disponivel', reserva: null },
    { numero: '06', lugares: 4, status: 'disponivel', reserva: null },
  ];

  mesaExpandidaIndex: number | null = null;
  modoEdicao = false;
  formReserva: Reserva = this.formVazio();

  private formVazio(): Reserva {
    return { cliente: '', telefone: '', data: '', horario: '', pessoas: 1 };
  }

  toggleMesa(index: number): void {
    if (this.mesaExpandidaIndex === index) {
      this.fecharPainel();
      return;
    }

    this.mesaExpandidaIndex = index;
    this.modoEdicao = false;

    const mesa = this.mesas[index];
    this.formReserva = mesa.reserva ? { ...mesa.reserva } : this.formVazio();
  }

  alterarStatusMesa(mesa: Mesa, novoStatus: 'ocupada' | 'disponivel'): void {
    if (mesa.status === novoStatus) return;
    mesa.status = novoStatus;
  }

  iniciarEdicao(mesa: Mesa): void {
    this.modoEdicao = true;
    this.formReserva = mesa.reserva ? { ...mesa.reserva } : this.formVazio();
  }

  confirmarReserva(mesa: Mesa): void {
    mesa.reserva = { ...this.formReserva };
    mesa.status = 'reservada';
    this.fecharPainel();
  }

  cancelarReserva(mesa: Mesa): void {
    mesa.reserva = null;
    mesa.status = 'disponivel';
    this.fecharPainel();
  }

  cancelarFormulario(): void {
    this.fecharPainel();
  }

  private fecharPainel(): void {
    this.mesaExpandidaIndex = null;
    this.modoEdicao = false;
    this.formReserva = this.formVazio();
  }

  statusRotulo(status: Mesa['status']): string {
    switch (status) {
      case 'ocupada': return 'Ocupada';
      case 'disponivel': return 'Disponível';
      case 'reservada': return 'Reservada';
    }
  }

  formatarData(data: string): string {
    if (!data) return '';
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }
}