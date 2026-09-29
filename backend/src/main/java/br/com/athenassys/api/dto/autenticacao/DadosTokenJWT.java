package br.com.athenassys.api.dto.autenticacao;

public record DadosTokenJWT(

        String token,
        Long restauranteId,
        String nomeRestaurante,
        Long funcionarioId,
        String nomeFuncionario,
        String cargo

    ) {
}
