package br.com.athenassys.api.dto.reserva;

import br.com.athenassys.api.model.Reserva;

import java.time.LocalDateTime;

public record DadosDetalhamentoReserva(

        Long id,
        Long idMesa,
        Integer numPessoas,
        String nomeCliente,
        String telefone,
        LocalDateTime dataHora
) {
    public DadosDetalhamentoReserva(Reserva reserva) {
        this(
                reserva.getId(),
                reserva.getMesa().getId(),
                reserva.getNumPessoas(),
                reserva.getNomeCliente(),
                reserva.getTelefone(),
                reserva.getDataHora()
        );
    }
}
