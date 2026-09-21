package br.com.athenassys.api.model;

import br.com.athenassys.api.dto.funcionario.DadosAtualizacaoFuncionario;
import br.com.athenassys.api.dto.funcionario.DadosCadastroFuncionario;
import br.com.athenassys.api.enums.Cargo;
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
    name = "funcionarios",
    uniqueConstraints = {
        @UniqueConstraint(
            columnNames = {"restaurante_id", "nome"},
            name = "uk_funcionarios_restaurante_nome"
        )
    }
)
@Entity(name = "Funcionario")

@Getter
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Funcionario implements UserDetails {

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

    //Segurança
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(
                new SimpleGrantedAuthority("ROLE_" + this.cargo)
        );
    }

    @Override
    public @Nullable String getPassword() {
        return this.codigo;
    }

    @Override
    public String getUsername() {
        return this.nome;
    }

    @Override
    public boolean isEnabled() {
        return this.ativo;
    }
}
