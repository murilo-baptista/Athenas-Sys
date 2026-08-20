package br.com.athenassys.api.service;

import br.com.athenassys.api.dto.reserva.DadosAtualizacaoReserva;
import br.com.athenassys.api.dto.reserva.DadosCadastroReserva;
import br.com.athenassys.api.dto.reserva.DadosListagemReserva;
import br.com.athenassys.api.exception.EntidadeNaoEncontradaException;
import br.com.athenassys.api.model.Mesa;
import br.com.athenassys.api.model.Reserva;
import br.com.athenassys.api.repository.MesaRepository;
import br.com.athenassys.api.repository.ReservaRepository;
import br.com.athenassys.api.repository.RestauranteRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReservaService {

    private final RestauranteRepository restauranteRepository;
    private final MesaRepository mesaRepository;
    private final ReservaRepository reservaRepository;

    public Reserva cadastrar(
            DadosCadastroReserva dados,
            Long idRestaurante) {

        var restaurante = restauranteRepository
                .findById(idRestaurante)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Restaurante não encontrado."));

        var mesa = mesaRepository
                .findByIdAndRestauranteId(dados.idMesa(), idRestaurante)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Mesa não encontrada."));

        var reserva = new Reserva(dados, restaurante, mesa);

        return reservaRepository.save(reserva);
    }

    public Page<DadosListagemReserva> listar(
            Long idRestaurante,
            Pageable paginacao) {

        return reservaRepository.findAllByRestauranteId(idRestaurante, paginacao)
                .map(DadosListagemReserva::new);
    }

    public Reserva atualizar(
            DadosAtualizacaoReserva dados,
            Long idReserva,
            Long idRestaurante) {

        var reserva = reservaRepository
                .findByIdAndRestauranteId(idReserva, idRestaurante)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Reserva não encontrada."));

        Mesa mesa = reserva.getMesa();

        if (dados.idMesa() != null) {
            mesa = mesaRepository
                    .findByIdAndRestauranteId(dados.idMesa(), idRestaurante)
                    .orElseThrow(() -> new EntidadeNaoEncontradaException("Mesa não encontrada."));
        }

        reserva.atualizarDados(dados, mesa);
        return reserva;
    }

    public Reserva buscarPorId(Long idReserva, Long idRestaurante) {

        return reservaRepository
                .findByIdAndRestauranteId(idReserva, idRestaurante)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Reserva não encontrada."));
    }

    public Reserva concluir(Long idReserva, Long idRestaurante) {

        var reserva = reservaRepository
                .findByIdAndRestauranteId(idReserva, idRestaurante)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Reserva não encontrada."));

        reserva.concluir();
        return reserva;
    }

    public Reserva cancelar(Long idReserva, Long idRestaurante) {

        var reserva = reservaRepository
                .findByIdAndRestauranteId(idReserva, idRestaurante)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Reserva não encontrada."));

        reserva.cancelar();
        return reserva;
    }
}
