package br.com.athenassys.api.controller;

import br.com.athenassys.api.dto.pedido.DadosCadastroPedido;
import br.com.athenassys.api.dto.pedido.DadosDetalhamentoPedido;
import br.com.athenassys.api.dto.reserva.DadosCadastroReserva;
import br.com.athenassys.api.dto.reserva.DadosDetalhamentoReserva;
import br.com.athenassys.api.service.ReservaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("restaurantes/{idRestaurante}/reservas")
@RequiredArgsConstructor
public class ReservaController {

    private ReservaService service;

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
}
