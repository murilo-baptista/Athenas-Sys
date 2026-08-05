package br.com.athenassys.api.dto.pedido;

import br.com.athenassys.api.model.Pedido;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record DadosListagemPedido(

        Long id,
        LocalDateTime dataHora,
        String observacao,
        BigDecimal valorTotal,
        Long idMesa,
        Long idFuncionario
) {
    public DadosListagemPedido(Pedido pedido) {
        this(
                pedido.getId(),
                pedido.getDataHora(),
                pedido.getObservacao(),
                pedido.getValorTotal(),
                pedido.getMesa().getId(),
                pedido.getFuncionario().getId()
        );
    }
}
