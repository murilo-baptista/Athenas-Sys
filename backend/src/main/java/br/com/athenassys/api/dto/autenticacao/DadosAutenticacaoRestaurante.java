package br.com.athenassys.api.dto.autenticacao;

import jakarta.validation.constraints.NotBlank;

public record DadosAutenticacaoRestaurante(

        @NotBlank
        String usuario,

        @NotBlank
        String senha
) {
}
