package br.com.athenassys.api.service;

import br.com.athenassys.api.dto.produto.DadosAtualizacaoProduto;
import br.com.athenassys.api.dto.produto.DadosCadastroProduto;
import br.com.athenassys.api.dto.produto.DadosListagemProduto;
import br.com.athenassys.api.exception.EntidadeNaoEncontradaException;
import br.com.athenassys.api.model.Categoria;
import br.com.athenassys.api.model.Produto;
import br.com.athenassys.api.repository.CategoriaRepository;
import br.com.athenassys.api.repository.ProdutoRepository;
import br.com.athenassys.api.repository.RestauranteRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final RestauranteRepository restauranteRepository;
    private final CategoriaRepository categoriaRepository;
    private final ProdutoRepository produtoRepository;

    public Produto cadastrar(
            DadosCadastroProduto dados,
            Long idRestaurante) {

        var restaurante = restauranteRepository
                .findById(idRestaurante)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Restaurante não encontrado."));

        var categoria = categoriaRepository
                .findByIdAndRestauranteId(dados.idCategoria(), idRestaurante)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Categoria não encontrada."));

        var produto = new Produto(dados, restaurante, categoria);
        return produtoRepository.save(produto);
    }

    public Page<DadosListagemProduto> listar(
            Long idRestautante,
            Pageable paginacao) {

        return produtoRepository.findAllByRestauranteIdAndAtivoTrue(idRestautante, paginacao)
                .map(DadosListagemProduto::new);
    }

    public Produto atualizar(DadosAtualizacaoProduto dados, Long idProduto, Long idRestaurante) {

        var produto = produtoRepository
                .findByIdAndRestauranteId(idProduto, idRestaurante)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Produto não encontrado."));

        Categoria categoria = produto.getCategoria();

        if (dados.idCategoria() != null) {
            categoria = categoriaRepository
                    .findByIdAndRestauranteId(dados.idCategoria(), idRestaurante)
                    .orElseThrow(() -> new EntidadeNaoEncontradaException("Categoria não encontrada."));
        }

        produto.atualizarDados(dados, categoria);
        return produto;
    }

    public Produto desativar(Long idRestaurante, Long idProduto) {

        var produto = produtoRepository
                .findByIdAndRestauranteId(idProduto, idRestaurante)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Produto não encontrado."));

        produto.desativar();
        return produto;
    }

    public Produto buscarPorId(Long idProduto, Long idRestaurante) {

        return produtoRepository
                .findByIdAndRestauranteId(idProduto, idRestaurante)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Produto não encontrado."));
    }
}
