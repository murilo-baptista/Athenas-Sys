package br.com.athenassys.api.service;

import br.com.athenassys.api.dto.mesa.DadosCadastroMesa;
import br.com.athenassys.api.dto.reserva.DadosCadastroReserva;
import br.com.athenassys.api.model.Mesa;
import br.com.athenassys.api.model.Reserva;
import br.com.athenassys.api.repository.MesaRepository;
import br.com.athenassys.api.repository.ReservaRepository;
import br.com.athenassys.api.repository.RestauranteRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReservaService {

    private final RestauranteRepository restauranteRepository;
    private final MesaRepository mesaRepository;
    private final ReservaRepository reservaRepository;

    public Reserva cadastrar(
            DadosCadastroReserva dados,
            Long idRestaurante) {

        var restaurante = restauranteRepository
                .findById(idRestaurante)
                .orElseThrow(() -> new EntityNotFoundException("Restaurante não encontrado."));

        var mesa = mesaRepository
                .findByIdAndRestauranteId(dados.idMesa(), idRestaurante)
                .orElseThrow(() -> new EntityNotFoundException("Mesa não encontrada."));

        var reserva = new Reserva(dados, restaurante, mesa);

        return reservaRepository.save(reserva);
    }
}
