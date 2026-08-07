package br.com.athenassys.api.dto.funcionario;

import br.com.athenassys.api.enums.Cargo;
import br.com.athenassys.api.model.Funcionario;

public record DadosListagemFuncionario(
        Long id,
        String nome,
        Cargo cargo
) {
    public DadosListagemFuncionario(Funcionario funcionario) {
        this(
                funcionario.getId(),
                funcionario.getNome(),
                funcionario.getCargo()
        );
    }
}
