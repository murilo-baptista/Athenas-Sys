package br.com.athenassys.api.service;

import br.com.athenassys.api.exception.CodigoInvalidoException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class CodigoVerificacaoService {

    public enum Finalidade { RECUPERAR_SENHA, RECUPERAR_CODIGO, REATIVAR }

    private final int MAXIMO_TENTATIVAS = 5;
    private final Duration VALIDADE = Duration.ofMinutes(10);

    private record Codigo(String hash, Instant expiraEm, int tentativas) {}

    private final Map<String, Codigo> codigos = new ConcurrentHashMap<>();
    private final SecureRandom random = new SecureRandom();

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String chave(Finalidade finalidade, String email) {
        return finalidade + ":" + email.trim().toLowerCase();
    }

    public String gerar(Finalidade finalidade, String email) {
        var codigo = String.format("%06d", random.nextInt(1_000_000));

        codigos.put(chave(finalidade, email),
            new Codigo(passwordEncoder.encode(codigo), Instant.now().plus(VALIDADE), 0));
        return codigo;
    }

    public synchronized void validar(Finalidade finalidade, String email, String digitado) {
        var chave = chave(finalidade, email);
        var atual = codigos.get(chave);

        if (atual == null || atual.expiraEm.isBefore(Instant.now())) {
            codigos.remove(chave);
            throw new CodigoInvalidoException("Código inválido ou expirado. Solicite um novo.");
        }
        if (!passwordEncoder.matches(digitado, atual.hash())) {
            var tentativas = atual.tentativas() + 1;
            if (tentativas >= MAXIMO_TENTATIVAS) {
                codigos.remove(chave);
                throw new CodigoInvalidoException("Muitas tentativas. Solicite um código novo.");
            }
            codigos.put(chave, new Codigo(atual.hash(), atual.expiraEm(), tentativas));
            throw new CodigoInvalidoException("Código incorreto");
        }
        codigos.remove(chave);
    }
}
