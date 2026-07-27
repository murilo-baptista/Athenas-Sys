package br.com.athenassys.api.dto.mesa;

import br.com.athenassys.api.enums.StatusMesa;
import br.com.athenassys.api.model.Mesa;

public record DadosDetalhamentoMesa(
        Long id,
        Long restauranteId,
        Integer numero,
        Integer capacidade,
        StatusMesa status,
        Boolean ativo
) {
    public DadosDetalhamentoMesa(Mesa mesa) {
        this(
                mesa.getId(),
                mesa.getRestaurante().getId(),
                mesa.getNumero(),
                mesa.getCapacidade(),
                mesa.getStatus(),
                mesa.getAtivo()
        );
    }
}
