import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ConfirmarCodigoReativacaoRequest,
  ConfirmarCodigoRequest,
  SolicitarCodigoRequest
} from '../models/recuperacao.model';

/**
 * Chamadas públicas (sem token) de recuperação de senha e reativação.
 * Todas respondem 204 sem corpo. O back nunca revela se o e-mail existe.
 */
@Injectable({ providedIn: 'root' })
export class RecuperacaoService {

  private readonly baseUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  solicitarCodigo(dados: SolicitarCodigoRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/recuperar-senha/solicitar`, dados);
  }

  confirmarCodigo(dados: ConfirmarCodigoRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/recuperar-senha/confirmar`, dados);
  }

  solicitarCodigoReativacao(dados: SolicitarCodigoRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/reativar-conta/solicitar`, dados);
  }

  confirmarReativacao(dados: ConfirmarCodigoReativacaoRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/reativar-conta/confirmar`, dados);
  }
}