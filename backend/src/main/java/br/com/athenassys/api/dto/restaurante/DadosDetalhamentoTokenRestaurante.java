package br.com.athenassys.api.dto.restaurante;

public record DadosDetalhamentoTokenRestaurante (

        DadosDetalhamentoRestaurante restaurante,
        String token

) {
}
