package br.com.athenassys.api.dto.itempedido;

import br.com.athenassys.api.enums.StatusItemPedido;
import br.com.athenassys.api.model.ItemPedido;

import java.math.BigDecimal;

public record DadosListagemItemPedido(

        Long id,
        Integer quantidade,
        String observacao,
        BigDecimal valorUnitario,
        StatusItemPedido status,
        Long idPedido,
        Long idProduto
) {
    public DadosListagemItemPedido(ItemPedido itemPedido) {
        this(
                itemPedido.getId(),
                itemPedido.getQuantidade(),
                itemPedido.getObservacao(),
                itemPedido.getValorUnitario(),
                itemPedido.getStatus(),
                itemPedido.getPedido().getId(),
                itemPedido.getProduto().getId()
        );
    }
}
