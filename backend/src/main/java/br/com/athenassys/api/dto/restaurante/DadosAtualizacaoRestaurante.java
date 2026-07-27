package br.com.athenassys.api.dto.restaurante;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record DadosAtualizacaoRestaurante(
        @NotNull
        Long id,
        String nome,

        @Email
        String email,

        @Pattern(
                regexp = "\\d{10,11}",
                message = "O telefone deve ter 10 ou 11 digitos, apenas numeros"
        )
        String telefone
) {
}
