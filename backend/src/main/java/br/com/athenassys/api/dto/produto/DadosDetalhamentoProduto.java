package br.com.athenassys.api.dto.produto;

import br.com.athenassys.api.model.Produto;
import jakarta.persistence.*;

import java.math.BigDecimal;

public record DadosDetalhamentoProduto(
        Long id,
        String nome,
        String descricao,
        BigDecimal preco,
        Long categoriaId,
        Long restauranteId,
        Boolean ativo
) {
    public DadosDetalhamentoProduto(Produto produto) {
        this(
                produto.getId(),
                produto.getNome(),
                produto.getDescricao(),
                produto.getPreco(),
                produto.getCategoria().getId(),
                produto.getRestaurante().getId(),
                produto.getAtivo()
        );
    }
}