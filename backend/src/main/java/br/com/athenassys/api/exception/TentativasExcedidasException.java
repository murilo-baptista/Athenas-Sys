package br.com.athenassys.api.exception;

public class TentativasExcedidasException extends RuntimeException {
    public TentativasExcedidasException(String mensagem) {
        super(mensagem);
    }
}
