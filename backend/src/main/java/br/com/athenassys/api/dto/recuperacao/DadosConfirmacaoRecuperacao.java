package br.com.athenassys.api.dto.recuperacao;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record DadosConfirmacaoRecuperacao(

        @Email
        @NotBlank
        String email,

        @NotBlank
        String codigo,

        @NotBlank
        String novaSenha

) {
}
