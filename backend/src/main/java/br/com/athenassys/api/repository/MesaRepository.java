package br.com.athenassys.api.repository;

import br.com.athenassys.api.model.Mesa;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MesaRepository extends JpaRepository<Mesa, Long> {
    Page<Mesa> findAllByRestauranteIdAndAtivoTrue(Long idRestaurante, Pageable paginacao);

    Optional<Mesa> findByIdAndRestauranteId(Long idMesa, Long idRestaurante);
}
