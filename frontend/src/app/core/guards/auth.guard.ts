import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Exige QUALQUER sessão ativa. Usar em: /menu, /autenticacao */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAutenticado()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

/** Exige FUNCIONÁRIO autenticado com o cargo correto. Usar nas telas operacionais. */
export const funcionarioGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const sessao = auth.getSessao();

  if (!sessao || sessao.tipo !== 'FUNCIONARIO') {
    router.navigate(['/menu']);
    return false;
  }

  const cargoEsperado = route.data?.['cargo'] as string | undefined;
  if (cargoEsperado && sessao.cargo !== cargoEsperado) {
    router.navigate(['/menu']);
    return false;
  }

  return true;
};