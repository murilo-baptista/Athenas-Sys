package br.com.athenassys.api.config;

import br.com.athenassys.api.repository.FuncionarioRepository;
import br.com.athenassys.api.repository.RestauranteRepository;
import br.com.athenassys.api.service.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private RestauranteRepository restauranteRepository;

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        var tokenJWT = recuperarToken(request);

        if (tokenJWT != null) {
            var subject = tokenService.getSubject(tokenJWT);
            var tipo = tokenService.getTipo(tokenJWT);

            if (tipo.equals("RESTAURANTE")) {
                var restaurante = restauranteRepository.findByEmail(subject);

                restaurante.ifPresent(r -> {
                    var authentication = new UsernamePasswordAuthenticationToken(r, null, r.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                });

            } else if (tipo.equals("FUNCIONARIO")) {
                var idRestaurante = tokenService.getRestauranteId(tokenJWT);
                var funcionario = funcionarioRepository.findByNomeAndRestauranteId(subject, idRestaurante);

                funcionario.ifPresent(f -> {
                    var authentication = new UsernamePasswordAuthenticationToken(f, null, f.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                });
            }
        }
        filterChain.doFilter(request, response);
    }

    private String recuperarToken(HttpServletRequest request) {
        var authoriztionHeader = request.getHeader("Authorization");

        if (authoriztionHeader != null) {
            return authoriztionHeader.replace("Bearer ", "");
        }

        return null;
    }
}
