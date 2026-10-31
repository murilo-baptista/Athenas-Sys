package br.com.athenassys.api.service;

import br.com.athenassys.api.client.OpenCnpjClient;
import br.com.athenassys.api.dto.autenticacao.DadosAlteracaoSenha;
import br.com.athenassys.api.dto.restaurante.DadosAtualizacaoRestaurante;
import br.com.athenassys.api.dto.restaurante.DadosCadastroRestaurante;
import br.com.athenassys.api.exception.ChaveIncorretaException;
import br.com.athenassys.api.exception.EntidadeNaoEncontradaException;
import br.com.athenassys.api.exception.ErroCnpjException;
import br.com.athenassys.api.model.Restaurante;
import br.com.athenassys.api.repository.RestauranteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RestauranteService {

    private final PasswordEncoder passwordEncoder;
    private final RestauranteRepository repository;
    private final OpenCnpjClient client;

    public Restaurante cadastrar(
            DadosCadastroRestaurante dados) {

        var cnpjStatus = client.obterStatus(dados.cnpj());

        if (cnpjStatus == 400) {
            throw new ErroCnpjException("CNPJ inválido! Verifique se foi digitado corretamente.", HttpStatus.BAD_REQUEST);

        } else if (cnpjStatus == 404) {
            throw new ErroCnpjException("CNPJ não encontrado no release publicado! Verifique se foi digitado corretamente.", HttpStatus.BAD_REQUEST);

        } else if (cnpjStatus == 502) {
            throw new ErroCnpjException("Falha temporária ao buscar o CNPJ e carregar os metadados!", HttpStatus.SERVICE_UNAVAILABLE);
        }
        var senha = passwordEncoder.encode(dados.senha());

        var restaurante = new Restaurante(dados, senha);
        return repository.save(restaurante);
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

    public Restaurante alterarSenha(DadosAlteracaoSenha dados, Long idRestaurante) {

        var restaurante = repository
                .findById(idRestaurante)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Restaurante não encontrado."));

        if (!passwordEncoder.matches(dados.chaveAtual(), restaurante.getSenha())) {
            throw new ChaveIncorretaException("Senha atual incorreta!");
        }
        var senha = passwordEncoder.encode(dados.chaveNova());

        restaurante.alterarSenha(senha);
        return restaurante;
    }
}
