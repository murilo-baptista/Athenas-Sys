package br.com.athenassys.api.controller;

import br.com.athenassys.api.dto.itempedido.DadosAtualizacaoItemPedido;
import br.com.athenassys.api.dto.itempedido.DadosCadastroItemPedido;
import br.com.athenassys.api.dto.itempedido.DadosDetalhamentoItemPedido;
import br.com.athenassys.api.dto.itempedido.DadosListagemItemPedido;
import br.com.athenassys.api.service.ItemPedidoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("restaurantes/{idRestaurante}/pedidos/{idPedido}/itens")
@RequiredArgsConstructor
public class ItemPedidoController {

    private final ItemPedidoService service;

    @PostMapping
    @Transactional
    public ResponseEntity<DadosDetalhamentoItemPedido> cadastrar(
            @PathVariable Long idRestaurante,
            @PathVariable Long idPedido,
            @RequestBody @Valid DadosCadastroItemPedido dados,
            UriComponentsBuilder uriBuilder) {

        var itemPedido = service.cadastrar(dados, idPedido, idRestaurante);

        var uri = uriBuilder.path("/restaurantes/{idRestaurante}/pedidos/{idPedido}/itens/{id}")
                .buildAndExpand(idRestaurante, idPedido, itemPedido.getId())
                .toUri();

        return ResponseEntity.created(uri)
                .body(new DadosDetalhamentoItemPedido(itemPedido));
    }

    @GetMapping
    public ResponseEntity<Page<DadosListagemItemPedido>> listar(
            @PathVariable Long idRestaurante,
            @PathVariable Long idPedido,
            Pageable paginacao) {

        return ResponseEntity.ok(service.listar(idRestaurante, idPedido, paginacao));
    }

    @PutMapping("/{idItemPedido}")
    @Transactional
    public ResponseEntity<DadosDetalhamentoItemPedido> atualizar(
            @PathVariable Long idRestaurante,
            @PathVariable Long idPedido,
            @PathVariable Long idItemPedido,
            @RequestBody @Valid DadosAtualizacaoItemPedido dados) {

        var pedido = service.atualizar(dados, idItemPedido, idPedido, idRestaurante);

        return ResponseEntity.ok(new DadosDetalhamentoItemPedido(pedido));
    }

    @GetMapping("/{idItemPedido}")
    public ResponseEntity<DadosDetalhamentoItemPedido> detalhar(
            @PathVariable Long idRestaurante,
            @PathVariable Long idPedido,
            @PathVariable Long idItemPedido) {

        var itemPedido = service.buscarPorId(idItemPedido, idPedido, idRestaurante);

        return ResponseEntity.ok(new DadosDetalhamentoItemPedido(itemPedido));
    }

    @PatchMapping("/{idItemPedido}/preparar")
    @Transactional
    public ResponseEntity<DadosDetalhamentoItemPedido> preparar(
            @PathVariable Long idRestaurante,
            @PathVariable Long idPedido,
            @PathVariable Long idItemPedido
    ) {
        var itemPedido = service.preparar(idItemPedido, idPedido, idRestaurante);
        return ResponseEntity.ok(new DadosDetalhamentoItemPedido(itemPedido));
    }

    @PatchMapping("/{idItemPedido}/finalizar")
    @Transactional
    public ResponseEntity<DadosDetalhamentoItemPedido> marcarPronto(
            @PathVariable Long idRestaurante,
            @PathVariable Long idPedido,
            @PathVariable Long idItemPedido
    ) {
        var itemPedido = service.marcarPronto(idItemPedido, idPedido, idRestaurante);
        return ResponseEntity.ok(new DadosDetalhamentoItemPedido(itemPedido));
    }

    @PatchMapping("/{idItemPedido}/entregar")
    @Transactional
    public ResponseEntity<DadosDetalhamentoItemPedido> entregar(
            @PathVariable Long idRestaurante,
            @PathVariable Long idPedido,
            @PathVariable Long idItemPedido
    ) {
        var itemPedido = service.entregar(idItemPedido, idPedido, idRestaurante);
        return ResponseEntity.ok(new DadosDetalhamentoItemPedido(itemPedido));
    }

    @PatchMapping("/{idItemPedido}/cancelar")
    @Transactional
    public ResponseEntity<DadosDetalhamentoItemPedido> cancelar(
            @PathVariable Long idRestaurante,
            @PathVariable Long idPedido,
            @PathVariable Long idItemPedido
    ) {
        var itemPedido = service.cancelar(idItemPedido, idPedido, idRestaurante);
        return ResponseEntity.ok(new DadosDetalhamentoItemPedido(itemPedido));
    }
}
