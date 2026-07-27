package br.com.athenassys.api.dto;

import br.com.athenassys.api.enums.StatusMesa;
import br.com.athenassys.api.model.Mesa;
import br.com.athenassys.api.model.Restaurante;

public record DadosListagemMesa(
        Long id,
        Integer numero,
        Integer capacidade,
        StatusMesa status,
        Boolean ativo
) {
    public DadosListagemMesa(Mesa mesa) {
        this(
                mesa.getId(),
                mesa.getNumero(),
                mesa.getCapacidade(),
                mesa.getStatus(),
                mesa.getAtivo()
        );
    }
}