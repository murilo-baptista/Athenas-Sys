package br.com.athenassys.api.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.List;

@RestControllerAdvice
public class TratadorDeErros {

    // Trata erro 404 para Entidades do Banco de Dados não existentes
    @ExceptionHandler(EntidadeNaoEncontradaException.class)
    public ResponseEntity<String> tratarErro404(EntidadeNaoEncontradaException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    // Trata erro 400 para campos preenchidos incorretamente
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<List<DadosErroValidacao>> tratarErro400(MethodArgumentNotValidException ex) {

        var erros = ex.getFieldErrors();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erros.stream().map(DadosErroValidacao::new).toList());
    }

    // Trata erro 405 para Requisições HTTP não suportadas
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<String> tratarErro405(HttpRequestMethodNotSupportedException ex) {

        var metodo = ex.getMethod();
        var suportados = ex.getSupportedHttpMethods();

        var mensagemErro = "Requisição '" + metodo + "' não suportada para essa rota. \nMétodos suportados: " + suportados;

        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(mensagemErro);
    }

    // Trata erro 404 para erros de digitação com barras
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<String> tratarErroDigitacao(NoResourceFoundException ex, HttpServletRequest request) {

        var ultimoCaractere = request.getRequestURI().charAt(request.getRequestURI().length() - 1);
        var caminho = "/" + ex.getResourcePath();
        var parametros = request.getQueryString();

        if (ultimoCaractere == '/') {
            var url = (parametros != null) ? caminho + "?" + parametros : caminho;
            return ResponseEntity.status(308).header(HttpHeaders.LOCATION, url).build();
        }
        return ResponseEntity.status(404).body(
                "404 Página Não Encontrada! \nPoxa! Não foi possível encotrar a página! \nO link pode estar quebrado, inacessível ou ter sido digitado de maneira incorreta."
        );
    }

    // Transforma a mensagem de erro do 405 para facilitar visualização
    record DadosErroValidacao(
            String campo,
            String mensagem
    ) {
        public DadosErroValidacao(FieldError erro) {
            this(
                    erro.getField(),
                    erro.getDefaultMessage()
            );
        }
    }
}
