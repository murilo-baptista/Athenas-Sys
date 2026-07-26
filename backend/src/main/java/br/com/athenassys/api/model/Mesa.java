package br.com.athenassys.api.model;

import br.com.athenassys.api.dto.DadosCadastroMesa;
import br.com.athenassys.api.enums.StatusMesa;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Table(name = "mesas")
@Entity(name = "Mesa")

@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Mesa {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
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
        this.status = dados.status();
    }
}
