package br.com.athenassys.api.dto.restaurante;

import br.com.athenassys.api.model.Restaurante;

public record DadosDetalhamentoRestaurante(
        Long id,
        String nome,
        String email,
        String telefone,
        String cnpj,
        Boolean ativo
) {
    public DadosDetalhamentoRestaurante(Restaurante restaurante) {
        this(
                restaurante.getId(),
                restaurante.getNome(),
                restaurante.getEmail(),
                restaurante.getTelefone(),
                restaurante.getCnpj(),
                restaurante.getAtivo()
        );
    }
}
