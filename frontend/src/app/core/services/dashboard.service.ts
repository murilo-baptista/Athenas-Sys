import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { MesaService } from './mesa.service';
import { PedidoService } from './pedido.service';
import { MesaListagem } from '../models/mesa.model';
import { PedidoListagem } from '../models/pedido.model';

export interface ResumoDashboard {
  pedidosHoje: number;
  faturamentoHoje: number;
  mesasOcupadas: number;
  mesasDisponiveis: number;
  ticketMedio: number;
}

/**
 * Não existe endpoint de dashboard no back-end (confirmado com o
 * responsável pelo back). Os indicadores são calculados aqui, a partir
 * das listagens de mesas e pedidos que já existem.
 */
@Injectable({ providedIn: 'root' })
export class DashboardService {

  constructor(
    private mesaService: MesaService,
    private pedidoService: PedidoService
  ) {}

  buscarResumo(): Observable<ResumoDashboard> {
    return forkJoin({
      mesas: this.mesaService.listarPorRestaurante(),
      pedidos: this.pedidoService.listar()
    }).pipe(
      map(({ mesas, pedidos }) => this.calcularResumo(mesas, pedidos))
    );
  }

  private calcularResumo(mesas: MesaListagem[], pedidos: PedidoListagem[]): ResumoDashboard {
    const hoje = new Date();
    const pedidosHoje = pedidos.filter(pedido => this.ehMesmoDia(new Date(pedido.dataHora), hoje));

    const faturamentoHoje = pedidosHoje.reduce((soma, pedido) => soma + pedido.valorTotal, 0);
    const ticketMedio = pedidosHoje.length > 0 ? faturamentoHoje / pedidosHoje.length : 0;

    return {
      pedidosHoje: pedidosHoje.length,
      faturamentoHoje,
      ticketMedio,
      mesasOcupadas: mesas.filter(mesa => mesa.status === 'OCUPADA').length,
      mesasDisponiveis: mesas.filter(mesa => mesa.status === 'LIVRE').length
    };
  }

  private ehMesmoDia(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear()
      && a.getMonth() === b.getMonth()
      && a.getDate() === b.getDate();
  }
}