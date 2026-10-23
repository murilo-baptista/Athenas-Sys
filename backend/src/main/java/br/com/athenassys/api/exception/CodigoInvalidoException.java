package br.com.athenassys.api.exception;

public class CodigoInvalidoException extends RuntimeException {
    public CodigoInvalidoException(String mensagem) {
        super(mensagem);
    }
}
