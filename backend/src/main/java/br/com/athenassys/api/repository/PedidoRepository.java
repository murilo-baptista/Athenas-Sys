package br.com.athenassys.api.repository;

import br.com.athenassys.api.model.Pedido;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    Page<Pedido> findAllByRestauranteId(Long idRestaurante, Pageable paginacao);
    Page<Pedido> findAllByRestauranteIdAndMesaId(Long idRestaurante, Long idMesa, Pageable paginacao);
    Page<Pedido> findAllByRestauranteIdAndFuncionarioId(Long idRestaurante, Long idFuncionario, Pageable paginacao);
    Page<Pedido> findAllByRestauranteIdAndMesaIdAndFuncionarioId(Long idRestaurante, Long idMesa, Long idFuncionario, Pageable paginacao);

    Optional<Pedido> findByIdAndRestauranteId(Long idPedido, Long idRestaurante);
}
