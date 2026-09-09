import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardService, ResumoDashboard } from '../../../core/services/dashboard.service';
import { AuthService } from '../../../core/services/auth.service';

interface CartaoResumo {
  titulo: string;
  valor: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {

  nomeGerente = '';
  carregando = false;
  mensagemErro = '';
  cartoes: CartaoResumo[] = [];

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.nomeGerente = this.authService.getSessao()?.nomeFuncionario ?? '';
    this.carregarResumo();
  }

  private carregarResumo(): void {
    const restauranteId = this.authService.getRestauranteId();
    if (!restauranteId) {
      this.router.navigate(['/login']);
      return;
    }

    this.carregando = true;
    this.mensagemErro = '';

    this.dashboardService.buscarResumo(restauranteId).subscribe({
      next: (resumo) => {
        this.cartoes = this.montarCartoes(resumo);
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
        this.mensagemErro = 'Não foi possível carregar os indicadores do restaurante.';
      }
    });
  }

  private montarCartoes(resumo: ResumoDashboard): CartaoResumo[] {
    const formatoMoeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

    return [
      { titulo: 'Pedidos hoje', valor: String(resumo.pedidosHoje) },
      { titulo: 'Faturamento hoje', valor: formatoMoeda.format(resumo.faturamentoHoje) },
      { titulo: 'Ticket médio', valor: formatoMoeda.format(resumo.ticketMedio) },
      { titulo: 'Pedidos em andamento', valor: String(resumo.pedidosEmAndamento) },
      { titulo: 'Mesas ocupadas', valor: String(resumo.mesasOcupadas) },
      { titulo: 'Mesas disponíveis', valor: String(resumo.mesasDisponiveis) },
    ];
  }

  atualizar(): void {
    this.carregarResumo();
  }

  sair(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}