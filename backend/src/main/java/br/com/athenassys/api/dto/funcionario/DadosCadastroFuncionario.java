package br.com.athenassys.api.dto.funcionario;

import br.com.athenassys.api.enums.Cargo;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DadosCadastroFuncionario(

        @NotBlank
        String nome,

        @NotBlank
        String codigo,

        @NotNull
        Cargo cargo
) {
}
