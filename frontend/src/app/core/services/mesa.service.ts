import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CriarMesaRequest, AtualizarMesaRequest, Mesa, Reserva, StatusMesa } from '../models/mesa.model';
import { Page } from '../models/pagina.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class MesaService {

  private readonly baseUrl = `${environment.apiUrl}/restaurantes`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  private get restauranteId(): number {
    return this.auth.getRestauranteId()!;
  }

  listarPorRestaurante(): Observable<Mesa[]> {
    return this.http.get<Page<Mesa>>(`${this.baseUrl}/${this.restauranteId}/mesas`).pipe(map(r => r.content));
  }

  criar(dados: CriarMesaRequest): Observable<Mesa> {
    return this.http.post<Mesa>(`${this.baseUrl}/${this.restauranteId}/mesas`, dados);
  }

  atualizar(mesaId: number, dados: AtualizarMesaRequest): Observable<Mesa> {
    return this.http.put<Mesa>(`${this.baseUrl}/${this.restauranteId}/mesas/${mesaId}`, dados);
  }

  ocuparMesa(mesaId: number): Observable<Mesa> {
    return this.http.patch<Mesa>(`${this.baseUrl}/${this.restauranteId}/mesas/${mesaId}/ocupar`, {});
  }

  desocuparMesa(mesaId: number): Observable<Mesa> {
    return this.http.patch<Mesa>(`${this.baseUrl}/${this.restauranteId}/mesas/${mesaId}/desocupar`, {});
  }

//  remover, colocado somente para rodar
  alterarStatus(mesaId: number, status: StatusMesa): Observable<Mesa> {
    return status === 'OCUPADA' ? this.ocuparMesa(mesaId) : this.desocuparMesa(mesaId);
  }

  salvarReserva(mesaId: number, dados: Reserva): Observable<Mesa> {
    return this.http.post<Mesa>(`${this.baseUrl}/${this.restauranteId}/mesas/${mesaId}/reserva`, dados);
  }

  cancelarReserva(mesaId: number): Observable<Mesa> {
    return this.http.delete<Mesa>(`${this.baseUrl}/${this.restauranteId}/mesas/${mesaId}/reserva`);
  }
}