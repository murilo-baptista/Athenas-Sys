import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CriarFuncionarioRequest, Funcionario } from '../models/funcionario.model';

@Injectable({ providedIn: 'root' })
export class FuncionarioService {

  private readonly baseUrl = `${environment.apiUrl}/funcionarios`;

  constructor(private http: HttpClient) {}

  listarPorRestaurante(restauranteId: number): Observable<Funcionario[]> {
    const params = new HttpParams().set('restauranteId', restauranteId);
    return this.http.get<Funcionario[]>(this.baseUrl, { params });
  }

  criar(dados: CriarFuncionarioRequest): Observable<Funcionario> {
    return this.http.post<Funcionario>(this.baseUrl, dados);
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}