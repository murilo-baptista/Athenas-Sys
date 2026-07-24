package br.com.athenassys.api.model;

import br.com.athenassys.api.dto.DadosAtualizacaoRestaurante;
import br.com.athenassys.api.dto.DadosCadastroRestaurante;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Table(name = "restaurantes")
@Entity(name = "Restaurante")

@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Restaurante {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String email;
    private String telefone;
    private String cnpj;
    private String senha;

    public Restaurante(DadosCadastroRestaurante dados) {
        this.nome = dados.nome();
        this.email = dados.email();
        this.telefone = dados.telefone();
        this.cnpj = dados.cnpj();
        this.senha = dados.senha();
    }

    public void atualizarDados(@Valid DadosAtualizacaoRestaurante dados) {
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
}
