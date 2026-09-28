package br.com.athenassys.api.exception;

public class CnpjInexistenteException extends RuntimeException {
    public CnpjInexistenteException(String message) {
        super(message);
    }
}
