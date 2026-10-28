import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ConfirmarRecuperacaoCodigoRequest,
  SolicitarRecuperacaoCodigoRequest
} from '../models/recuperacao.model';

/**
 * Recuperação do código (PIN) de um funcionário.
 *
 * Diferente da recuperação de senha, estas rotas exigem o token do
 * RESTAURANTE (o back recusa com 403 se a sessão for de funcionário).
 * O código de confirmação é enviado ao e-mail do restaurante, e não ao
 * funcionário. Ambas respondem 204 sem corpo.
 *
 * Endpoints (ver RecuperacaoContaController.java):
 *  POST /auth/funcionario/recuperar-codigo/solicitar
 *  POST /auth/funcionario/recuperar-codigo/confirmar
 */
@Injectable({ providedIn: 'root' })
export class RecuperacaoCodigoService {

  private readonly baseUrl = `${environment.apiUrl}/auth/funcionario/recuperar-codigo`;

  constructor(private http: HttpClient) {}

  solicitar(dados: SolicitarRecuperacaoCodigoRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/solicitar`, dados);
  }

  confirmar(dados: ConfirmarRecuperacaoCodigoRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/confirmar`, dados);
  }
}