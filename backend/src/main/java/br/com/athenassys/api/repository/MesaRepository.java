package br.com.athenassys.api.repository;

import br.com.athenassys.api.model.Mesa;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Range;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MesaRepository extends JpaRepository<Mesa, Long> {
    Page<Mesa> findAllByAtivoTrue(Pageable paginacao);
}
