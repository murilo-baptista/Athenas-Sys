package br.com.athenassys.api.dto.categoria;

import br.com.athenassys.api.model.Categoria;

public record DadosDetalhamentoCategoria(
        Long id,
        Long restauranteId,
        String nome,
        Boolean ativo
) {
    public DadosDetalhamentoCategoria(Categoria categoria) {
        this(
                categoria.getId(),
                categoria.getRestaurante().getId(),
                categoria.getNome(),
                categoria.getAtivo()
        );
    }
}
