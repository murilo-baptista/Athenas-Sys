package br.com.athenassys.api.service;

import br.com.athenassys.api.dto.autenticacao.DadosAutenticacaoFuncionario;
import br.com.athenassys.api.model.Funcionario;
import br.com.athenassys.api.repository.FuncionarioRepository;
import br.com.athenassys.api.repository.RestauranteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AutenticacaoService implements UserDetailsService {

    @Autowired
    private RestauranteRepository restauranteRepository;

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return restauranteRepository.findByEmail(username);
    }

    public Funcionario autenticarFuncionario(DadosAutenticacaoFuncionario dados) throws UsernameNotFoundException {

        var funcionario = funcionarioRepository
                .findByNomeAndRestauranteId(dados.nome(), dados.idRestaurante())
                .orElseThrow(() -> new BadCredentialsException("Usuário inexistente ou senha inválida"));

        if (!passwordEncoder.matches(dados.codigo(), funcionario.getCodigo())) {
            throw new BadCredentialsException("Usuário inexistente ou senha inválida");
        }

        return funcionario;
    }
}
