package br.com.athenassys.api.dto.mesa;

import jakarta.validation.constraints.Positive;

public record DadosAtualizacaoMesa(

        @Positive
        Integer numero,

        @Positive
        Integer capacidade
) {
}
