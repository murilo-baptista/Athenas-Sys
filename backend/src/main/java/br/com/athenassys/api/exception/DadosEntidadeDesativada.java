package br.com.athenassys.api.exception;

public record DadosEntidadeDesativada(

        String codigo,
        String entidade,
        Long id,
        String mensagem
) {
}