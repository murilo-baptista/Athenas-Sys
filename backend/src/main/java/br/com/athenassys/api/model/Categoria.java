package br.com.athenassys.api.model;

import br.com.athenassys.api.dto.categoria.DadosAtualizacaoCategoria;
import br.com.athenassys.api.dto.categoria.DadosCadastroCategoria;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Table(
    name = "categorias",
    uniqueConstraints = {
            @UniqueConstraint(
                    columnNames = {"restaurante_id", "nome"},
                    name = "uk_categorias_restaurante_nome"
            )
    }
)
@Entity(name = "Categoria")

@Getter
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurante_id", nullable = false)
    private Restaurante restaurante;
    private String nome;
    private Boolean ativo;

    public Categoria(DadosCadastroCategoria dados, Restaurante restaurante) {
        this.ativo = true;
        this.restaurante = restaurante;
        this.nome = dados.nome();
    }

    public void atualizarDados(DadosAtualizacaoCategoria dados) {
        if (dados.nome() != null) {
            this.nome = dados.nome();
        }
    }

    public void desativar() {
        this.ativo = false;
    }
}
