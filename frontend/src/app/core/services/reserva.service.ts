import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { Page } from '../models/pagina.model';
import {
  DadosAtualizacaoReserva,
  DadosCadastroReserva,
  ReservaDetalhamento,
  ReservaListagem
} from '../models/reserva.model';

/**
 * Endpoints: ver ReservaController.java (restaurantes/{idRestaurante}/reservas)
 * Não existe PATCH para "reativar" uma reserva: ATIVA é o status inicial e
 * só pode transicionar para CONCLUIDA ou CANCELADA.
 */
@Injectable({ providedIn: 'root' })
export class ReservaService {

  private readonly baseUrl = `${environment.apiUrl}/restaurantes`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  private get restauranteId(): number {
    return this.auth.getRestauranteId()!;
  }

  listarPorRestaurante(): Observable<ReservaListagem[]> {
    return this.http
      .get<Page<ReservaListagem>>(`${this.baseUrl}/${this.restauranteId}/reservas`)
      .pipe(map(pagina => pagina.content));
  }

  criar(dados: DadosCadastroReserva): Observable<ReservaDetalhamento> {
    return this.http.post<ReservaDetalhamento>(`${this.baseUrl}/${this.restauranteId}/reservas`, dados);
  }

  atualizar(reservaId: number, dados: DadosAtualizacaoReserva): Observable<ReservaDetalhamento> {
    return this.http.put<ReservaDetalhamento>(`${this.baseUrl}/${this.restauranteId}/reservas/${reservaId}`, dados);
  }

  concluir(reservaId: number): Observable<ReservaDetalhamento> {
    return this.http.patch<ReservaDetalhamento>(`${this.baseUrl}/${this.restauranteId}/reservas/${reservaId}/concluir`, {});
  }

  cancelar(reservaId: number): Observable<ReservaDetalhamento> {
    return this.http.patch<ReservaDetalhamento>(`${this.baseUrl}/${this.restauranteId}/reservas/${reservaId}/cancelar`, {});
  }
}