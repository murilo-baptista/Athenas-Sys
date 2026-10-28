/** Contrato definitivo do back (RecuperacaoContaController). */

export interface SolicitarCodigoRequest {
  email: string;
}

/** POST /auth/recuperar-senha/confirmar */
export interface ConfirmarCodigoRequest {
  email: string;
  codigo: string;
  novaSenha: string;
}

/** POST /auth/reativar-conta/confirmar (reativar não troca senha) */
export interface ConfirmarCodigoReativacaoRequest {
  email: string;
  codigo: string;
}

/* ---- Recuperação do código (PIN) do funcionário ----
   Contrato definitivo do back (RecuperacaoContaController):
   DadosSolicitacaoCodigoFuncionario e DadosConfirmacaoCodigoFuncionario. */

/** POST /auth/funcionario/recuperar-codigo/solicitar */
export interface SolicitarRecuperacaoCodigoRequest {
  usuario: string;
}

/** POST /auth/funcionario/recuperar-codigo/confirmar */
export interface ConfirmarRecuperacaoCodigoRequest {
  usuario: string;
  /** Código recebido por e-mail (no back o campo se chama apenas "codigo"). */
  codigo: string;
  /** Novo código de acesso do funcionário. */
  novoCodigo: string;
}