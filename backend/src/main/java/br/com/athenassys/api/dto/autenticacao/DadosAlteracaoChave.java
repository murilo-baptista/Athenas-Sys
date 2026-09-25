package br.com.athenassys.api.dto.autenticacao;

import jakarta.validation.constraints.NotBlank;

public record DadosAlteracaoChave(

        @NotBlank
        String chaveAtual,

        @NotBlank
        String chaveNova

) {
}
