package br.com.athenassys.api.dto.autenticacao;

public record DadosAutenticacaoFuncionario(

        String nome,
        String codigo,
        Long idRestaurante
) {
}
