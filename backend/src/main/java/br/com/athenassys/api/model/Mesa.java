package br.com.athenassys.api.model;

import br.com.athenassys.api.dto.mesa.DadosAtualizacaoMesa;
import br.com.athenassys.api.dto.mesa.DadosCadastroMesa;
import br.com.athenassys.api.enums.StatusMesa;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Table(name = "mesas")
@Entity(name = "Mesa")

@Getter
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Mesa {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurante_id", nullable = false)
    private Restaurante restaurante;
    private Integer numero;
    private Integer capacidade;

    @Enumerated(EnumType.STRING)
    private StatusMesa status;
    private Boolean ativo;

    public Mesa(DadosCadastroMesa dados, Restaurante restaurante) {
        this.ativo = true;
        this.restaurante = restaurante;
        this.numero = dados.numero();
        this.capacidade = dados.capacidade();
        this.status = StatusMesa.LIVRE;
    }

    public void atualizarDados(DadosAtualizacaoMesa dados) {
        if (dados.numero() != null) {
            this.numero = dados.numero();
        }
        if (dados.capacidade() != null) {
            this.capacidade = dados.capacidade();
        }
    }

    public void desativar() {
        this.ativo = false;
    }


    public void ocupar() {
        this.status = StatusMesa.OCUPADA;
    }

    public void desocupar() {
        this.status = StatusMesa.LIVRE;
    }
}
