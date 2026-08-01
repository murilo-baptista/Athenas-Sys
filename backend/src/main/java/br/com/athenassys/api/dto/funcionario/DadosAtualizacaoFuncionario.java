package br.com.athenassys.api.dto.funcionario;

import br.com.athenassys.api.enums.Cargo;

public record DadosAtualizacaoFuncionario(

        String nome,
        Cargo cargo
) {
}
