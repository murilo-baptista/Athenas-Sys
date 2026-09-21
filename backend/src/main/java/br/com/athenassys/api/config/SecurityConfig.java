package br.com.athenassys.api.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(req -> {

                    //Login
                    req.requestMatchers(HttpMethod.POST, "/auth/login").permitAll();

                    //Restaurante
                    req.requestMatchers(HttpMethod.POST, "/restaurantes").permitAll();
                    req.requestMatchers(HttpMethod.PUT, "/restaurantes/{idRestaurante}").hasRole("GERENTE");
                    req.requestMatchers(HttpMethod.DELETE, "/restaurantes/{idRestaurante}").hasRole("GERENTE");
                    req.requestMatchers(HttpMethod.GET, "/restaurantes/{idRestaurante}").hasRole("GERENTE");

                    //Funcionários
                    req.requestMatchers(HttpMethod.POST, "/restaurantes/{idRestaurante}/funcionarios").hasRole("GERENTE");
                    req.requestMatchers(HttpMethod.PUT, "/restaurantes/{idRestaurante}/funcionarios/{idFuncionario}").hasRole("GERENTE");
                    req.requestMatchers(HttpMethod.DELETE, "/restaurantes/{idRestaurante}/funcionarios/{idFuncionario}").hasRole("GERENTE");
                    req.requestMatchers(HttpMethod.GET, "/restaurantes/{idRestaurante}/funcionarios").hasRole("GERENTE");
                    req.requestMatchers(HttpMethod.GET, "/restaurantes/{idRestaurante}/funcionarios/{idFuncionario}").hasRole("GERENTE");

                    //Mesas
                    req.requestMatchers(HttpMethod.POST, "/restaurantes/{idRestaurante}/mesas").hasRole("GERENTE");
                    req.requestMatchers(HttpMethod.PUT, "/restaurantes/{idRestaurante}/mesas/{idMesa}").hasRole("GERENTE");
                    req.requestMatchers(HttpMethod.DELETE, "/restaurantes/{idRestaurante}/mesas/{idMesa}").hasRole("GERENTE");
                    req.requestMatchers(HttpMethod.GET, "/restaurantes/{idRestaurante}/mesas").hasAnyRole("GERENTE", "RECEPCAO");
                    req.requestMatchers(HttpMethod.GET, "/restaurantes/{idRestaurante}/mesas/{idMesa}").hasAnyRole("GERENTE", "RECEPCAO");
                    req.requestMatchers(HttpMethod.PATCH, "/restaurantes/{idRestaurante}/mesas/{idMesa}/ocupar").hasAnyRole("GERENTE", "RECEPCAO");
                    req.requestMatchers(HttpMethod.PATCH, "/restaurantes/{idRestaurante}/mesas/{idMesa}/desocupar").hasAnyRole("GERENTE", "RECEPCAO");

                    //Reservas
                    req.requestMatchers(HttpMethod.POST, "/restaurantes/{idRestaurante}/reservas").hasAnyRole("GERENTE", "RECEPCAO");
                    req.requestMatchers(HttpMethod.PUT, "/restaurantes/{idRestaurante}/reservas/{idReserva}").hasAnyRole("GERENTE", "RECEPCAO");
                    req.requestMatchers(HttpMethod.GET, "/restaurantes/{idRestaurante}/reservas").hasAnyRole("GERENTE", "RECEPCAO");
                    req.requestMatchers(HttpMethod.GET, "/restaurantes/{idRestaurante}/reservas/{idReserva}").hasAnyRole("GERENTE", "RECEPCAO");
                    req.requestMatchers(HttpMethod.PATCH, "/restaurantes/{idRestaurante}/reservas/{idReserva}/concluir").hasAnyRole("GERENTE", "RECEPCAO");
                    req.requestMatchers(HttpMethod.PATCH, "/restaurantes/{idRestaurante}/reservas/{idReserva}/cancelar").hasAnyRole("GERENTE", "RECEPCAO");

                    //Categorias
                    req.requestMatchers(HttpMethod.POST, "/restaurantes/{idRestaurante}/categorias").hasRole("GERENTE");
                    req.requestMatchers(HttpMethod.PUT, "/restaurantes/{idRestaurante}/categorias/{idCategoria}").hasRole("GERENTE");
                    req.requestMatchers(HttpMethod.DELETE, "/restaurantes/{idRestaurante}/categorias/{idCategoria}").hasRole("GERENTE");
                    req.requestMatchers(HttpMethod.GET, "/restaurantes/{idRestaurante}/categorias").hasAnyRole("GERENTE", "GARCOM");
                    req.requestMatchers(HttpMethod.GET, "/restaurantes/{idRestaurante}/categorias/{idCategoria}").hasAnyRole("GERENTE", "GARCOM");

                    //Produtos
                    req.requestMatchers(HttpMethod.POST, "/restaurantes/{idRestaurante}/produtos").hasRole("GERENTE");
                    req.requestMatchers(HttpMethod.PUT, "/restaurantes/{idRestaurante}/produtos/{idProduto}").hasRole("GERENTE");
                    req.requestMatchers(HttpMethod.DELETE, "/restaurantes/{idRestaurante}/produtos/{idProduto}").hasRole("GERENTE");
                    req.requestMatchers(HttpMethod.GET, "/restaurantes/{idRestaurante}/produtos").hasAnyRole("GERENTE", "GARCOM");
                    req.requestMatchers(HttpMethod.GET, "/restaurantes/{idRestaurante}/produtos/{idProduto}").hasAnyRole("GERENTE", "GARCOM");

                    //Pedidos
                    req.requestMatchers(HttpMethod.POST, "/restaurantes/{idRestaurante}/pedidos").hasAnyRole("GERENTE", "GARCOM");
                    req.requestMatchers(HttpMethod.PUT, "/restaurantes/{idRestaurante}/pedidos/{idPedido}").hasAnyRole("GERENTE", "GARCOM");
                    req.requestMatchers(HttpMethod.GET, "/restaurantes/{idRestaurante}/pedidos").hasAnyRole("GERENTE", "GARCOM");
                    req.requestMatchers(HttpMethod.GET, "/restaurantes/{idRestaurante}/pedidos/{idPedido}").hasAnyRole("GERENTE", "GARCOM");
                    req.requestMatchers(HttpMethod.PATCH, "/restaurantes/{idRestaurante}/pedidos/{idPedido}/entregar").hasAnyRole("GERENTE", "GARCOM");
                    req.requestMatchers(HttpMethod.PATCH, "/restaurantes/{idRestaurante}/pedidos/{idPedido}/cancelar").hasAnyRole("GERENTE", "GARCOM");

                    //Itens
                    req.requestMatchers(HttpMethod.POST, "/restaurantes/{idRestaurante}/itens").hasAnyRole("GERENTE", "GARCOM");
                    req.requestMatchers(HttpMethod.PUT, "/restaurantes/{idRestaurante}/itens/{idItemPedido}").hasAnyRole("GERENTE", "GARCOM");
                    req.requestMatchers(HttpMethod.GET, "/restaurantes/{idRestaurante}/itens").hasAnyRole("GERENTE", "GARCOM", "COZINHA");
                    req.requestMatchers(HttpMethod.GET, "/restaurantes/{idRestaurante}/itens/{idItemPedido}").hasAnyRole("GERENTE", "GARCOM", "COZINHA");
                    req.requestMatchers(HttpMethod.PATCH, "/restaurantes/{idRestaurante}/itens/{idItemPedido}/preparar").hasAnyRole("GERENTE", "COZINHA");
                    req.requestMatchers(HttpMethod.PATCH, "/restaurantes/{idRestaurante}/itens/{idItemPedido}/marcarPronto").hasAnyRole("GERENTE", "COZINHA");
                    req.requestMatchers(HttpMethod.PATCH, "/restaurantes/{idRestaurante}/itens/{idItemPedido}/entregar").hasAnyRole("GERENTE", "GARCOM");
                    req.requestMatchers(HttpMethod.PATCH, "/restaurantes/{idRestaurante}/itens/{idItemPedido}/cancelar").hasAnyRole("GERENTE", "GARCOM");

                    req.anyRequest().authenticated();
                })
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
