import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ResumoDashboard {
  pedidosHoje: number;
  faturamentoHoje: number;
  mesasOcupadas: number;
  mesasDisponiveis: number;
  ticketMedio: number;
  pedidosEmAndamento: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {

  private readonly baseUrl = `${environment.apiUrl}/restaurantes`;

  constructor(private http: HttpClient) {}

  buscarResumo(restauranteId: number): Observable<ResumoDashboard> {
    return this.http.get<ResumoDashboard>(`${this.baseUrl}/${restauranteId}/dashboard/resumo`);
  }
}