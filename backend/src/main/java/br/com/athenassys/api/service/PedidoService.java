package br.com.athenassys.api.service;

import br.com.athenassys.api.dto.pedido.DadosAtualizacaoPedido;
import br.com.athenassys.api.dto.pedido.DadosCadastroPedido;
import br.com.athenassys.api.dto.pedido.DadosListagemPedido;
import br.com.athenassys.api.model.*;
import br.com.athenassys.api.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PedidoService {

    private final RestauranteRepository restauranteRepository;
    private final MesaRepository mesaRepository;
    private final FuncionarioRepository funcionarioRepository;
    private final PedidoRepository pedidoRepository;
    private final ProdutoRepository produtoRepository;

    public Pedido cadastrar(
            DadosCadastroPedido dados,
            Long idRestaurante) {

        var restaurante = restauranteRepository
                .findById(idRestaurante)
                .orElseThrow(() -> new EntityNotFoundException("Restaurante não encontrado."));

        var mesa = mesaRepository
                .findByIdAndRestauranteId(dados.idMesa(), idRestaurante)
                .orElseThrow(() -> new EntityNotFoundException("Mesa não encontrada."));

        var funcionario = funcionarioRepository
                .findByIdAndRestauranteId(dados.idFuncionario(), idRestaurante)
                .orElseThrow(() -> new EntityNotFoundException("Funcionario não encontrado."));

        var pedido = new Pedido(dados, restaurante, mesa, funcionario);
        for (var itemDados : dados.itens()) {
            var produto = produtoRepository
                    .findByIdAndRestauranteId(itemDados.idProduto(), idRestaurante)
                    .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado."));
            pedido.getItens().add(new ItemPedido(itemDados, restaurante, pedido, produto));
        }
        pedido.calcularTotal();
        return pedidoRepository.save(pedido);
    }

    public Page<DadosListagemPedido> listar(
            Long idRestaurante,
            Pageable paginacao) {

        return pedidoRepository.findAllByRestauranteId(idRestaurante, paginacao)
                .map(DadosListagemPedido::new);
    }

    public Pedido atualizar(DadosAtualizacaoPedido dados, Long idPedido, Long idRestaurante) {

        var pedido = pedidoRepository
                .findByIdAndRestauranteId(idPedido, idRestaurante)
                .orElseThrow(() -> new EntityNotFoundException("Pedido não encontrado."));

        var mesa = pedido.getMesa();

        if (dados.idMesa() != null) {
            mesa = mesaRepository
                    .findByIdAndRestauranteId(dados.idMesa(), idRestaurante)
                    .orElseThrow(() -> new EntityNotFoundException("Mesa não encontrada."));
        }

        var funcionario = pedido.getFuncionario();

        if (dados.idFuncionario() != null) {
            funcionario = funcionarioRepository
                    .findByIdAndRestauranteId(dados.idFuncionario(), idRestaurante)
                    .orElseThrow(() -> new EntityNotFoundException("Funcionário não encontrado."));
        }

        pedido.atualizarDados(dados, mesa, funcionario);
        return pedido;
    }

    public Pedido buscarPorId(Long idPedido, Long idRestaurante) {

        return pedidoRepository
                .findByIdAndRestauranteId(idPedido, idRestaurante)
                .orElseThrow(() -> new EntityNotFoundException("Pedido não encontrado."));
    }
}
