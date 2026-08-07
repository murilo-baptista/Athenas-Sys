package br.com.athenassys.api.dto.produto;

import br.com.athenassys.api.model.Produto;

import java.math.BigDecimal;

public record DadosListagemProduto(
        Long id,
        String nome,
        String descricao,
        BigDecimal preco,
        Long idCategoria
) {
    public DadosListagemProduto(Produto produto) {
        this(
                produto.getId(),
                produto.getNome(),
                produto.getDescricao(),
                produto.getPreco(),
                produto.getCategoria().getId()
        );
    }
}
