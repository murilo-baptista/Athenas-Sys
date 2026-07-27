package br.com.athenassys.api.dto;

import br.com.athenassys.api.enums.StatusMesa;
import jakarta.validation.constraints.NotNull;

public record DadosAtualizacaoMesa(

        @NotNull
        Long id,
        Integer numero,
        Integer capacidade,
        StatusMesa status
) {
}
