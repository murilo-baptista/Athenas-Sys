package br.com.athenassys.api.controller;

import br.com.athenassys.api.dto.*;
import br.com.athenassys.api.model.Mesa;
import br.com.athenassys.api.repository.MesaRepository;
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
@RequestMapping("mesas")
@RequiredArgsConstructor
public class MesaController {

    private final MesaService service;

    @PostMapping
    @Transactional
    public ResponseEntity cadastrar(
            @RequestBody @Valid DadosCadastroMesa dados,
            UriComponentsBuilder uriBuilder) {

        var mesa = service.cadastrar(dados);

        var uri = uriBuilder.path("restaurantes/{id}")
                .buildAndExpand(mesa.getId())
                .toUri();

        return ResponseEntity.created(uri)
                .body(new DadosDetalhamentoMesa(mesa));
    }

    @GetMapping
    public ResponseEntity<Page<DadosListagemMesa>> listar(Pageable paginacao) {
        return ResponseEntity.ok(service.listar(paginacao));
    }



    @GetMapping("/{id}")
    public ResponseEntity detalhar(@PathVariable Long id) {
        var mesa = service.buscarPorId(id);

        return ResponseEntity.ok(new DadosDetalhamentoMesa(mesa));
    }
}
