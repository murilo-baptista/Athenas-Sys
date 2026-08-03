package br.com.athenassys.api.dto.pedido;

import br.com.athenassys.api.dto.itempedido.DadosDetalhamentoItemPedido;
import br.com.athenassys.api.model.Pedido;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record DadosDetalhamentoPedido(

        Long id,
        LocalDateTime dataHora,
        BigDecimal valorTotal,
        String observacao,
        Long idRestaurante,
        Long idMesa,
        Long idFuncionario,
        List<DadosDetalhamentoItemPedido> itens
) {
    public DadosDetalhamentoPedido(Pedido pedido) {
        this(
                pedido.getId(),
                pedido.getDataHora(),
                pedido.getValorTotal(),
                pedido.getObservacao(),
                pedido.getRestaurante().getId(),
                pedido.getMesa().getId(),
                pedido.getFuncionario().getId(),
                pedido.getItens().stream()
                        .map(DadosDetalhamentoItemPedido::new)
                        .toList()
        );
    }
}
