package br.com.athenassys.api.controller;

import br.com.athenassys.api.dto.autenticacao.DadosAlteracaoChave;
import br.com.athenassys.api.dto.restaurante.*;
import br.com.athenassys.api.model.Restaurante;
import br.com.athenassys.api.service.RestauranteService;
import br.com.athenassys.api.service.TokenService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("restaurantes")
@RequiredArgsConstructor
public class RestauranteController {

    private final RestauranteService service;
    private final TokenService tokenService;

    @PostMapping
    @Transactional
    public ResponseEntity<DadosDetalhamentoTokenRestaurante> cadastrar(
            @RequestBody @Valid DadosCadastroRestaurante dados,
            UriComponentsBuilder uriBuilder) {

        var restaurante = service.cadastrar(dados);
        var token = tokenService.gerarTokenRestaurante(restaurante);
        var dadosRestaurante = new DadosDetalhamentoRestaurante(restaurante);

        var uri = uriBuilder.path("restaurantes/{id}")
                .buildAndExpand(restaurante.getId())
                .toUri();

        return ResponseEntity.created(uri)
                .body(new DadosDetalhamentoTokenRestaurante(dadosRestaurante, token));
    }

    @GetMapping
    public ResponseEntity<Page<DadosListagemRestaurante>> listar(
            Pageable paginacao) {

        return ResponseEntity.ok(service.listar(paginacao));
    }

    @PutMapping("/{idRestaurante}")
    @Transactional
    public ResponseEntity<DadosDetalhamentoRestaurante> atualizar(
            @PathVariable Long idRestaurante,
            @RequestBody @Valid DadosAtualizacaoRestaurante dados) {

        var restaurante = service.atualizar(dados, idRestaurante);
        return ResponseEntity.ok(new DadosDetalhamentoRestaurante(restaurante));
    }

    @DeleteMapping("/{idRestaurante}")
    @Transactional
    public ResponseEntity<Void> desativar(
            @PathVariable Long idRestaurante) {

        service.desativar(idRestaurante);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{idRestaurante}")
    public ResponseEntity<DadosDetalhamentoRestaurante> detalhar(@PathVariable Long idRestaurante) {

        var restaurante = service.buscarPorId(idRestaurante);
        return ResponseEntity.ok(new DadosDetalhamentoRestaurante(restaurante));
    }

    @PatchMapping("/{idRestaurante}/alterarSenha")
    @Transactional
    public ResponseEntity<String> alterarSenha(
            @PathVariable Long idRestaurante,
            @RequestBody @Valid DadosAlteracaoChave dados,
            @AuthenticationPrincipal Restaurante restaurante) {

        if (!restaurante.getId().equals(idRestaurante)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                    "Não foi possível alterar a senha!"
            );
        }
        service.alterarSenha(dados, idRestaurante);
        return ResponseEntity.ok("Sua senha foi alterada!");
    }
}
