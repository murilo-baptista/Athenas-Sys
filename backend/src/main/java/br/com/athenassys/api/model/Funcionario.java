package br.com.athenassys.api.model;

import br.com.athenassys.api.dto.funcionario.DadosAtualizacaoFuncionario;
import br.com.athenassys.api.dto.funcionario.DadosCadastroFuncionario;
import br.com.athenassys.api.enums.Cargo;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Table(
    name = "funcionarios",
    uniqueConstraints = {
        @UniqueConstraint(
            columnNames = {"codigo", "restaurante_id"},
            name = "uk_funcionario_restaurante_codigo"
        )
    }
)
@Entity(name = "Funcionario")

@Getter
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Funcionario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurante_id", nullable = false)
    private Restaurante restaurante;
    private String nome;
    private String codigo;

    @Enumerated(EnumType.STRING)
    private Cargo cargo;
    private Boolean ativo;

    public Funcionario(DadosCadastroFuncionario dados, Restaurante restaurante) {
        this.ativo = true;
        this.restaurante = restaurante;
        this.nome = dados.nome();
        this.codigo = dados.codigo();
        this.cargo = dados.cargo();
    }

    public void atualizarDados(DadosAtualizacaoFuncionario dados) {
        if (dados.nome() != null) {
            this.nome = dados.nome();
        }
        if (dados.cargo() != null) {
            this.cargo = dados.cargo();
        }
    }

    public void desativar() {
        this.ativo = false;
    }
}
