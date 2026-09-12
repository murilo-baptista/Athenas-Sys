import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { Page } from '../models/pagina.model';
import {
  DadosAtualizacaoMesa,
  DadosCadastroMesa,
  MesaDetalhamento,
  MesaListagem
} from '../models/mesa.model';

/**
 * Endpoints (ver MesaController.java):
 *  POST   /restaurantes/{idRestaurante}/mesas
 *  GET    /restaurantes/{idRestaurante}/mesas
 *  GET    /restaurantes/{idRestaurante}/mesas/{idMesa}
 *  PUT    /restaurantes/{idRestaurante}/mesas/{idMesa}
 *  DELETE /restaurantes/{idRestaurante}/mesas/{idMesa}
 *  PATCH  /restaurantes/{idRestaurante}/mesas/{idMesa}/ocupar
 *  PATCH  /restaurantes/{idRestaurante}/mesas/{idMesa}/desocupar
 */
@Injectable({ providedIn: 'root' })
export class MesaService {

  private readonly baseUrl = `${environment.apiUrl}/restaurantes`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  private get restauranteId(): number {
    return this.auth.getRestauranteId()!;
  }

  listarPorRestaurante(): Observable<MesaListagem[]> {
    return this.http
      .get<Page<MesaListagem>>(`${this.baseUrl}/${this.restauranteId}/mesas`)
      .pipe(map(pagina => pagina.content));
  }

  detalhar(mesaId: number): Observable<MesaDetalhamento> {
    return this.http.get<MesaDetalhamento>(`${this.baseUrl}/${this.restauranteId}/mesas/${mesaId}`);
  }

  criar(dados: DadosCadastroMesa): Observable<MesaDetalhamento> {
    return this.http.post<MesaDetalhamento>(`${this.baseUrl}/${this.restauranteId}/mesas`, dados);
  }

  atualizar(mesaId: number, dados: DadosAtualizacaoMesa): Observable<MesaDetalhamento> {
    return this.http.put<MesaDetalhamento>(`${this.baseUrl}/${this.restauranteId}/mesas/${mesaId}`, dados);
  }

  desativar(mesaId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${this.restauranteId}/mesas/${mesaId}`);
  }

  ocuparMesa(mesaId: number): Observable<MesaDetalhamento> {
    return this.http.patch<MesaDetalhamento>(`${this.baseUrl}/${this.restauranteId}/mesas/${mesaId}/ocupar`, {});
  }

  desocuparMesa(mesaId: number): Observable<MesaDetalhamento> {
    return this.http.patch<MesaDetalhamento>(`${this.baseUrl}/${this.restauranteId}/mesas/${mesaId}/desocupar`, {});
  }
}