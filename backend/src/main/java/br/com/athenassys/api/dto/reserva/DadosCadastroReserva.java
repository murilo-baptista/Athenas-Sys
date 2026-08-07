package br.com.athenassys.api.dto.reserva;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;

public record DadosCadastroReserva(

        @NotNull
        Long idMesa,

        @NotNull
        @Positive
        Integer numPessoas,

        @NotBlank
        String nomeCliente,

        @NotBlank
        @Pattern(
                regexp = "\\d{10,11}",
                message = "O telefone deve ter 10 ou 11 digitos, apenas numeros"
        )
        String telefone,

        @NotNull
        LocalDateTime dataHora
) {
}
