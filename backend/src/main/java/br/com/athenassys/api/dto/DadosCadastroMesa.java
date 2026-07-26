package br.com.athenassys.api.dto;

import br.com.athenassys.api.enums.StatusMesa;
import jakarta.validation.constraints.NotNull;

public record DadosCadastroMesa(

        @NotNull
        Integer numero,

        @NotNull
        Integer capacidade,

        @NotNull
        StatusMesa status,

        @NotNull
        Long idRestaurante
) {
}
