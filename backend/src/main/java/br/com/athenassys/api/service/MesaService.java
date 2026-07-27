package br.com.athenassys.api.service;

import br.com.athenassys.api.dto.DadosCadastroMesa;
import br.com.athenassys.api.dto.DadosListagemMesa;
import br.com.athenassys.api.dto.DadosListagemRestaurante;
import br.com.athenassys.api.model.Mesa;
import br.com.athenassys.api.model.Restaurante;
import br.com.athenassys.api.repository.MesaRepository;
import br.com.athenassys.api.repository.RestauranteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MesaService {

    private final RestauranteRepository restauranteRepository;
    private final MesaRepository mesaRepository;

    public Mesa cadastrar(DadosCadastroMesa dados) {

        Restaurante restaurante = restauranteRepository
                .getReferenceById(dados.idRestaurante());

        Mesa mesa = new Mesa(dados, restaurante);

        return mesaRepository.save(mesa);
    }

    public Page<DadosListagemMesa> listar(Pageable paginacao) {
        return mesaRepository.findAllByAtivoTrue(paginacao)
                .map(DadosListagemMesa::new);
    }

    public Mesa buscarPorId(Long id) {
        return mesaRepository.getReferenceById(id);
    }
}
