package br.com.athenassys.api.dto;

import br.com.athenassys.api.enums.StatusMesa;
import br.com.athenassys.api.model.Mesa;
import br.com.athenassys.api.model.Restaurante;

public record DadosDetalhamentoMesa(
        Long id,
        Restaurante restaurante,
        Integer numero,
        Integer capacidade,
        StatusMesa status,
        Boolean ativo
) {
    public DadosDetalhamentoMesa(Mesa mesa) {
        this(
                mesa.getId(),
                mesa.getRestaurante(),
                mesa.getNumero(),
                mesa.getCapacidade(),
                mesa.getStatus(),
                mesa.getAtivo()
        );
    }
}
