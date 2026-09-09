package br.com.athenassys.api.exception;

public class StatusInvalidoException extends RuntimeException {

    public StatusInvalidoException(String mensagem) {
        super(mensagem);
    }
}
