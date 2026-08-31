import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  private readonly baseUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  buscarResumo(restauranteId: number): Observable<ResumoDashboard> {
    const params = new HttpParams().set('restauranteId', restauranteId);
    return this.http.get<ResumoDashboard>(`${this.baseUrl}/resumo`, { params });
  }
}