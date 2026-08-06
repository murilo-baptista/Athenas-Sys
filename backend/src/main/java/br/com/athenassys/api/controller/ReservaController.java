package br.com.athenassys.api.controller;

import br.com.athenassys.api.dto.itempedido.DadosDetalhamentoItemPedido;
import br.com.athenassys.api.dto.produto.DadosDetalhamentoProduto;
import br.com.athenassys.api.dto.reserva.DadosAtualizacaoReserva;
import br.com.athenassys.api.dto.reserva.DadosCadastroReserva;
import br.com.athenassys.api.dto.reserva.DadosDetalhamentoReserva;
import br.com.athenassys.api.dto.reserva.DadosListagemReserva;
import br.com.athenassys.api.service.ReservaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("restaurantes/{idRestaurante}/reservas")
@RequiredArgsConstructor
public class ReservaController {

    private final ReservaService service;

    @PostMapping
    @Transactional
    public ResponseEntity<DadosDetalhamentoReserva> cadastrar(
            @PathVariable Long idRestaurante,
            @RequestBody @Valid DadosCadastroReserva dados,
            UriComponentsBuilder uriBuilder) {

        var reserva = service.cadastrar(dados, idRestaurante);

        var uri = uriBuilder.path("/restaurantes/{idRestaurante}/reservas/{id}")
                .buildAndExpand(idRestaurante, reserva.getId())
                .toUri();

        return ResponseEntity.created(uri)
                .body(new DadosDetalhamentoReserva(reserva));
    }

    @GetMapping
    public ResponseEntity<Page<DadosListagemReserva>> listar(
            @PathVariable Long idRestaurante,
            Pageable paginacao) {

        return ResponseEntity.ok(service.listar(idRestaurante, paginacao));
    }

    @PutMapping("/{idReserva}")
    @Transactional
    public ResponseEntity<DadosDetalhamentoReserva> atualizar(
            @PathVariable Long idRestaurante,
            @PathVariable Long idReserva,
            @RequestBody @Valid DadosAtualizacaoReserva dados) {

        var reserva = service.atualizar(dados, idReserva, idRestaurante);

        return ResponseEntity.ok(new DadosDetalhamentoReserva(reserva));
    }

    @GetMapping("/{idReserva}")
    public ResponseEntity<DadosDetalhamentoReserva> detalhar(
            @PathVariable Long idRestaurante,
            @PathVariable Long idReserva) {

        var reserva = service.buscarPorId(idReserva, idRestaurante);

        return ResponseEntity.ok(new DadosDetalhamentoReserva(reserva));
    }

    @PatchMapping("/{idReserva}/concluir")
    @Transactional
    public ResponseEntity<DadosDetalhamentoReserva> concluir(
            @PathVariable Long idRestaurante,
            @PathVariable Long idReserva
    ) {
        var reserva = service.concluir(idReserva, idRestaurante);
        return ResponseEntity.ok(new DadosDetalhamentoReserva(reserva));
    }

    @PatchMapping("/{idReserva}/cancelar")
    @Transactional
    public ResponseEntity<DadosDetalhamentoReserva> cancelar(
            @PathVariable Long idRestaurante,
            @PathVariable Long idReserva
    ) {
        var reserva = service.cancelar(idReserva, idRestaurante);
        return ResponseEntity.ok(new DadosDetalhamentoReserva(reserva));
    }
}
