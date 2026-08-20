package br.com.athenassys.api.service;

import br.com.athenassys.api.dto.restaurante.DadosAtualizacaoRestaurante;
import br.com.athenassys.api.dto.restaurante.DadosCadastroRestaurante;
import br.com.athenassys.api.dto.restaurante.DadosListagemRestaurante;
import br.com.athenassys.api.exception.EntidadeNaoEncontradaException;
import br.com.athenassys.api.model.Restaurante;
import br.com.athenassys.api.repository.RestauranteRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RestauranteService {

    private final RestauranteRepository repository;

    public Restaurante cadastrar(
            DadosCadastroRestaurante dados) {

        var restaurante = new Restaurante(dados);
        return repository.save(restaurante);
    }

    public Page<DadosListagemRestaurante> listar(
            Pageable paginacao) {

        return repository.findAllByAtivoTrue(paginacao)
                .map(DadosListagemRestaurante::new);
    }

    public Restaurante atualizar(DadosAtualizacaoRestaurante dados, Long idRestaurante) {

        var restaurante = repository
                .findById(idRestaurante)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Restaurante não encontrado."));

        restaurante.atualizarDados(dados);
        return restaurante;
    }

    public Restaurante desativar(Long idRestaurante) {

        var restaurante = repository
                .findById(idRestaurante)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Restaurante não encontrado."));

        restaurante.desativar();
        return restaurante;
    }

    public Restaurante buscarPorId(Long idRestaurante) {

        return repository
                .findById(idRestaurante)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Restaurante não encontrado."));
    }
}
