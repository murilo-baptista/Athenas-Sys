package br.com.athenassys.api.client;

import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Component
public class OpenCnpjClient {

    private final String ENDERECO = "https://api.opencnpj.org/";

    public int obterStatus(String endereco) {

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(endereco))
                .GET()
                .build();
        HttpResponse<String> response = null;

        try {
            response = client
                    .send(request, HttpResponse.BodyHandlers.ofString());
            return response.statusCode();

        } catch (IOException e) {
            throw new RuntimeException(e);

        } catch (InterruptedException e) {
            throw new RuntimeException(e);

        }
    }

    public boolean cnpjExiste(String cnpj) {
        var endereco = ENDERECO + cnpj;

        return obterStatus(endereco) == 200;
    }
}
