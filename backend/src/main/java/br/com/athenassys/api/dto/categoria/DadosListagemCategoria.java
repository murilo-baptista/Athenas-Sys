package br.com.athenassys.api.dto.categoria;

import br.com.athenassys.api.model.Categoria;

public record DadosListagemCategoria(
        Long id,
        String nome
) {
    public DadosListagemCategoria(Categoria categoria) {
        this(
                categoria.getId(),
                categoria.getNome()
        );
    }
}
