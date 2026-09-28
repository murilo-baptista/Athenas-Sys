import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Nestas rotas o 401 significa "senha/código informado incorreto", e não "sessão expirada". */
const ROTAS_COM_CONFIRMACAO = ['/alterarSenha', '/alterarCodigo'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();

  const requisicao = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(requisicao).pipe(
    catchError(erro => {
      const ehConfirmacaoDeSenha = ROTAS_COM_CONFIRMACAO.some(rota => req.url.endsWith(rota));

      if (erro.status === 401 && !ehConfirmacaoDeSenha) {
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => erro);
    })
  );
};