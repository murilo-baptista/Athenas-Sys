package br.com.athenassys.api.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record DadosCadastroMesa(

        @NotNull
        @Positive
        Integer numero,

        @NotNull
        @Positive
        Integer capacidade

) {
}
