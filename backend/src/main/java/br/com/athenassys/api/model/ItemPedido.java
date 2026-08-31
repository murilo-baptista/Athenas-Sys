package br.com.athenassys.api.model;

import br.com.athenassys.api.dto.itempedido.DadosAtualizacaoItemPedido;
import br.com.athenassys.api.dto.itempedido.DadosCadastroItemPedido;
import br.com.athenassys.api.enums.StatusItemPedido;
import br.com.athenassys.api.exception.StatusInvalidoException;
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

        if (this.status != StatusItemPedido.PENDENTE) {
            throw new StatusInvalidoException("Não foi possível alterar o status do item, " +
                    "para definir um item como EM_PREPARO antes ele deve estar como PENDENTE");
        }
        this.status = StatusItemPedido.EM_PREPARO;
    }

    public void marcarPronto() {

        if (this.status != StatusItemPedido.EM_PREPARO) {
            throw new StatusInvalidoException("Não foi possível alterar o status do item, " +
                    "para definir um item como PRONTO antes ele deve estar como EM_PREPARO");
        }
        this.status = StatusItemPedido.PRONTO;
    }

    public void entregar() {

        if (this.status != StatusItemPedido.PRONTO) {
            throw new StatusInvalidoException("Não foi possível alterar o status do item, " +
                    "para definir um item como ENTREGUE antes ele deve estar como PRONTO");
        }
        this.status = StatusItemPedido.ENTREGUE;
    }

    public void cancelar() {

        if (this.status == StatusItemPedido.ENTREGUE) {
            throw new StatusInvalidoException("Não foi possível alterar o status do item, " +
                    "só é possível definir um item como CANCELADO se ele ainda não tiver sido ENTREGUE");

        } else if (this.status == StatusItemPedido.CANCELADO) {
            throw new StatusInvalidoException("Não foi possível alterar o status do item, " +
                    "esse item já foi CANCELADO");
        }
        this.status = StatusItemPedido.CANCELADO;
    }
}
