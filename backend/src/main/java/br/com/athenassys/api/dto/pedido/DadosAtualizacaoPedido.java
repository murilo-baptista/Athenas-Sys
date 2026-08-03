package br.com.athenassys.api.dto.pedido;

import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record DadosAtualizacaoPedido(

        Long idMesa,
        Long idFuncionario,

        @Positive
        BigDecimal valorTotal,
        String observacao
) {
}
