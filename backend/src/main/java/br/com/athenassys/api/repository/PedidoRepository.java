package br.com.athenassys.api.repository;

import br.com.athenassys.api.model.Pedido;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    Page<Pedido> findAllByRestauranteId(Long idRestaurante, Pageable paginacao);

    Optional<Pedido> findByIdAndRestauranteId(Long idPedido, Long idRestaurante);
}
