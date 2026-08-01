package br.com.athenassys.api.dto.produto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record DadosCadastroProduto(

        @NotBlank
        String nome,

        @NotBlank
        String descricao,

        @NotNull
        @Positive
        BigDecimal preco,

        @NotNull
        Long idCategoria
) {
}
