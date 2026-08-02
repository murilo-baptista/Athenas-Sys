package br.com.athenassys.api.dto.pedido;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record DadosCadastroPedido(

        @NotNull
        Long idMesa,

        @NotNull
        Long idFuncionario,

        @NotNull
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime dataHora,

        @NotNull
        BigDecimal valorTotal,
        String observacao
) {
}
