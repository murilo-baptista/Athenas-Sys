package br.com.athenassys.api.dto.reserva;

import br.com.athenassys.api.enums.StatusReserva;
import br.com.athenassys.api.model.Reserva;

import java.time.LocalDateTime;

public record DadosListagemReserva(

        Long id,
        Long idMesa,
        Integer numPessoas,
        String nomeCliente,
        String telefone,
        LocalDateTime dataHora,
        StatusReserva status
) {
    public DadosListagemReserva(Reserva reserva) {
        this(
                reserva.getId(),
                reserva.getMesa().getId(),
                reserva.getNumPessoas(),
                reserva.getNomeCliente(),
                reserva.getTelefone(),
                reserva.getDataHora(),
                reserva.getStatus()
        );
    }
}
