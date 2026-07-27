package br.com.athenassys.api.dto.mesa;

import br.com.athenassys.api.enums.StatusMesa;
import br.com.athenassys.api.model.Mesa;

public record DadosListagemMesa(
        Long id,
        Integer numero,
        Integer capacidade,
        StatusMesa status
) {
    public DadosListagemMesa(Mesa mesa) {
        this(
                mesa.getId(),
                mesa.getNumero(),
                mesa.getCapacidade(),
                mesa.getStatus()
        );
    }
}