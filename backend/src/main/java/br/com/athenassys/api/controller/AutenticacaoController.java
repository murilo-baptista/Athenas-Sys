package br.com.athenassys.api.controller;

import br.com.athenassys.api.dto.autenticacao.DadosAutenticacaoFuncionario;
import br.com.athenassys.api.dto.autenticacao.DadosAutenticacaoRestaurante;
import br.com.athenassys.api.dto.autenticacao.DadosTokenJWT;
import br.com.athenassys.api.model.Restaurante;
import br.com.athenassys.api.service.AutenticacaoService;
import br.com.athenassys.api.service.TokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AutenticacaoController {

    @Autowired
    private AuthenticationManager manager;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private AutenticacaoService autenticacaoService;

    @PostMapping ("/login")
    public ResponseEntity efetuarLogin(@RequestBody @Valid DadosAutenticacaoRestaurante dados) {
        var authenticationToken = new UsernamePasswordAuthenticationToken(dados.usuario(), dados.senha());
        var authentication = manager.authenticate(authenticationToken);

        var restaurante = (Restaurante) authentication.getPrincipal();
        var tokenJWT = tokenService.gerarTokenRestaurante(restaurante);

        return ResponseEntity.ok(new DadosTokenJWT(tokenJWT, restaurante.getId(), restaurante.getNome(), null, null, null));
    }

    @PostMapping ("/funcionario/login")
    public ResponseEntity efetuarLoginFuncionario(@RequestBody @Valid DadosAutenticacaoFuncionario dados) {

        var funcionario = autenticacaoService.autenticarFuncionario(dados);

        var tokenJWT = tokenService.gerarTokenFuncionario(funcionario);

        return ResponseEntity.ok(new DadosTokenJWT(tokenJWT, null, null, funcionario.getId(), funcionario.getNome(), funcionario.getCargo().toString()));
    }
}
