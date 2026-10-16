/**
 Contrato ainda não definido pelo back-end (item 5 da V3) — estes campos são um palpite, baseado no que o PDF descreve. Ajustar quando o back enviar o contrato definitivo.
 */
export interface SolicitarCodigoRequest {
  email: string;
}

export interface ConfirmarCodigoRequest {
  email: string;
  codigo: string;
  novaSenha: string;
}