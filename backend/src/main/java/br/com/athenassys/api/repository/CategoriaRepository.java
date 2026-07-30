package br.com.athenassys.api.repository;

import br.com.athenassys.api.model.Categoria;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    Page<Categoria> findAllByRestauranteIdAndAtivoTrue(Long restauranteId, Pageable paginacao);

    Optional<Categoria> findByIdAndRestauranteId(Long idCategoria, Long idRestaurante);
}
