import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CriarFuncionarioRequest, Funcionario } from '../models/funcionario.model';

@Injectable({ providedIn: 'root' })
export class FuncionarioService {

  private readonly baseUrl = `${environment.apiUrl}/restaurantes`;

  constructor(private http: HttpClient) {}

  listarPorRestaurante(restauranteId: number): Observable<Funcionario[]> {
    return this.http.get<Funcionario[]>(`${this.baseUrl}/${restauranteId}/funcionarios`);
  }

  criar(restauranteId: number, dados: CriarFuncionarioRequest): Observable<Funcionario> {
    return this.http.post<Funcionario>(`${this.baseUrl}/${restauranteId}/funcionarios`, dados);
  }

  atualizar(restauranteId: number, id: number, dados: AtualizarFuncionarioRequest): Observable<Funcionario> {
      return this.http.put<Funcionario>(`${this.baseUrl}/${restauranteId}/funcionarios/${id}`, dados);
    }

  remover(restauranteId: number, id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${restauranteId}/funcionarios/${id}`);
  }
}