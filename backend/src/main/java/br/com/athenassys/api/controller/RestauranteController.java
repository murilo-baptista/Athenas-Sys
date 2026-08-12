package br.com.athenassys.api.controller;

import br.com.athenassys.api.dto.restaurante.DadosAtualizacaoRestaurante;
import br.com.athenassys.api.dto.restaurante.DadosCadastroRestaurante;
import br.com.athenassys.api.dto.restaurante.DadosDetalhamentoRestaurante;
import br.com.athenassys.api.dto.restaurante.DadosListagemRestaurante;
import br.com.athenassys.api.service.RestauranteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("restaurantes")
@RequiredArgsConstructor
public class RestauranteController {

    private final RestauranteService service;

    @PostMapping
    @Transactional
    public ResponseEntity<DadosDetalhamentoRestaurante> cadastrar(
            @RequestBody @Valid DadosCadastroRestaurante dados,
            UriComponentsBuilder uriBuilder) {

        var restaurante = service.cadastrar(dados);

        var uri = uriBuilder.path("restaurantes/{id}")
                .buildAndExpand(restaurante.getId())
                .toUri();

        return ResponseEntity.created(uri)
                .body(new DadosDetalhamentoRestaurante(restaurante));
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
}
