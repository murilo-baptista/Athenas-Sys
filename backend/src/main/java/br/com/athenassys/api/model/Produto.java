package br.com.athenassys.api.model;

import br.com.athenassys.api.dto.produto.DadosAtualizacaoProduto;
import br.com.athenassys.api.dto.produto.DadosCadastroProduto;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Table(
    name = "produtos",
    uniqueConstraints = {
            @UniqueConstraint(
                    columnNames = {"nome", "restaurante_id"},
                    name = "uk_produto_restaurante_nome"
            )
    }
)
@Entity(name = "Produto")

@Getter
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurante_id", nullable = false)
    private Restaurante restaurante;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    private String nome;
    private String descricao;
    private BigDecimal preco;
    private Boolean ativo;

    public Produto(DadosCadastroProduto dados, Restaurante restaurante, Categoria categoria) {
        this.ativo = true;
        this.restaurante = restaurante;
        this.categoria = categoria;
        this.nome = dados.nome();
        this.descricao = dados.descricao();
        this.preco = dados.preco();
    }

    public void atualizarDados(DadosAtualizacaoProduto dados, Categoria categoria) {
        if (dados.nome() != null) {
            this.nome = dados.nome();
        }
        if (dados.descricao() != null) {
            this.descricao = dados.descricao();
        }
        if (dados.preco() != null) {
            this.preco = dados.preco();
        }
        this.categoria = categoria;
    }

    public void desativar() {
        this.ativo = false;
    }
}
