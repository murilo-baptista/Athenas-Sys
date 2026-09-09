package br.com.athenassys.api.dto.produto;

import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record DadosAtualizacaoProduto(

        String nome,
        String descricao,

        @Positive
        BigDecimal preco,
        Long idCategoria
) {
}
