package br.com.athenassys.api.controller;

import br.com.athenassys.api.dto.funcionario.DadosAtualizacaoFuncionario;
import br.com.athenassys.api.dto.funcionario.DadosDetalhamentoFuncionario;
import br.com.athenassys.api.dto.funcionario.DadosListagemFuncionario;
import br.com.athenassys.api.dto.funcionario.DadosCadastroFuncionario;
import br.com.athenassys.api.service.FuncionarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("restaurantes/{idRestaurante}/funcionarios")
@RequiredArgsConstructor
public class FuncionarioController {

    private final FuncionarioService service;

    @PostMapping
    @Transactional
    public ResponseEntity<DadosDetalhamentoFuncionario> cadastrar(
            @PathVariable Long idRestaurante,
            @RequestBody @Valid DadosCadastroFuncionario dados,
            UriComponentsBuilder uriBuilder) {

        var funcionario = service.cadastrar(dados, idRestaurante);

        var uri = uriBuilder.path("/restaurantes/{idRestaurante}/funcionarios/{id}")
                .buildAndExpand(idRestaurante, funcionario.getId())
                .toUri();

        return ResponseEntity.created(uri)
                .body(new DadosDetalhamentoFuncionario(funcionario));
    }

    @GetMapping
    public ResponseEntity<Page<DadosListagemFuncionario>> listar(
            @PathVariable Long idRestaurante,
            Pageable paginacao) {

        return ResponseEntity.ok(service.listar(idRestaurante, paginacao));
    }

    @PutMapping("/{funcionarioId}")
    @Transactional
    public ResponseEntity<DadosDetalhamentoFuncionario> atualizar(
            @PathVariable Long idRestaurante,
            @PathVariable Long idFuncionario,
            @RequestBody @Valid DadosAtualizacaoFuncionario dados) {

        var funcionario = service.atualizar(dados, idFuncionario, idRestaurante);

        return ResponseEntity.ok(new DadosDetalhamentoFuncionario(funcionario));
    }

    @DeleteMapping("/{idFuncionario}")
    @Transactional
    public ResponseEntity<Void> desativar(
            @PathVariable Long idRestaurante,
            @PathVariable Long idFuncionario) {

        service.desativar(idRestaurante, idFuncionario);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{idFuncionario}")
    public ResponseEntity<DadosDetalhamentoFuncionario> detalhar(
            @PathVariable Long idRestaurante,
            @PathVariable Long idFuncionario) {

        var funcionario = service.buscarPorId(idFuncionario, idRestaurante);

        return ResponseEntity.ok(new DadosDetalhamentoFuncionario(funcionario));
    }
}
