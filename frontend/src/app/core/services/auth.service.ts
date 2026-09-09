import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  LoginFuncionarioRequest,
  LoginFuncionarioResponse,
  LoginRestauranteRequest,
  LoginRestauranteResponse,
  SessaoUsuario
} from '../models/auth.model';

const CHAVE_SESSAO = 'athenas_sessao';

/**
 * Responsável por autenticar o restaurante e os funcionários, e por manter
 * a sessão atual (token JWT) persistida no localStorage.
 *
 * Endpoints esperados no back-end (Spring Boot):
 *  POST /api/auth/login             -> login do restaurante
 *  POST /api/auth/funcionario/login -> login do funcionário dentro do restaurante
 */
@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly baseUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  loginRestaurante(dados: LoginRestauranteRequest): Observable<LoginRestauranteResponse> {
    return this.http.post<LoginRestauranteResponse>(`${this.baseUrl}/login`, dados).pipe(
      tap(resposta => {
        this.salvarSessao({
          token: resposta.token,
          tipo: 'RESTAURANTE',
          restauranteId: resposta.restauranteId,
          nomeRestaurante: resposta.nomeRestaurante
        });
      })
    );
  }

  loginFuncionario(dados: LoginFuncionarioRequest): Observable<LoginFuncionarioResponse> {
    return this.http.post<LoginFuncionarioResponse>(`${this.baseUrl}/funcionario/login`, dados).pipe(
      tap(resposta => {
        this.salvarSessao({
          token: resposta.token,
          tipo: 'FUNCIONARIO',
          restauranteId: dados.restauranteId,
          funcionarioId: resposta.funcionarioId,
          nomeFuncionario: resposta.nomeFuncionario,
          cargo: resposta.cargo
        });
      })
    );
  }

  logout(): void {
    localStorage.removeItem(CHAVE_SESSAO);
  }

  getSessao(): SessaoUsuario | null {
    const bruto = localStorage.getItem(CHAVE_SESSAO);
    if (!bruto) return null;
    try {
      return JSON.parse(bruto) as SessaoUsuario;
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    return this.getSessao()?.token ?? null;
  }

//  getRestauranteId(): number | null {
//    return this.getSessao()?.restauranteId ?? null;
//  }
//  Volte a usar quando a autenticação do backend estiver feita.

  getRestauranteId(): number | null {
    return 1;
  }

  getCargoFuncionario(): string | null {
    return this.getSessao()?.cargo ?? null;
  }

  isAutenticado(): boolean {
    return !!this.getToken();
  }

  /** Usado no meio do wizard de cadastro, antes de existir um login completo. */
  definirRestauranteIdTemporario(id: number, nomeRestaurante: string): void {
    this.salvarSessao({
      token: '',
      tipo: 'RESTAURANTE',
      restauranteId: id,
      nomeRestaurante
    });
  }

  private salvarSessao(sessao: SessaoUsuario): void {
    localStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
  }
}