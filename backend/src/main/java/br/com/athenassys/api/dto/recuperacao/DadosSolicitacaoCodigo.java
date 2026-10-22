package br.com.athenassys.api.dto.recuperacao;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record DadosSolicitacaoCodigo(

        @NotBlank
        @Email
        String email
) {
}
