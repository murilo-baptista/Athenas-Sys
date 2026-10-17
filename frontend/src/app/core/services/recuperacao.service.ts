import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { ConfirmarCodigoRequest, ConfirmarCodigoReativacaoRequest, SolicitarCodigoRequest } from '../models/recuperacao.model';

/**
 * ===================== SERVIÇO TEMPORÁRIO (FAKE) =====================
 * O back-end ainda não tem rota de recuperação de senha (item 5 da V3,
 * "em andamento" no PDF do Murilo). Este service simula as duas chamadas
 * para a tela poder ser construída e testada agora.
 *
 * QUANDO O BACK ENTREGAR A ROTA DE VERDADE:
 * - Trocar os dois métodos abaixo por chamadas reais com HttpClient,
 *   no mesmo padrão dos outros services (ver mesa.service.ts).
 * - Nenhuma tela precisa mudar, só este arquivo.
 * =======================================================================
 */
@Injectable({ providedIn: 'root' })
export class RecuperacaoService {

  /** Simula: "Se o e-mail existir, enviamos um código." Sempre responde sucesso, sem revelar se o e-mail existe de verdade (é assim que o PDF pede). */
  solicitarCodigo(dados: SolicitarCodigoRequest): Observable<void> {
    return of(undefined).pipe(delay(600));
  }

  /**
   * Simula a confirmação do código. Enquanto o back não existe, o código
   * fixo "000000" é aceito como válido, para dar pra testar a tela.
   * Qualquer outro valor simula "código incorreto".
   */
  confirmarCodigo(dados: ConfirmarCodigoRequest): Observable<void> {
    if (dados.codigo !== '000000') {
      return throwError(() => ({ status: 400, error: { mensagem: 'Código incorreto.' } })).pipe(delay(400));
    }
    return of(undefined).pipe(delay(600));
  }

  /** Mesmo mecanismo de "esqueci minha senha", usado para reativar um restaurante desativado. */
  solicitarCodigoReativacao(dados: SolicitarCodigoRequest): Observable<void> {
    return of(undefined).pipe(delay(600));
  }

  /** Confirma o código de reativação. Código fixo "000000" simula sucesso, igual à recuperação de senha. */
  confirmarReativacao(dados: ConfirmarCodigoReativacaoRequest): Observable<void> {
    if (dados.codigo !== '000000') {
      return throwError(() => ({ status: 400, error: { mensagem: 'Código incorreto.' } })).pipe(delay(400));
    }
    return of(undefined).pipe(delay(600));
  }
}