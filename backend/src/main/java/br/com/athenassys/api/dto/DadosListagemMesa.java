package br.com.athenassys.api.dto;

import br.com.athenassys.api.enums.StatusMesa;
import br.com.athenassys.api.model.Mesa;

public record DadosListagemMesa(
        Integer numero,
        Integer capacidade,
        StatusMesa status,
        Boolean ativo
) {
    public DadosListagemMesa(Mesa mesa) {
        this(
                mesa.getNumero(),
                mesa.getCapacidade(),
                mesa.getStatus(),
                mesa.getAtivo()
        );
    }
}