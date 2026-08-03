package br.com.athenassys.api.dto.pedido;

import br.com.athenassys.api.dto.itempedido.DadosCadastroItemPedido;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record DadosCadastroPedido(

        @NotNull
        Long idMesa,

        @NotNull
        Long idFuncionario,
        String observacao,

        @NotNull
        @Size(min = 1)
        @Valid
        List<DadosCadastroItemPedido> itens
) {
}
