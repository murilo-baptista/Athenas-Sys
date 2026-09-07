import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CadastroRestauranteRequest, AtualizarRestauranteRequest, Restaurante } from '../models/restaurante.model';
import { Page } from '../models/pagina.model';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RestauranteService {

  private readonly baseUrl = `${environment.apiUrl}/restaurantes`;

  constructor(private http: HttpClient) {}

  cadastrar(dados: CadastroRestauranteRequest): Observable<Restaurante> {
    return this.http.post<Restaurante>(this.baseUrl, dados);
  }

  buscar(): Observable<Restaurante[]> {
    return this.http.get<Page<Restaurante>>(`${this.baseUrl}`).pipe(map(r => r.content));
  }

  atualizar(id: number, dados: AtualizarRestauranteRequest): Observable<Restaurante> {
    return this.http.put<Restaurante>(`${this.baseUrl}/${id}`, dados)
  }

  remover(id: number): Observable<Restaurante> {
    return this.http.delete<Restaurante>(`${this.baseUrl}/${id}`) 
  }

  buscarPorId(id: number): Observable<Restaurante> {
    return this.http.get<Restaurante>(`${this.baseUrl}/${id}`);
  }
}