package br.com.athenassys.api.dto.autenticacao;

import br.com.athenassys.api.validation.SenhaForte;
import jakarta.validation.constraints.NotBlank;

public record DadosAlteracaoSenha(

        @NotBlank
        String chaveAtual,

        @NotBlank
        @SenhaForte
        String chaveNova

) {
}
