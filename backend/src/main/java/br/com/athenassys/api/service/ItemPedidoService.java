package br.com.athenassys.api.service;

import br.com.athenassys.api.dto.itempedido.DadosAtualizacaoItemPedido;
import br.com.athenassys.api.dto.itempedido.DadosCadastroItemPedido;
import br.com.athenassys.api.dto.itempedido.DadosListagemItemPedido;
import br.com.athenassys.api.exception.EntidadeNaoEncontradaException;
import br.com.athenassys.api.model.ItemPedido;
import br.com.athenassys.api.repository.ItemPedidoRepository;
import br.com.athenassys.api.repository.PedidoRepository;
import br.com.athenassys.api.repository.ProdutoRepository;
import br.com.athenassys.api.repository.RestauranteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ItemPedidoService {

    private final RestauranteRepository restauranteRepository;
    private final PedidoRepository pedidoRepository;
    private final ProdutoRepository produtoRepository;
    private final ItemPedidoRepository itemPedidoRepository;

    public ItemPedido cadastrar(
            DadosCadastroItemPedido dados,
            Long idPedido,
            Long idRestaurante) {

        var restaurante = restauranteRepository
                .findById(idRestaurante)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Restaurante não encontrado."));

        var pedido = pedidoRepository
                .findByIdAndRestauranteId(idPedido, idRestaurante)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Pedido não encontrado."));

        var produto = produtoRepository
                .findByIdAndRestauranteId(dados.idProduto(), idRestaurante)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Produto não encontrado."));

        var itemPedido = new ItemPedido(dados, restaurante, pedido, produto);

        itemPedidoRepository.save(itemPedido);
        pedido.calcularTotal();
        return itemPedido;
    }

    public Page<DadosListagemItemPedido> listar(
            Long idRestaurante,
            Long idPedido,
            Pageable paginacao) {

        return itemPedidoRepository.findAllByRestauranteIdAndPedidoId(idRestaurante, idPedido, paginacao)
                .map(DadosListagemItemPedido::new);
    }

    public ItemPedido atualizar(
            DadosAtualizacaoItemPedido dados,
            Long idItemPedido,
            Long idPedido,
            Long idRestaurante) {

        var itemPedido = itemPedidoRepository
                .findByIdAndPedidoIdAndRestauranteId(idItemPedido, idPedido, idRestaurante)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Item não encontrado."));

        var produto = itemPedido.getProduto();

        if (dados.idProduto() != null) {
            produto = produtoRepository
                    .findByIdAndRestauranteId(dados.idProduto(), idRestaurante)
                    .orElseThrow(() -> new EntidadeNaoEncontradaException("Produto não encontrado."));
        }

        var pedido = pedidoRepository
                .findByIdAndRestauranteId(idPedido, idRestaurante)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Pedido não encontrado."));

        itemPedido.atualizarDados(dados, produto);
        pedido.calcularTotal();
        return itemPedido;
    }

    public ItemPedido buscarPorId(Long idItemPedido, Long idPedido, Long idRestaurante) {

        return itemPedidoRepository
                .findByIdAndPedidoIdAndRestauranteId(idItemPedido, idPedido, idRestaurante)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Item não encontrado."));
    }

    public ItemPedido preparar(Long idItemPedido, Long idPedido, Long idRestaurante) {

        var itemPedido = itemPedidoRepository
                .findByIdAndPedidoIdAndRestauranteId(idItemPedido, idPedido, idRestaurante)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Item não encontrado."));

        itemPedido.preparar();
        return itemPedido;
    }

    public ItemPedido marcarPronto(Long idItemPedido, Long idPedido, Long idRestaurante) {

        var itemPedido = itemPedidoRepository
                .findByIdAndPedidoIdAndRestauranteId(idItemPedido, idPedido, idRestaurante)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Item não encontrado."));

        itemPedido.marcarPronto();
        return itemPedido;
    }

    public ItemPedido entregar(Long idItemPedido, Long idPedido, Long idRestaurante) {

        var itemPedido = itemPedidoRepository
                .findByIdAndPedidoIdAndRestauranteId(idItemPedido, idPedido, idRestaurante)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Item não encontrado."));

        itemPedido.entregar();
        return itemPedido;
    }

    public ItemPedido cancelar(Long idItemPedido, Long idPedido, Long idRestaurante) {

        var itemPedido = itemPedidoRepository
                .findByIdAndPedidoIdAndRestauranteId(idItemPedido, idPedido, idRestaurante)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Item não encontrado."));
        itemPedido.cancelar();

        var pedido = pedidoRepository
                .findByIdAndRestauranteId(idPedido, idRestaurante)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Pedido não encontrado."));
        pedido.calcularTotal();

        return itemPedido;
    }
}
