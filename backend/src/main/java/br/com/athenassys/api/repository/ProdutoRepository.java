package br.com.athenassys.api.repository;

import br.com.athenassys.api.model.Produto;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    Page<Produto> findAllByRestauranteIdAndAtivoTrue(Long idRestaurante, Pageable paginacao);

    Optional<Produto> findByIdAndRestauranteId(Long idProduto, Long idRestaurante);

    Optional<Produto> findByIdAndRestauranteIdAndAtivoTrue(Long idProduto, Long idRestaurante);
}
