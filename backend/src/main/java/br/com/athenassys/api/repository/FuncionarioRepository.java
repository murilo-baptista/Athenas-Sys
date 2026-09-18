package br.com.athenassys.api.repository;

import br.com.athenassys.api.model.Funcionario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {
    Page<Funcionario> findAllByRestauranteIdAndAtivoTrue(Long idRestaurante, Pageable paginacao);

    Optional<Funcionario> findByIdAndRestauranteId(Long idFuncionario, Long idRestaurante);

    UserDetails findByIdLoginAndRestauranteId(String login, Long idRestaurante);
}
