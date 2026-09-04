package br.com.athenassys.api.model;

import br.com.athenassys.api.dto.restaurante.DadosAtualizacaoRestaurante;
import br.com.athenassys.api.dto.restaurante.DadosCadastroRestaurante;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Table(
    name = "restaurantes",
    uniqueConstraints = {
            @UniqueConstraint(
                    columnNames = "email",
                    name = "uk_restaurantes_email"
            ),
            @UniqueConstraint(
                    columnNames = "cnpj",
                    name = "uk_restaurantes_cnpj"
            )
    })
@Entity(name = "Restaurante")

@Getter
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Restaurante {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String email;
    private String telefone;
    private String cnpj;
    private String senha;
    private Boolean ativo;

    public Restaurante(DadosCadastroRestaurante dados) {
        this.ativo = true;
        this.nome = dados.nome();
        this.email = dados.email();
        this.telefone = dados.telefone();
        this.cnpj = dados.cnpj();
        this.senha = dados.senha();
    }

    public void atualizarDados(DadosAtualizacaoRestaurante dados) {
        if (dados.nome() != null) {
            this.nome = dados.nome();
        }
        if (dados.email() != null) {
            this.email = dados.email();
        }
        if (dados.telefone() != null) {
            this.telefone = dados.telefone();
        }
    }

    public void desativar() {
        this.ativo = false;
    }
}
