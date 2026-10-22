import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificacaoService } from '../services/notificacao.service';

/** Nestas rotas o 401 significa "senha/código informado incorreto", e não "sessão expirada". */
const ROTAS_COM_CONFIRMACAO = ['/alterarSenha', '/alterarCodigo'];

/** No login, o 403 significa "conta desativada": quem trata é a própria tela de login. */
const ROTAS_DE_LOGIN = ['/auth/login', '/auth/funcionario/login'];

/** Telas sem sessão: o 403 delas é tratado pela própria tela. */
const TELAS_PUBLICAS = ['/login', '/recuperar-senha', '/reativar-restaurante', '/cadastro-restaurante'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificacao = inject(NotificacaoService);

  const token = authService.getToken();

  const requisicao = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(requisicao).pipe(
    catchError(erro => {
      const ehConfirmacaoDeSenha = ROTAS_COM_CONFIRMACAO.some(rota => req.url.endsWith(rota));
      const ehLogin = ROTAS_DE_LOGIN.some(rota => req.url.includes(rota));
      const naTelaPublica = TELAS_PUBLICAS.some(tela => router.url.startsWith(tela));

      if (erro.status === 401 && !ehConfirmacaoDeSenha) {
        authService.logout();
        router.navigate(['/login']);
      }

      // O back responde 403 tanto para "sem permissão" quanto para "não está logado"
      // (inclusive token vencido). Sem sessão válida, volta ao login; com sessão
      // válida, avisa que a pessoa não pode fazer aquela ação.
      if (erro.status === 403 && !ehLogin && !naTelaPublica) {
        if (!token || authService.tokenExpirado()) {
          authService.logout();
          router.navigate(['/login']);
        } else {
          notificacao.erro('Você não tem permissão para realizar esta ação.');
        }
      }

      return throwError(() => erro);
    })
  );
};