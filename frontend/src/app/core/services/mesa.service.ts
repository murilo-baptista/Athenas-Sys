import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CriarMesaRequest, AtualizarMesaRequest, Mesa, StatusMesa } from '../models/mesa.model';

@Injectable({ providedIn: 'root' })
export class MesaService {

  private readonly baseUrl = `${environment.apiUrl}/restaurantes`;

  constructor(private http: HttpClient) {}

  listarPorRestaurante(restauranteId: number): Observable<Mesa[]> {
    return this.http.get<Mesa[]>(`${this.baseUrl}/${restauranteId}/mesas`);
  }

  criar(restauranteId: number, dados: CriarMesaRequest): Observable<Mesa> {
    return this.http.post<Mesa>(`${this.baseUrl}/${restauranteId}/mesas`, dados);
  }

  atualizar(restauranteId: number, mesaId: number, dados: AtualizarMesaRequest): Observable<Mesa> {
    return this.http.put<Mesa>(`${this.baseUrl}/${restauranteId}/mesas/${mesaId}`, dados);
  }

  ocuparMesa(restauranteId: number, mesaId: number, status: StatusMesa): Observable<Mesa> {
    return this.http.patch<Mesa>(`${this.baseUrl}/${restauranteId}/mesas/${mesaId}/ocupar`, {});
  }

  desocuparMesa(restauranteId: number, mesaId: number, status: StatusMesa): Observable<Mesa> {
    return this.http.patch<Mesa>(`${this.baseUrl}/${restauranteId}/mesas/${mesaId}/desocupar`, {});
  }
}