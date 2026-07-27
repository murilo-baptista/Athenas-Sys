package br.com.athenassys.api.dto.restaurante;

import br.com.athenassys.api.model.Restaurante;

public record DadosListagemRestaurante(
        Long id,
        String nome,
        String email,
        String telefone,
        String cnpj
) {
    public DadosListagemRestaurante(Restaurante restaurante) {
        this(
                restaurante.getId(),
                restaurante.getNome(),
                restaurante.getEmail(),
                restaurante.getTelefone(),
                restaurante.getCnpj());
    }
}
