package br.com.athenassys.api.dto;

import br.com.athenassys.api.enums.StatusMesa;

public record DadosAtualizacaoMesa(

        Integer numero,
        Integer capacidade,
        StatusMesa status
) {
}
