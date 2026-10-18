package br.com.athenassys.api.exception;

public class EntidadeDesativadaException extends RuntimeException {

    public EntidadeDesativadaException(String mensagem) {
        super(mensagem);
    }
}
