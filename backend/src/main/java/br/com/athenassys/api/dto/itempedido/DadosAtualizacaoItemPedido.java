package br.com.athenassys.api.dto.itempedido;

import jakarta.validation.constraints.Positive;

public record DadosAtualizacaoItemPedido(

        Long idProduto,

        @Positive
        Integer quantidade,
        String observacao
) {
}
