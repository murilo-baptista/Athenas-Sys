package br.com.athenassys.api.dto.recuperacao;

import jakarta.validation.constraints.NotBlank;

public record DadosSolicitacaoCodigoFuncionario(

        @NotBlank
        String usuario
) {
}
