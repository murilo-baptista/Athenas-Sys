package br.com.athenassys.api.controller;

import br.com.athenassys.api.dto.categoria.DadosAtualizacaoCategoria;
import br.com.athenassys.api.dto.categoria.DadosCadastroCategoria;
import br.com.athenassys.api.dto.categoria.DadosDetalhamentoCategoria;
import br.com.athenassys.api.dto.categoria.DadosListagemCategoria;
import br.com.athenassys.api.service.CategoriaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("restaurantes/{idRestaurante}/categorias")
@RequiredArgsConstructor
public class CategoriaController {

    private final CategoriaService service;

    @PostMapping
    @Transactional
    public ResponseEntity<DadosDetalhamentoCategoria> cadastrar(
            @PathVariable Long idRestaurante,
            @RequestBody @Valid DadosCadastroCategoria dados,
            UriComponentsBuilder uriBuilder) {

        var categoria = service.cadastrar(dados, idRestaurante);

        var uri = uriBuilder.path("/restaurantes/{idRestaurante}/categorias/{id}")
                .buildAndExpand(idRestaurante, categoria.getId())
                .toUri();

        return ResponseEntity.created(uri)
                .body(new DadosDetalhamentoCategoria(categoria));
    }

    @GetMapping
    public ResponseEntity<Page<DadosListagemCategoria>> listar(
            @PathVariable Long idRestaurante,
            Pageable paginacao) {

        return ResponseEntity.ok(service.listar(idRestaurante, paginacao));
    }

    @PutMapping("/{idCategoria}")
    @Transactional
    public ResponseEntity<DadosDetalhamentoCategoria> atualizar(
            @PathVariable Long idRestaurante,
            @PathVariable Long idCategoria,
            @RequestBody @Valid DadosAtualizacaoCategoria dados) {

        var categoria = service.atualizar(dados, idCategoria, idRestaurante);

        return ResponseEntity.ok(new DadosDetalhamentoCategoria(categoria));
    }

    @DeleteMapping("/{idCategoria}")
    @Transactional
    public ResponseEntity<Void> desativar(
            @PathVariable Long idRestaurante,
            @PathVariable Long idCategoria) {

        service.desativar(idRestaurante, idCategoria);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{idCategoria}")
    public ResponseEntity<DadosDetalhamentoCategoria> detalhar(
            @PathVariable Long idRestaurante,
            @PathVariable Long idCategoria) {

        var categoria = service.buscarPorId(idCategoria, idRestaurante);

        return ResponseEntity.ok(new DadosDetalhamentoCategoria(categoria));
    }
}
