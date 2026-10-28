/**
 * Extrai a mensagem de erro devolvida pelo back:
 *  - objeto { campo, mensagem }            (ex.: código incorreto)
 *  - lista  [{ campo, mensagem }, ...]     (corpo inválido)
 *  - texto simples                         (ex.: 429, muitos pedidos)
 */
export function mensagemDeErro(erro: any, padrao: string): string {
  const corpo = erro?.error;

  if (typeof corpo === 'string' && corpo.trim()) return corpo;
  if (Array.isArray(corpo) && corpo.length > 0) return corpo[0]?.mensagem ?? padrao;
  if (corpo?.mensagem) return corpo.mensagem;
  if (erro?.status === 429) return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';

  return padrao;
}