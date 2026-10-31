package br.com.athenassys.api.dto.recuperacao;

import jakarta.validation.constraints.NotBlank;

public record DadosConfirmacaoCodigoFuncionario(

        @NotBlank
        String usuario,

        @NotBlank
        String codigo,

        @NotBlank
        String novoCodigo

) {
}
