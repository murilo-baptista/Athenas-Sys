package br.com.athenassys.api.dto.recuperacao;

import br.com.athenassys.api.validation.SenhaForte;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record DadosConfirmacaoRecuperacao(

        @Email
        @NotBlank
        String email,

        @NotBlank
        String codigo,

        @NotBlank
        @SenhaForte
        String novaSenha

) {
}
