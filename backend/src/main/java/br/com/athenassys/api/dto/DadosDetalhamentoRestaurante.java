package br.com.athenassys.api.dto;

import br.com.athenassys.api.model.Restaurante;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.hibernate.validator.constraints.br.CNPJ;

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
