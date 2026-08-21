package br.com.athenassys.api.service;

import br.com.athenassys.api.dto.categoria.DadosAtualizacaoCategoria;
import br.com.athenassys.api.dto.categoria.DadosCadastroCategoria;
import br.com.athenassys.api.dto.categoria.DadosListagemCategoria;
import br.com.athenassys.api.exception.EntidadeNaoEncontradaException;
import br.com.athenassys.api.model.Categoria;
import br.com.athenassys.api.repository.CategoriaRepository;
import br.com.athenassys.api.repository.RestauranteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final RestauranteRepository restauranteRepository;
    private final CategoriaRepository categoriaRepository;

    public Categoria cadastrar(
            DadosCadastroCategoria dados,
            Long idRestaurante) {

        var restaurante = restauranteRepository
                .findById(idRestaurante)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Restaurante não encontrado."));
        var categoria = new Categoria(dados, restaurante);

        return categoriaRepository.save(categoria);
    }

    public Page<DadosListagemCategoria> listar(
            Long idRestaurante,
            Pageable paginacao) {

        return categoriaRepository.findAllByRestauranteIdAndAtivoTrue(idRestaurante, paginacao)
                .map(DadosListagemCategoria::new);
    }

    public Categoria atualizar(DadosAtualizacaoCategoria dados, Long idCategoria, Long idRestaurante) {

        var categoria = categoriaRepository
                .findByIdAndRestauranteId(idCategoria, idRestaurante)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Categoria não encontrada."));

        categoria.atualizarDados(dados);
        return categoria;
    }

    public Categoria desativar(Long idRestaurante, Long idCategoria) {

        var categoria = categoriaRepository
                .findByIdAndRestauranteId(idCategoria, idRestaurante)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Categoria não encontrada."));

        categoria.desativar();
        return categoria;
    }

    public Categoria buscarPorId(Long idCategoria, Long idRestaurante) {

        return categoriaRepository
                .findByIdAndRestauranteId(idCategoria, idRestaurante)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Categoria não encontrada."));
    }
}
