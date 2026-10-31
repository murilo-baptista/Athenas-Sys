package br.com.athenassys.api.config;

import br.com.athenassys.api.exception.TentativasExcedidasException;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class LimitadorDeTentativas {

    private final int MAXIMO_FALHAS = 5;
    private final Duration JANELA = Duration.ofMinutes(15);

    private record Registro(int falhas, Instant inicio) {}

    private final Map<String, Registro> registros = new ConcurrentHashMap<>();

    public void verificar(String chave) {
        var registro = registros.get(chave);
        if (registro == null) {
            return;
        }
        if (registro.inicio().plus(JANELA).isBefore(Instant.now())) {
            registros.remove(chave);
            return;
        }
        if (registro.falhas() >= MAXIMO_FALHAS) {
            throw new TentativasExcedidasException("Muitas tentativas. Tente novamente em alguns minutos.");
        }
    }

    public void registrarFalha(String chave) {
        registros.compute(chave, (key, atual) -> {
            if (atual == null || atual.inicio().plus(JANELA).isBefore(Instant.now())) {
                return new Registro(1, Instant.now());
            }
            return new Registro(atual.falhas() + 1, atual.inicio());
        });
    }

    public void limpar(String chave) {
        registros.remove(chave);
    }
}