package br.com.athenassys.api.dto.itempedido;

import br.com.athenassys.api.enums.StatusItemPedido;
import br.com.athenassys.api.model.ItemPedido;

import java.math.BigDecimal;

public record DadosDetalhamentoItemPedido(

        Long id,
        Integer quantidade,
        String observacao,
        BigDecimal valorUnitario,
        StatusItemPedido status,
        Long idRestaurante,
        Long idPedido,
        Long idProduto
) {
    public DadosDetalhamentoItemPedido(ItemPedido itemPedido) {
        this(
                itemPedido.getId(),
                itemPedido.getQuantidade(),
                itemPedido.getObservacao(),
                itemPedido.getValorUnitario(),
                itemPedido.getStatus(),
                itemPedido.getRestaurante().getId(),
                itemPedido.getPedido().getId(),
                itemPedido.getProduto().getId()
        );
    }
}
