package br.com.athenassys.api.service;

import br.com.athenassys.api.dto.DadosAtualizacaoMesa;
import br.com.athenassys.api.dto.DadosCadastroMesa;
import br.com.athenassys.api.dto.DadosListagemMesa;
import br.com.athenassys.api.model.Mesa;
import br.com.athenassys.api.repository.MesaRepository;
import br.com.athenassys.api.repository.RestauranteRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MesaService {

    private final RestauranteRepository restauranteRepository;
    private final MesaRepository mesaRepository;

    public Mesa cadastrar(
            DadosCadastroMesa dados,
            Long idRestaurante) {

        var restaurante = restauranteRepository
                .findById(idRestaurante)
                .orElseThrow();
        var mesa = new Mesa(dados, restaurante);

        return mesaRepository.save(mesa);
    }

    public Page<DadosListagemMesa> listar(
            Long restauranteId,
            Pageable paginacao) {

        return mesaRepository.findAllByRestauranteIdAndAtivoTrue(restauranteId, paginacao)
                .map(DadosListagemMesa::new);
    }

    public Mesa atualizar(@Valid DadosAtualizacaoMesa dados, Long idMesa, Long idRestaurante) {

        var mesa = mesaRepository
                .findByIdAndRestauranteId(idMesa, idRestaurante)
                .orElseThrow(() -> new EntityNotFoundException("Mesa não encontrada."));

        mesa.atualizarDados(dados);
        return mesa;
    }

    public Mesa desativar(Long idRestaurante, Long idMesa) {

        var mesa = mesaRepository
                .findByIdAndRestauranteId(idMesa, idRestaurante)
                .orElseThrow(() -> new EntityNotFoundException("Mesa não encontrada."));

        mesa.desativar();
        return mesa;
    }

    public Mesa buscarPorId(Long idMesa, Long idRestaurante) {

        return mesaRepository
                .findByIdAndRestauranteId(idMesa, idRestaurante)
                .orElseThrow(() -> new EntityNotFoundException("Mesa não encontrada."));
    }
}
