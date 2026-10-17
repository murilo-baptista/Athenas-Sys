package br.com.athenassys.api.repository;

import br.com.athenassys.api.model.Reserva;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    Page<Reserva> findAllByRestauranteId(Long idRestaurante, Pageable paginacao);

    Optional<Reserva> findByIdAndRestauranteId(Long idReserva, Long idRestaurante);

    Page<Reserva> findAllByRestauranteIdAndMesaId(Long idRestaurante, Long idMesa, Pageable paginacao);
    Page<Reserva> findAllByRestauranteIdAndDataHoraBetween(Long idRestaurante, LocalDateTime inicio, LocalDateTime fim, Pageable paginacao);
    Page<Reserva> findAllByRestauranteIdAndMesaIdAndDataHoraBetween(Long idRestaurante, Long idMesa, LocalDateTime inicio, LocalDateTime fim, Pageable paginacao);
}
