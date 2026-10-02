import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MesaService } from '../../../core/services/mesa.service';
import { AuthService } from '../../../core/services/auth.service';
import { MesaListagem, StatusMesa } from '../../../core/models/mesa.model';

@Component({
  selector: 'app-mapa-mesas',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mapa-mesas.html',
  styleUrl: './mapa-mesas.css'
})
export class MapaMesasComponent implements OnInit {

  mesas: MesaListagem[] = [];
  carregando = false;
  mensagemErro = '';

  mesaExpandidaIndex: number | null = null;

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

  toggleMesa(index: number): void {
    this.mesaExpandidaIndex = this.mesaExpandidaIndex === index ? null : index;
  }

  alterarStatusMesa(mesa: MesaListagem, novoStatus: StatusMesa): void {
    if (mesa.status === novoStatus) return;

    const statusAnterior = mesa.status;
    mesa.status = novoStatus; // atualização otimista

    const acao$ = novoStatus === 'OCUPADA'
      ? this.mesaService.ocuparMesa(mesa.id)
      : this.mesaService.desocuparMesa(mesa.id);

    acao$.subscribe({
      error: () => {
        mesa.status = statusAnterior; // reverte se o back-end recusar
        this.mensagemErro = 'Não foi possível atualizar o status da mesa.';
      }
    });
  }

  fecharPainel(): void {
    this.mesaExpandidaIndex = null;
  }

  statusRotulo(status: StatusMesa): string {
    return status === 'OCUPADA' ? 'Ocupada' : 'Livre';
  }

  statusClasse(status: StatusMesa): string {
    return status === 'OCUPADA' ? 'status-ocupada' : 'status-livre';
  }
}