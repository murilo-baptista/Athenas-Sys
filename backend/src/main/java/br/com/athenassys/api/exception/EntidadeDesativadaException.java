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
/*
* O seguinte código ficará na linha 141 do TratadorDeErros, foi deixado aqui para evitar conflito entre
* as duas branches do backend atualmente ativas
*
    @ExceptionHandler(EntidadeDesativadaException.class)
    public ResponseEntity<DadosEntidadeDesativada> tratarErroEntidadeDesativada(EntidadeDesativadaException ex) {

        var corpo = new DadosEntidadeDesativada(ex.getCodigo(), ex.getEntidade(), ex.getId(), ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(corpo);
    }
* */