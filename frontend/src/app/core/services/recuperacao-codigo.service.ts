import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import {
  ConfirmarRecuperacaoCodigoRequest,
  SolicitarRecuperacaoCodigoRequest
} from '../models/recuperacao.model';

/**
 * ===================== SERVIÇO TEMPORÁRIO (FAKE) =====================
 * A recuperação do código (PIN) do funcionário ainda não está na develop.
 * Quando o Murilo enviar o contrato, trocar os dois métodos por chamadas
 * HttpClient reais. Nenhuma tela precisa mudar.
 * Enquanto isso, o código de autenticação "000000" é aceito como correto.
 * =======================================================================
 */
@Injectable({ providedIn: 'root' })
export class RecuperacaoCodigoService {

  solicitar(dados: SolicitarRecuperacaoCodigoRequest): Observable<void> {
    return of(undefined).pipe(delay(600));
  }

  confirmar(dados: ConfirmarRecuperacaoCodigoRequest): Observable<void> {
    if (dados.codigoAutenticacao !== '000000') {
      return throwError(() => ({ status: 400, error: { campo: 'codigo', mensagem: 'Código incorreto' } })).pipe(delay(400));
    }
    return of(undefined).pipe(delay(600));
  }
}