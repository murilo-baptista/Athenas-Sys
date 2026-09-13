import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { Page } from '../models/pagina.model';
import {
  CategoriaDetalhamento,
  CategoriaListagem,
  DadosAtualizacaoCategoria,
  DadosCadastroCategoria
} from '../models/categoria.model';

/** Endpoints: ver CategoriaController.java (restaurantes/{idRestaurante}/categorias) */
@Injectable({ providedIn: 'root' })
export class CategoriaService {

  private readonly baseUrl = `${environment.apiUrl}/restaurantes`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  private get restauranteId(): number {
    return this.auth.getRestauranteId()!;
  }

  listarPorRestaurante(): Observable<CategoriaListagem[]> {
    return this.http
      .get<Page<CategoriaListagem>>(`${this.baseUrl}/${this.restauranteId}/categorias`)
      .pipe(map(pagina => pagina.content));
  }

  criar(dados: DadosCadastroCategoria): Observable<CategoriaDetalhamento> {
    return this.http.post<CategoriaDetalhamento>(`${this.baseUrl}/${this.restauranteId}/categorias`, dados);
  }

  atualizar(categoriaId: number, dados: DadosAtualizacaoCategoria): Observable<CategoriaDetalhamento> {
    return this.http.put<CategoriaDetalhamento>(`${this.baseUrl}/${this.restauranteId}/categorias/${categoriaId}`, dados);
  }

  desativar(categoriaId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${this.restauranteId}/categorias/${categoriaId}`);
  }
}