import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CriarFuncionarioRequest, AtualizarFuncionarioRequest, Funcionario } from '../models/funcionario.model';
import { Page } from '../models/pagina.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class FuncionarioService {

  private readonly baseUrl = `${environment.apiUrl}/restaurantes`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  private get restauranteId(): number {
    return this.auth.getRestauranteId()!;
  }

  listarPorRestaurante(): Observable<Funcionario[]> {
    return this.http.get<Page<Funcionario>>(`${this.baseUrl}/${this.restauranteId}/funcionarios`).pipe(map(r => r.content));
  }

  criar(dados: CriarFuncionarioRequest): Observable<Funcionario> {
    return this.http.post<Funcionario>(`${this.baseUrl}/${this.restauranteId}/funcionarios`, dados);
  }

  atualizar(id: number, dados: AtualizarFuncionarioRequest): Observable<Funcionario> {
      return this.http.put<Funcionario>(`${this.baseUrl}/${this.restauranteId}/funcionarios/${id}`, dados);
    }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${this.restauranteId}/funcionarios/${id}`);
  }
}