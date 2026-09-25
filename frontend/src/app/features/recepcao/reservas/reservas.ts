import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ReservaService } from '../../../core/services/reserva.service';
import { MesaService } from '../../../core/services/mesa.service';
import { ReservaListagem, DadosCadastroReserva } from '../../../core/models/reserva.model';
import { MesaListagem } from '../../../core/models/mesa.model';

interface FormularioReserva {
  idMesa: number | null;
  numPessoas: number | null;
  nomeCliente: string;
  telefone: string;
  data: string;
  horario: string;
}

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reservas.html'
})
export class ReservasComponent implements OnInit {

  reservas: ReservaListagem[] = [];
  mesas: MesaListagem[] = [];

  carregando = false;
  mensagemErro = '';
  salvando = false;

  idEmEdicao: number | null = null;
  form: FormularioReserva = this.formVazio();

  filtroMesa: number | 'todas' = 'todas';
  filtroDataInicio = '';
  filtroDataFim = '';

  constructor(
    private reservaService: ReservaService,
    private mesaService: MesaService
  ) {}

  ngOnInit(): void {
    this.mesaService.listarPorRestaurante().subscribe(mesas => (this.mesas = mesas));
    this.carregarReservas();
  }

  private formVazio(): FormularioReserva {
    return { idMesa: null, numPessoas: 1, nomeCliente: '', telefone: '', data: '', horario: '' };
  }

  carregarReservas(): void {
    this.carregando = true;
    this.mensagemErro = '';

    this.reservaService.listarPorRestaurante().subscribe({
      next: (reservas) => {
        this.reservas = reservas;
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
        this.mensagemErro = 'Não foi possível carregar as reservas.';
      }
    });
  }

  reservasFiltradas(): ReservaListagem[] {
    return this.reservas.filter(reserva => {
      if (this.filtroMesa !== 'todas' && reserva.idMesa !== this.filtroMesa) {
        return false;
      }

      const dataReserva = reserva.dataHora.slice(0, 10);

      if (this.filtroDataInicio && dataReserva < this.filtroDataInicio) return false;
      if (this.filtroDataFim && dataReserva > this.filtroDataFim) return false;

      return true;
    });
  }

  numeroMesa(idMesa: number): number | string {
    return this.mesas.find(m => m.id === idMesa)?.numero ?? idMesa;
  }

  iniciarEdicao(reserva: ReservaListagem): void {
    this.idEmEdicao = reserva.id;
    const [data, horaCompleta] = reserva.dataHora.split('T');
    this.form = {
      idMesa: reserva.idMesa,
      numPessoas: reserva.numPessoas,
      nomeCliente: reserva.nomeCliente,
      telefone: reserva.telefone,
      data,
      horario: (horaCompleta ?? '00:00').slice(0, 5)
    };
  }

  cancelarEdicao(): void {
    this.idEmEdicao = null;
    this.form = this.formVazio();
  }

  salvar(): void {
    if (!this.form.idMesa || !this.form.numPessoas || !this.form.nomeCliente.trim() ||
        !this.form.telefone.trim() || !this.form.data || !this.form.horario) {
      this.mensagemErro = 'Preencha todos os campos da reserva.';
      return;
    }

    const dados: DadosCadastroReserva = {
      idMesa: this.form.idMesa,
      numPessoas: this.form.numPessoas,
      nomeCliente: this.form.nomeCliente.trim(),
      telefone: this.form.telefone.replace(/\D/g, ''),
      dataHora: `${this.form.data}T${this.form.horario}:00`
    };

    this.salvando = true;
    this.mensagemErro = '';

    const requisicao$ = this.idEmEdicao
      ? this.reservaService.atualizar(this.idEmEdicao, dados)
      : this.reservaService.criar(dados);

    requisicao$.subscribe({
      next: () => {
        this.salvando = false;
        this.cancelarEdicao();
        this.carregarReservas();
      },
      error: () => {
        this.salvando = false;
        this.mensagemErro = 'Não foi possível salvar a reserva. Verifique os dados (telefone deve ter 10 ou 11 dígitos).';
      }
    });
  }

  concluir(reserva: ReservaListagem): void {
    this.reservaService.concluir(reserva.id).subscribe({
      next: (atualizada) => (reserva.status = atualizada.status),
      error: () => (this.mensagemErro = 'Não foi possível concluir a reserva.')
    });
  }

  cancelar(reserva: ReservaListagem): void {
    this.reservaService.cancelar(reserva.id).subscribe({
      next: (atualizada) => (reserva.status = atualizada.status),
      error: () => (this.mensagemErro = 'Não foi possível cancelar a reserva.')
    });
  }

  statusRotulo(status: ReservaListagem['status']): string {
    switch (status) {
      case 'ATIVA': return 'Ativa';
      case 'CONCLUIDA': return 'Concluída';
      case 'CANCELADA': return 'Cancelada';
    }
  }
}