package br.com.athenassys.api.dto;

public record DadosAtualizacaoRestaurante(
        Long id,
        String nome,
        String email,
        String telefone
) {
}
