package br.com.athenassys.api.repository;

import br.com.athenassys.api.model.ItemPedido;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ItemPedidoRepository extends JpaRepository<ItemPedido, Long> {
    Page<ItemPedido> findAllByRestauranteIdAndPedidoId(Long idRestaurante, Long idPedido, Pageable paginacao);

    Optional<ItemPedido> findByIdAndPedidoIdAndRestauranteId(Long idItemPedido, Long idPedido, Long idRestaurante);

}
