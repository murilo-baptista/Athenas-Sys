package br.com.athenassys.api.dto.funcionario;

import br.com.athenassys.api.enums.Cargo;
import br.com.athenassys.api.model.Funcionario;

public record DadosDetalhamentoFuncionario(

        Long id,
        Long idRestaurante,
        String nome,
        Cargo cargo,
        Boolean ativo
) {
    public DadosDetalhamentoFuncionario(Funcionario funcionario) {
        this(
                funcionario.getId(),
                funcionario.getRestaurante().getId(),
                funcionario.getNome(),
                funcionario.getCargo(),
                funcionario.getAtivo()
        );
    }
}
