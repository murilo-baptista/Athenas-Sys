import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CriarMesaRequest, Mesa, Reserva, StatusMesa } from '../models/mesa.model';

@Injectable({ providedIn: 'root' })
export class MesaService {

  private readonly baseUrl = `${environment.apiUrl}/mesas`;

  constructor(private http: HttpClient) {}

  listarPorRestaurante(restauranteId: number): Observable<Mesa[]> {
    const params = new HttpParams().set('restauranteId', restauranteId);
    return this.http.get<Mesa[]>(this.baseUrl, { params });
  }

  criar(dados: CriarMesaRequest): Observable<Mesa> {
    return this.http.post<Mesa>(this.baseUrl, dados);
  }

  alterarStatus(mesaId: number, status: StatusMesa): Observable<Mesa> {
    return this.http.patch<Mesa>(`${this.baseUrl}/${mesaId}/status`, { status });
  }

  salvarReserva(mesaId: number, reserva: Reserva): Observable<Mesa> {
    return this.http.post<Mesa>(`${this.baseUrl}/${mesaId}/reserva`, reserva);
  }

  cancelarReserva(mesaId: number): Observable<Mesa> {
    return this.http.delete<Mesa>(`${this.baseUrl}/${mesaId}/reserva`);
  }
}