package br.com.athenassys.api.service;

import br.com.athenassys.api.model.Funcionario;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

    @Value("${api.security.token.secret}")
    private String secret;

    public String gerarTokenRestaurante(UserDetails restaurante) {
        try {
            var algoritimo = Algorithm.HMAC256(secret);

            return JWT.create()
                    .withIssuer("API Athenas Sys")
                    .withSubject(restaurante.getUsername())
                    .withClaim("tipo", "RESTAURANTE")
                    .withExpiresAt(dataExpiracao())
                    .sign(algoritimo);

        } catch (JWTCreationException exception){
            throw new RuntimeException("erro ao gerar token JWT ", exception);
        }
    }

    public String gerarTokenFuncionario(Funcionario funcionario) {
        try {
            var algoritimo = Algorithm.HMAC256(secret);

            return JWT.create()
                    .withIssuer("API Athenas Sys")
                    .withSubject(funcionario.getUsername())
                    .withClaim("tipo", "FUNCIONARIO")
                    .withClaim("idRestaurante", funcionario.getRestaurante().getId())
                    .withExpiresAt(dataExpiracao())
                    .sign(algoritimo);

        } catch (JWTCreationException exception){
            throw new RuntimeException("erro ao gerar token JWT ", exception);
        }
    }

    public String getSubject(String tokenJWT) {
        try {
            var algoritimo = Algorithm.HMAC256(secret);

            return JWT.require(algoritimo)
                    .withIssuer("API Athenas Sys")
                    .build()
                    .verify(tokenJWT)
                    .getSubject();

        } catch (JWTVerificationException exception){
            throw new RuntimeException("Token JWT inválido ou expirado!");
        }
    }

    public String getTipo(String tokenJWT) {
        try {
            var algoritimo = Algorithm.HMAC256(secret);

            return JWT.require(algoritimo)
                    .withIssuer("API Athenas Sys")
                    .build()
                    .verify(tokenJWT)
                    .getClaim("tipo")
                    .asString();

        } catch (JWTVerificationException exception) {
            throw new RuntimeException("Token JWT inválido ou expirado!");
        }
    }

    public Long getRestauranteId(String tokenJWT) {
        try {
            var algoritimo = Algorithm.HMAC256(secret);

            return JWT.require(algoritimo)
                    .withIssuer("API Athenas Sys")
                    .build()
                    .verify(tokenJWT)
                    .getClaim("idRestaurante")
                    .asLong();

        } catch (JWTVerificationException exception) {
            throw new RuntimeException("Token JWT inválido ou expirado!");
        }
    }

    private Instant dataExpiracao() {
        return LocalDateTime.now()
                .plusHours(2)
                .toInstant(ZoneOffset.of("-03:00"));
    }

}
