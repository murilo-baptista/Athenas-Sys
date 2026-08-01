package br.com.athenassys.api.controller;

import br.com.athenassys.api.dto.categoria.DadosAtualizacaoCategoria;
import br.com.athenassys.api.dto.categoria.DadosCadastroCategoria;
import br.com.athenassys.api.dto.categoria.DadosDetalhamentoCategoria;
import br.com.athenassys.api.dto.categoria.DadosListagemCategoria;
import br.com.athenassys.api.dto.produto.DadosAtualizacaoProduto;
import br.com.athenassys.api.dto.produto.DadosCadastroProduto;
import br.com.athenassys.api.dto.produto.DadosDetalhamentoProduto;
import br.com.athenassys.api.dto.produto.DadosListagemProduto;
import br.com.athenassys.api.model.Categoria;
import br.com.athenassys.api.service.CategoriaService;
import br.com.athenassys.api.service.ProdutoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("restaurantes/{idRestaurante}/produtos")
@RequiredArgsConstructor
public class ProdutoController {

    private final ProdutoService service;

    @PostMapping
    @Transactional
    public ResponseEntity<DadosDetalhamentoProduto> cadastrar(
            @PathVariable Long idRestaurante,
            @RequestBody @Valid DadosCadastroProduto dados,
            UriComponentsBuilder uriBuilder) {

        var produto = service.cadastrar(dados, idRestaurante, dados.idCategoria());

        var uri = uriBuilder.path("/restaurantes/{idRestaurante}/produtos/{id}")
                .buildAndExpand(idRestaurante, produto.getId())
                .toUri();

        return ResponseEntity.created(uri)
                .body(new DadosDetalhamentoProduto(produto));
    }

    @GetMapping
    public ResponseEntity<Page<DadosListagemProduto>> listar(
            @PathVariable Long idRestaurante,
            Pageable paginacao) {

        return ResponseEntity.ok(service.listar(idRestaurante, paginacao));
    }

    @PutMapping("/{idProduto}")
    @Transactional
    public ResponseEntity<DadosDetalhamentoProduto> atualizar(
            @PathVariable Long idRestaurante,
            @PathVariable Long idProduto,
            @RequestBody @Valid DadosAtualizacaoProduto dados) {

        var produto = service.atualizar(dados, idProduto, idRestaurante);

        return ResponseEntity.ok(new DadosDetalhamentoProduto(produto));
    }

    @DeleteMapping("/{idProduto}")
    @Transactional
    public ResponseEntity<Void> desativar(
            @PathVariable Long idRestaurante,
            @PathVariable Long idProduto) {

        service.desativar(idRestaurante, idProduto);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{idProduto}")
    public ResponseEntity<DadosDetalhamentoProduto> detalhar(
            @PathVariable Long idRestaurante,
            @PathVariable Long idProduto) {

        var produto = service.buscarPorId(idProduto, idRestaurante);

        return ResponseEntity.ok(new DadosDetalhamentoProduto(produto));
    }
}
