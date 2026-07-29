package br.com.athenassys.api.service;

import br.com.athenassys.api.dto.funcionario.DadosAtualizacaoFuncionario;
import br.com.athenassys.api.dto.funcionario.DadosListagemFuncionario;
import br.com.athenassys.api.dto.funcionario.DadosCadastroFuncionario;
import br.com.athenassys.api.model.Funcionario;
import br.com.athenassys.api.repository.FuncionarioRepository;
import br.com.athenassys.api.repository.RestauranteRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FuncionarioService {

    private final RestauranteRepository restauranteRepository;
    private final FuncionarioRepository funcionarioRepository;

    public Funcionario cadastrar(
            DadosCadastroFuncionario dados,
            Long idRestaurante) {

        var restaurante = restauranteRepository
                .findById(idRestaurante)
                .orElseThrow();
        var funcionario = new Funcionario(dados, restaurante);

        return funcionarioRepository.save(funcionario);
    }

    public Page<DadosListagemFuncionario> listar(
            Long restauranteId,
            Pageable paginacao) {

        return funcionarioRepository.findAllByRestauranteIdAndAtivoTrue(restauranteId, paginacao)
                .map(DadosListagemFuncionario::new);
    }

    public Funcionario atualizar(DadosAtualizacaoFuncionario dados, Long idFuncionario, Long idRestaurante) {

        var funcionario = funcionarioRepository
                .findByIdAndRestauranteId(idFuncionario, idRestaurante)
                .orElseThrow(() -> new EntityNotFoundException("Funcionário não encontrado."));

        funcionario.atualizarDados(dados);
        return funcionario;
    }

    public Funcionario desativar(Long idRestaurante, Long idFuncionario) {

        var funcionario = funcionarioRepository
                .findByIdAndRestauranteId(idFuncionario, idRestaurante)
                .orElseThrow(() -> new EntityNotFoundException("Funcionário não encontrado."));

        funcionario.desativar();
        return funcionario;
    }

    public Funcionario buscarPorId(Long idFuncionario, Long idRestaurante) {

        return funcionarioRepository
                .findByIdAndRestauranteId(idFuncionario, idRestaurante)
                .orElseThrow(() -> new EntityNotFoundException("Funcionário não encontrado."));
    }
}
