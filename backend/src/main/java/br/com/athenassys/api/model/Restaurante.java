package br.com.athenassys.api.model;

import br.com.athenassys.api.dto.restaurante.DadosAtualizacaoRestaurante;
import br.com.athenassys.api.dto.restaurante.DadosCadastroRestaurante;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

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
public class Restaurante implements UserDetails {

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

    //Segurança
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(
            new SimpleGrantedAuthority("ROLE_USUARIO")
        );
    }

    @Override
    public @Nullable String getPassword() {
        return this.senha;
    }

    @Override
    public String getUsername() {
        return this.email;
    }
}
