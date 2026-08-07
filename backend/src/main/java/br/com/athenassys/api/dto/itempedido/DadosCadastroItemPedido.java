package br.com.athenassys.api.dto.itempedido;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record DadosCadastroItemPedido(

        @NotNull
        Long idProduto,

        @NotNull
        @Positive
        Integer quantidade,
        String observacao
) {
}
