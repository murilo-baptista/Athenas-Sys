package br.com.athenassys.api.dto.pedido;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record DadosCadastroPedido(

        @NotNull
        Long mesaId,

        @NotNull
        Long funcionarioId,

        @NotNull
        @Positive
        BigDecimal valorTotal,
        String observacao
) {
}
