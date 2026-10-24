package br.com.athenassys.api.exception;

import lombok.Getter;

@Getter
public class EntidadeDesativadaException extends RuntimeException {

    private final String codigo;
    private final String entidade;
    private final Long id;

    public EntidadeDesativadaException(
            String codigo,
            String entidade,
            Long id,
            String mensagem) {

        super(mensagem);
        this.codigo = codigo;
        this.entidade = entidade;
        this.id = id;
    }
}