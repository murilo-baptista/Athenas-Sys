import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { Page } from '../models/pagina.model';
import {
  DadosAtualizacaoProduto,
  DadosCadastroProduto,
  ProdutoDetalhamento,
  ProdutoListagem
} from '../models/produto.model';

/** Endpoints: ver ProdutoController.java (restaurantes/{idRestaurante}/produtos) */
@Injectable({ providedIn: 'root' })
export class ProdutoService {

  private readonly baseUrl = `${environment.apiUrl}/restaurantes`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  private get restauranteId(): number {
    return this.auth.getRestauranteId()!;
  }

  listarPorRestaurante(): Observable<ProdutoListagem[]> {
    return this.http
      .get<Page<ProdutoListagem>>(`${this.baseUrl}/${this.restauranteId}/produtos`)
      .pipe(map(pagina => pagina.content));
  }

  criar(dados: DadosCadastroProduto): Observable<ProdutoDetalhamento> {
    return this.http.post<ProdutoDetalhamento>(`${this.baseUrl}/${this.restauranteId}/produtos`, dados);
  }

  atualizar(produtoId: number, dados: DadosAtualizacaoProduto): Observable<ProdutoDetalhamento> {
    return this.http.put<ProdutoDetalhamento>(`${this.baseUrl}/${this.restauranteId}/produtos/${produtoId}`, dados);
  }

  desativar(produtoId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${this.restauranteId}/produtos/${produtoId}`);
  }
}