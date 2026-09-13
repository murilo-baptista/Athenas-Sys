package br.com.athenassys.api.controller;

import br.com.athenassys.api.dto.pedido.DadosAtualizacaoPedido;
import br.com.athenassys.api.dto.pedido.DadosCadastroPedido;
import br.com.athenassys.api.dto.pedido.DadosDetalhamentoPedido;
import br.com.athenassys.api.dto.pedido.DadosListagemPedido;
import br.com.athenassys.api.service.PedidoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("restaurantes/{idRestaurante}/pedidos")
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoService service;

    @PostMapping
    @Transactional
    public ResponseEntity<DadosDetalhamentoPedido> cadastrar(
            @PathVariable Long idRestaurante,
            @RequestBody @Valid DadosCadastroPedido dados,
            UriComponentsBuilder uriBuilder) {

        var pedido = service.cadastrar(dados, idRestaurante);

        var uri = uriBuilder.path("/restaurantes/{idRestaurante}/pedidos/{id}")
                .buildAndExpand(idRestaurante, pedido.getId())
                .toUri();

        return ResponseEntity.created(uri)
                .body(new DadosDetalhamentoPedido(pedido));
    }

    @GetMapping()
    public ResponseEntity<Page<DadosListagemPedido>> listar(
            @PathVariable Long idRestaurante,
            @RequestParam(required = false) Long idMesa,
            @RequestParam(required = false) Long idFuncionario,
            Pageable paginacao) {

        return ResponseEntity.ok(service.listar(idRestaurante, idMesa, idFuncionario, paginacao));
    }

    @PutMapping("/{idPedido}")
    @Transactional
    public ResponseEntity<DadosDetalhamentoPedido> atualizar(
            @PathVariable Long idRestaurante,
            @PathVariable Long idPedido,
            @RequestBody @Valid DadosAtualizacaoPedido dados) {

        var pedido = service.atualizar(dados, idPedido, idRestaurante);

        return ResponseEntity.ok(new DadosDetalhamentoPedido(pedido));
    }

    @GetMapping("/{idPedido}")
    public ResponseEntity<DadosDetalhamentoPedido> detalhar(
            @PathVariable Long idRestaurante,
            @PathVariable Long idPedido) {

        var pedido = service.buscarPorId(idPedido, idRestaurante);

        return ResponseEntity.ok(new DadosDetalhamentoPedido(pedido));
    }
}
