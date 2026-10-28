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
   PROVISÓRIO: o back ainda não publicou este contrato. Ajustar os nomes
   quando o Murilo enviar (dto/recuperacao na develop). */
export interface SolicitarRecuperacaoCodigoRequest {
  usuario: string;
}

export interface ConfirmarRecuperacaoCodigoRequest {
  usuario: string;
  codigoAutenticacao: string;
  novoCodigo: string;
}