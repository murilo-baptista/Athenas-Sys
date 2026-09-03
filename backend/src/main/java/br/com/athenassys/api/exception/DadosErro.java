package br.com.athenassys.api.exception;

import org.springframework.validation.FieldError;

// Formata erros para facilitar visualização
public record DadosErro(
        String campo,
        String mensagem
) {
    public DadosErro(FieldError erro) {
        this(
                erro.getField(),
                erro.getDefaultMessage()
        );
    }
}
