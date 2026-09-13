import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MesaService } from '../../../core/services/mesa.service';
import { AuthService } from '../../../core/services/auth.service';
import { Mesa, Reserva, StatusMesa } from '../../../core/models/mesa.model';

@Component({
  selector: 'app-mapa-mesas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mapa-mesas.html',
  styleUrl: './mapa-mesas.css'
})
export class MapaMesasComponent implements OnInit {

  mesas: Mesa[] = [];
  carregando = false;
  mensagemErro = '';

  mesaExpandidaIndex: number | null = null;
  modoEdicao = false;
  formReserva: Reserva = this.formVazio();

  private restauranteId!: number;

  constructor(private mesaService: MesaService, private authService: AuthService) {}

  ngOnInit(): void {
    this.restauranteId = this.authService.getRestauranteId()!;
    this.carregarMesas();
  }

  private carregarMesas(): void {
    this.carregando = true;
    this.mensagemErro = '';

    this.mesaService.listarPorRestaurante().subscribe({
      next: (mesas) => {
        this.mesas = mesas;
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
        this.mensagemErro = 'Não foi possível carregar o mapa de mesas.';
      }
    });
  }

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

  alterarStatusMesa(mesa: Mesa, novoStatus: StatusMesa): void {
    if (mesa.status === novoStatus || !mesa.id) return;

    const statusAnterior = mesa.status;
    mesa.status = novoStatus; // atualização otimista

    this.mesaService.alterarStatus(mesa.id, novoStatus).subscribe({
      error: () => {
        mesa.status = statusAnterior; // reverte se o back-end recusar
        this.mensagemErro = 'Não foi possível atualizar o status da mesa.';
      }
    });
  }

  iniciarEdicao(mesa: Mesa): void {
    this.modoEdicao = true;
    this.formReserva = mesa.reserva ? { ...mesa.reserva } : this.formVazio();
  }

  confirmarReserva(mesa: Mesa): void {
    if (!mesa.id) return;

    this.mesaService.salvarReserva(mesa.id, this.formReserva).subscribe({
      next: (mesaAtualizada) => {
        mesa.reserva = mesaAtualizada.reserva;
        mesa.status = mesaAtualizada.status ?? 'RESERVADA';
        this.fecharPainel();
      },
      error: () => this.mensagemErro = 'Não foi possível salvar a reserva.'
    });
  }

  cancelarReserva(mesa: Mesa): void {
    if (!mesa.id) return;

    this.mesaService.cancelarReserva(mesa.id).subscribe({
      next: () => {
        mesa.reserva = null;
        mesa.status = 'LIVRE';
        this.fecharPainel();
      },
      error: () => this.mensagemErro = 'Não foi possível cancelar a reserva.'
    });
  }

  cancelarFormulario(): void {
    this.fecharPainel();
  }

  private fecharPainel(): void {
    this.mesaExpandidaIndex = null;
    this.modoEdicao = false;
    this.formReserva = this.formVazio();
  }

  statusRotulo(status: StatusMesa | undefined): string {
    switch (status) {
      case 'OCUPADA': return 'Ocupada';
      case 'LIVRE': return 'Livre';
      case 'RESERVADA': return 'Reservada';
      default: return '';
    }
  }

  statusClasse(status: StatusMesa | undefined): string {
    switch (status) {
      case 'OCUPADA': return 'status-ocupada';
      case 'LIVRE': return 'status-livre';
      case 'RESERVADA': return 'status-reservada';
      default: return '';
    }
  }

  formatarData(data: string): string {
    if (!data) return '';
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }
}