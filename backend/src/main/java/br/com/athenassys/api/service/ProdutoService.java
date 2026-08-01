package br.com.athenassys.api.service;

import br.com.athenassys.api.dto.produto.DadosAtualizacaoProduto;
import br.com.athenassys.api.dto.produto.DadosCadastroProduto;
import br.com.athenassys.api.dto.produto.DadosListagemProduto;
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
                .orElseThrow(() -> new EntityNotFoundException("Restaurante não encontrado."));

        var categoria = categoriaRepository
                .findByIdAndRestauranteId(dados.idCategoria(), idRestaurante)
                .orElseThrow(() -> new EntityNotFoundException("Categoria não encontrada."));

        var produto = new Produto(dados, restaurante, categoria);
        return produtoRepository.save(produto);
    }

    public Page<DadosListagemProduto> listar(
            Long restauranteId,
            Pageable paginacao) {

        return produtoRepository.findAllByRestauranteIdAndAtivoTrue(restauranteId, paginacao)
                .map(DadosListagemProduto::new);
    }

    public Produto atualizar(DadosAtualizacaoProduto dados, Long idProduto, Long idRestaurante) {

        var produto = produtoRepository
                .findByIdAndRestauranteId(idProduto, idRestaurante)
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado."));

        Categoria categoria = produto.getCategoria();

        if (dados.idCategoria() != null) {
            categoria = categoriaRepository
                    .findByIdAndRestauranteId(dados.idCategoria(), idRestaurante)
                    .orElseThrow(() -> new EntityNotFoundException("Categoria não encontrada."));
        }

        produto.atualizarDados(dados, categoria);
        return produto;
    }

    public Produto desativar(Long idRestaurante, Long idProduto) {

        var produto = produtoRepository
                .findByIdAndRestauranteId(idProduto, idRestaurante)
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado."));

        produto.desativar();
        return produto;
    }

    public Produto buscarPorId(Long idProduto, Long idRestaurante) {

        return produtoRepository
                .findByIdAndRestauranteId(idProduto, idRestaurante)
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado."));
    }
}
