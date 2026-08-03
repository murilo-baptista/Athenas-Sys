package br.com.athenassys.api.model;

import br.com.athenassys.api.dto.pedido.DadosAtualizacaoPedido;
import br.com.athenassys.api.dto.pedido.DadosCadastroPedido;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Table(name = "pedidos")
@Entity(name = "Pedido")

@Getter
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurante_id", nullable = false)
    private Restaurante restaurante;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mesa_id", nullable = false)
    private Mesa mesa;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "funcionario_id", nullable = false)
    private Funcionario funcionario;

    private LocalDateTime dataHora;
    private BigDecimal valorTotal;
    private String observacao;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL)
    private List<ItemPedido> itens = new ArrayList<>();

    public Pedido(
            DadosCadastroPedido dados,
            Restaurante restaurante,
            Mesa mesa,
            Funcionario funcionario
    ) {
        this.restaurante = restaurante;
        this.mesa = mesa;
        this.funcionario = funcionario;
        this.dataHora = LocalDateTime.now();
        this.observacao = dados.observacao();
    }

    public void atualizarDados(DadosAtualizacaoPedido dados, Mesa mesa, Funcionario funcionario) {
        if (dados.valorTotal() != null) {
            this.valorTotal = dados.valorTotal();
        }
        if (dados.observacao() != null) {
            this.observacao = dados.observacao();
        }
        this.mesa = mesa;
        this.funcionario = funcionario;
    }

    public void calcularTotal() {

        BigDecimal total = BigDecimal.ZERO;

        for (ItemPedido item : itens) {
            BigDecimal subtotal = item.getValorUnitario()
                    .multiply(BigDecimal.valueOf(item.getQuantidade()));
            total = total.add(subtotal);
        }
        this.valorTotal = total;
    }
}
