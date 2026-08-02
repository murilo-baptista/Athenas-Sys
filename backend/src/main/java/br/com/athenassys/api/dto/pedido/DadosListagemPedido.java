package br.com.athenassys.api.dto.pedido;

import br.com.athenassys.api.model.Pedido;

import java.time.LocalDateTime;

public record DadosListagemPedido(

        Long id,
        LocalDateTime dataHora,
        String observacao,
        Long mesaId,
        Long funcionarioId
) {
    public DadosListagemPedido(Pedido pedido) {
        this(
                pedido.getId(),
                pedido.getDataHora(),
                pedido.getObservacao(),
                pedido.getMesa().getId(),
                pedido.getFuncionario().getId()
        );
    }
}
