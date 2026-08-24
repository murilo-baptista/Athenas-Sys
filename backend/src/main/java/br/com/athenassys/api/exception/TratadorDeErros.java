package br.com.athenassys.api.exception;

import org.jspecify.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@RestControllerAdvice
public class TratadorDeErros extends ResponseEntityExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(TratadorDeErros.class);

    // Trata erro 404 para Entidades do Banco de Dados não existentes
    @ExceptionHandler(EntidadeNaoEncontradaException.class)
    public ResponseEntity<String> tratarErro404(EntidadeNaoEncontradaException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    // Trata erro 404 para erros de digitação com barras e páginas inexistentes
    @Override
    protected @Nullable ResponseEntity<Object> handleNoResourceFoundException(
            NoResourceFoundException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request) {
//        return super.handleNoResourceFoundException(ex, headers, status, request);

        var servletRequest = ((ServletWebRequest) request).getRequest();

        var ultimoCaractere = servletRequest.getRequestURI().charAt(servletRequest.getRequestURI().length() - 1);
        var caminho = "/" + ex.getResourcePath();
        var parametros = servletRequest.getQueryString();

        if (ultimoCaractere == '/') {
            var url = (parametros != null) ? caminho + "?" + parametros : caminho;
            return ResponseEntity.status(HttpStatus.PERMANENT_REDIRECT).header(HttpHeaders.LOCATION, url).build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                "404 Página Não Encontrada! \nPoxa! Não foi possível encontrar a página! \nO link pode estar quebrado, inacessível ou ter sido digitado de maneira incorreta."
        );
    }

    // Trata erro 400 para campos preenchidos incorretamente
    @Override
    protected @Nullable ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request
    ) {
//        return super.handleMethodArgumentNotValid(ex, headers, status, request);
        var erros = ex.getFieldErrors();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erros.stream().map(DadosErroValidacao::new).toList());
    }

    // Trata erro 400 para parametros (normalmente IDs) preenchidos incorretamente
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<String> tratarParametroInvalido(MethodArgumentTypeMismatchException ex) {

        var nome = ex.getName();
        var textoInvalido = ex.getValue();
        var tipo = ex.getRequiredType() != null ? ex.getRequiredType().getSimpleName() : "*não reconhecido* \nPor favor falar com o suporte.";

        var mensagem = "400 Tipo de Argumento Não Suportado!" +
                "\n" + textoInvalido + " é de um tipo não suportado!" +
                "\n" + nome + " deveria ser do tipo " + tipo;

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                mensagem
        );
    }

    // Trata erro 400 para JSON enviado de maneira incorreta
    @Override
    protected @Nullable ResponseEntity<Object> handleHttpMessageNotReadable(
            HttpMessageNotReadableException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request
    ) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                "400 JSON Inválido" +
                        "\nNão foi possível ler/converter o corpo da requisição"
        );
    }

    // Trata erro 405 para Requisições HTTP não suportadas
    @Override
    protected @Nullable ResponseEntity<Object> handleHttpRequestMethodNotSupported(
            HttpRequestMethodNotSupportedException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request) {
//        return super.handleHttpRequestMethodNotSupported(ex, headers, status, request);
        var metodo = ex.getMethod();
        var suportados = ex.getSupportedHttpMethods();

        var mensagemErro = "Requisição '" + metodo + "' não suportada para essa rota. \nMétodos suportados: " + suportados;

        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(mensagemErro);
    }

    //Trata qualquer tipo de erro para evitar vazamento de dados e informações internas
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> tratarErroNaoTratado(Exception ex) {

        logger.error("Erro: ", ex);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                "Ocorreu um erro! Por favor, contate nosso suporte."
        );
    }



    // Formata os campos inválidos do erro 400 para facilitar visualização
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
