package br.com.athenassys.api.dto.autenticacao;

import jakarta.validation.constraints.NotBlank;

public record DadosAutenticacaoFuncionario(

        @NotBlank
        String usuario,

        @NotBlank
        String codigo
) {
}
