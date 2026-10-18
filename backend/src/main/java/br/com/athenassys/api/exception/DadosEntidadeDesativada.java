package br.com.athenassys.api.exception;

public record DadosEntidadeDesativada(

        String codigo,
        String entidade,
        Long id,
        String mensagem
) {
    public DadosEntidadeDesativada {
        codigo = "ENTIDADE_DESATIVADA";
    }
}
/*
* O seguinte código ficará na linha 141 do TratadorDeErros, foi deixado aqui para evitar conflito entre
* as duas branches do backend atualmente ativas
*
    @ExceptionHandler(EntidadeDesativadaException.class)
    public ResponseEntity<DadosEntidadeDesativada> tratarErroEntidadeDesativada(EntidadeDesativadaException ex) {

        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }
* */