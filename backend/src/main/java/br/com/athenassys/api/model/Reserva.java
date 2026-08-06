package br.com.athenassys.api.model;

import br.com.athenassys.api.dto.mesa.DadosAtualizacaoMesa;
import br.com.athenassys.api.dto.mesa.DadosCadastroMesa;
import br.com.athenassys.api.dto.reserva.DadosCadastroReserva;
import br.com.athenassys.api.enums.StatusMesa;
import br.com.athenassys.api.enums.StatusReserva;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Table(name = "reservas")
@Entity(name = "Reserva")

@Getter
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurante_id", nullable = false)
    private Restaurante restaurante;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mesa_id", nullable = false)
    private Mesa mesa;

    private Integer numPessoas;
    private String nomeCliente;
    private String telefone;
    private LocalDateTime dataHora;

    @Enumerated(EnumType.STRING)
    private StatusReserva status;

    public Reserva(
            DadosCadastroReserva dados,
            Restaurante restaurante,
            Mesa mesa) {
        this.restaurante = restaurante;
        this.mesa = mesa;
        this.numPessoas = dados.numPessoas();
        this.nomeCliente = dados.nomeCliente();
        this.telefone = dados.telefone();
        this.dataHora = dados.dataHora();
        this.status = StatusReserva.ATIVA;
    }
/*
    public void atualizarDados(DadosAtualizacaoReserva dados) {
        if (dados.numero() != null) {
            this.numero = dados.numero();
        }
        if (dados.capacidade() != null) {
            this.capacidade = dados.capacidade();
        }
    }

    public void ocupar() {
        this.status = StatusMesa.OCUPADA;
    }

    public void desocupar() {
        this.status = StatusMesa.LIVRE;
    }*/
}