package br.com.athenassys.api.dto.categoria;

import jakarta.validation.constraints.NotBlank;

public record DadosCadastroCategoria(

        @NotBlank
        String nome

) {
}
