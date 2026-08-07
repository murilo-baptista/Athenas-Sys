package br.com.athenassys.api.model;

import br.com.athenassys.api.dto.itempedido.DadosAtualizacaoItemPedido;
import br.com.athenassys.api.dto.itempedido.DadosCadastroItemPedido;
import br.com.athenassys.api.enums.StatusItemPedido;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Table(name = "itens_pedido")
@Entity(name = "ItemPedido")

@Getter
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class ItemPedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurante_id", nullable = false)
    private Restaurante restaurante;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id", nullable = false)
    private Pedido pedido;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produto_id", nullable = false)
    private Produto produto;

    private Integer quantidade;
    private String observacao;
    private BigDecimal valorUnitario;

    @Enumerated(EnumType.STRING)
    private StatusItemPedido status;

    public ItemPedido(
            DadosCadastroItemPedido dados,
            Restaurante restaurante,
            Pedido pedido,
            Produto produto
    ) {
        this.restaurante = restaurante;
        this.pedido = pedido;
        this.produto = produto;
        this.quantidade = dados.quantidade();
        this.observacao = dados.observacao();
        this.valorUnitario = produto.getPreco();
        this.status = StatusItemPedido.PENDENTE;
    }

    public void atualizarDados(DadosAtualizacaoItemPedido dados, Produto produto) {
        if (dados.quantidade() != null) {
            this.quantidade = dados.quantidade();
        }
        if (dados.observacao() != null) {
            this.observacao = dados.observacao();
        }
        if (dados.idProduto() != null) {
            this.produto = produto;
            this.valorUnitario = produto.getPreco();
        }
    }

    public void preparar() {
        this.status = StatusItemPedido.EM_PREPARO;
    }

    public void marcarPronto() {
        this.status = StatusItemPedido.PRONTO;
    }

    public void entregar() {
        this.status = StatusItemPedido.ENTREGUE;
    }

    public void cancelar() {
        this.status = StatusItemPedido.CANCELADO;
    }
}
