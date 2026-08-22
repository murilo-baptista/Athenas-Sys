package br.com.athenassys.api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

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
    public ResponseEntity tratarErro405(HttpRequestMethodNotSupportedException ex) {

        var metodo = ex.getMethod();
        var suportados = ex.getSupportedHttpMethods();

        var mensagemErro = "Requisição '" + metodo + "' não suportada para essa rota. \nMétodos suportados: " + suportados;

        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(mensagemErro);
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
