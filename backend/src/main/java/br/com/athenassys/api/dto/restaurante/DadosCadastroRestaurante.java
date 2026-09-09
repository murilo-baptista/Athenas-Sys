package br.com.athenassys.api.dto.restaurante;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.hibernate.validator.constraints.br.CNPJ;

public record DadosCadastroRestaurante(

        @NotBlank
        String nome,

        @NotBlank
        @Email
        String email,

        @NotBlank
        @Pattern(
                regexp = "\\d{10,11}",
                message = "O telefone deve ter 10 ou 11 digitos, apenas numeros"
        )
        String telefone,

        @NotBlank
        @CNPJ(message = "CNPJ inválido!")
        //XX.XXX.XXX/XXXX-XX || XXXXXXXXXXXXXX
        String cnpj,

        @NotBlank
        String senha
) {
}
