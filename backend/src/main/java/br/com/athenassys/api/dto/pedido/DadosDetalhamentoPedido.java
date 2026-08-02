package br.com.athenassys.api.dto.pedido;

import br.com.athenassys.api.model.Pedido;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record DadosDetalhamentoPedido(

        Long id,
        LocalDateTime dataHora,
        BigDecimal valorTotal,
        String observacao,
        Long restauranteId,
        Long mesaId,
        Long funcionarioId
) {
    public DadosDetalhamentoPedido(Pedido pedido) {
        this(
                pedido.getId(),
                pedido.getDataHora(),
                pedido.getValorTotal(),
                pedido.getObservacao(),
                pedido.getRestaurante().getId(),
                pedido.getMesa().getId(),
                pedido.getFuncionario().getId()
        );
    }
}
