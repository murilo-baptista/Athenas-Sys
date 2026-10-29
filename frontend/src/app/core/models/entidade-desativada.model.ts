/**
 * Corpo do 409 devolvido pelo back ao cadastrar (POST) algo que já existe
 * DESATIVADO (ver DadosEntidadeDesativada.java).
 */
export interface EntidadeDesativada {
  codigo: 'ENTIDADE_DESATIVADA';
  entidade: 'categoria' | 'produto' | 'mesa' | 'funcionario';
  id: number;
  mensagem: string;
}

/**
 * Distingue os dois tipos de 409 do back:
 *  - objeto com codigo = "ENTIDADE_DESATIVADA" -> dá para reativar;
 *  - lista de erros { campo, mensagem }        -> duplicado comum (ativo).
 */
export function ehEntidadeDesativada(erro: any): erro is { status: 409; error: EntidadeDesativada } {
  const corpo = erro?.error;
  return erro?.status === 409
    && !!corpo
    && !Array.isArray(corpo)
    && corpo.codigo === 'ENTIDADE_DESATIVADA';
}