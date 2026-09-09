package br.com.athenassys.api.dto.reserva;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;

public record DadosAtualizacaoReserva(

        Long idMesa,

        @Positive
        Integer numPessoas,
        String nomeCliente,

        @Pattern(
                regexp = "\\d{10,11}",
                message = "O telefone deve ter 10 ou 11 digitos, apenas numeros"
        )
        String telefone,
        LocalDateTime dataHora
) {
}
