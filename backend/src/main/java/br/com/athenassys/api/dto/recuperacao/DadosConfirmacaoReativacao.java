package br.com.athenassys.api.dto.recuperacao;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record DadosConfirmacaoReativacao(

        @Email
        @NotBlank
        String email,

        @NotBlank
        String codigo
) {
}
