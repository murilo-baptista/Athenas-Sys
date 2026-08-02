package br.com.athenassys.api.dto.pedido;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record DadosAtualizacaoPedido(

        Long idMesa,
        Long idFuncionario,

        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime dataHora,
        BigDecimal valorTotal,
        String observacao
) {
}
