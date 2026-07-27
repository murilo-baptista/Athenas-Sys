package br.com.athenassys.api.controller;

import br.com.athenassys.api.dto.mesa.DadosAtualizacaoMesa;
import br.com.athenassys.api.dto.mesa.DadosCadastroMesa;
import br.com.athenassys.api.dto.mesa.DadosDetalhamentoMesa;
import br.com.athenassys.api.dto.mesa.DadosListagemMesa;
import br.com.athenassys.api.service.MesaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("restaurantes/{idRestaurante}/mesas")
@RequiredArgsConstructor
public class MesaController {

    private final MesaService service;

    @PostMapping
    @Transactional
    public ResponseEntity<DadosDetalhamentoMesa> cadastrar(
            @PathVariable Long idRestaurante,
            @RequestBody @Valid DadosCadastroMesa dados,
            UriComponentsBuilder uriBuilder) {

        var mesa = service.cadastrar(dados, idRestaurante);

        var uri = uriBuilder.path("/restaurantes/{idRestaurante}/mesas/{id}")
                .buildAndExpand(idRestaurante, mesa.getId())
                .toUri();

        return ResponseEntity.created(uri)
                .body(new DadosDetalhamentoMesa(mesa));
    }

    @GetMapping
    public ResponseEntity<Page<DadosListagemMesa>> listar(
            @PathVariable Long idRestaurante,
            Pageable paginacao) {

        return ResponseEntity.ok(service.listar(idRestaurante, paginacao));
    }

    @PutMapping("/{idMesa}")
    @Transactional
    public ResponseEntity<DadosDetalhamentoMesa> atualizar(
            @PathVariable Long idRestaurante,
            @PathVariable Long idMesa,
            @RequestBody @Valid DadosAtualizacaoMesa dados) {

        var mesa = service.atualizar(dados, idMesa, idRestaurante);

        return ResponseEntity.ok(new DadosDetalhamentoMesa(mesa));
    }

    @DeleteMapping("/{idMesa}")
    @Transactional
    public ResponseEntity<Void> desativar(
            @PathVariable Long idRestaurante,
            @PathVariable Long idMesa) {

        service.desativar(idRestaurante, idMesa);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{idMesa}")
    public ResponseEntity<DadosDetalhamentoMesa> detalhar(
            @PathVariable Long idRestaurante,
            @PathVariable Long idMesa) {

        var mesa = service.buscarPorId(idMesa, idRestaurante);

        return ResponseEntity.ok(new DadosDetalhamentoMesa(mesa));
    }

    @PatchMapping("/{idMesa}/ocupar")
    @Transactional
    public ResponseEntity<DadosDetalhamentoMesa> ocupar(
            @PathVariable Long idRestaurante,
            @PathVariable Long idMesa
    ) {
        var mesa = service.ocupar(idMesa, idRestaurante);
        return ResponseEntity.ok(new DadosDetalhamentoMesa(mesa));
    }

    @PatchMapping("/{idMesa}/desocupar")
    @Transactional
    public ResponseEntity<DadosDetalhamentoMesa> desocupar(
            @PathVariable Long idRestaurante,
            @PathVariable Long idMesa
    ) {
        var mesa = service.desocupar(idMesa, idRestaurante);
        return ResponseEntity.ok(new DadosDetalhamentoMesa(mesa));
    }
}
