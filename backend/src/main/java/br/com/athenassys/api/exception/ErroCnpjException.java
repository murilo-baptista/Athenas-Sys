package br.com.athenassys.api.exception;

import org.springframework.http.HttpStatus;

public class ErroCnpjException extends RuntimeException {

    private HttpStatus status;

    public ErroCnpjException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
