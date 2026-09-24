package br.com.athenassys.api.dto.restaurante;

import jakarta.validation.constraints.NotBlank;

public record DadosAlterarSenha(

        @NotBlank
        String senhaAtual,

        @NotBlank
        String senhaNova

) {
}
