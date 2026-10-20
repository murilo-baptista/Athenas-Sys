package br.com.athenassys.api.dto.autenticacao;

public record DadosAutenticacaoFuncionario(

        String usuario,
        String codigo,
        Long restauranteId
) {
}
