package br.com.athenassys.api.controller;

import br.com.athenassys.api.dto.DadosAtualizacaoRestaurante;
import br.com.athenassys.api.dto.DadosCadastroRestaurante;
import br.com.athenassys.api.dto.DadosDetalhamentoRestaurante;
import br.com.athenassys.api.dto.DadosListagemRestaurante;
import br.com.athenassys.api.model.Restaurante;
import br.com.athenassys.api.repository.RestauranteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("restaurantes")
@RequiredArgsConstructor
public class RestauranteController {

    private final RestauranteRepository repository;

    @PostMapping
    @Transactional
    public ResponseEntity cadastrar(@RequestBody @Valid DadosCadastroRestaurante dados, UriComponentsBuilder uriBuilder) {
        var restaurante = new Restaurante(dados);
        repository.save(restaurante);

        var uri = uriBuilder.path("restaurantes/{id}").buildAndExpand(restaurante.getId()).toUri();

        return ResponseEntity.created(uri).body(new DadosDetalhamentoRestaurante(restaurante));
    }

    @GetMapping
    public ResponseEntity<Page<DadosListagemRestaurante>> listar(Pageable paginacao) {
        var page = repository.findAllByAtivoTrue(paginacao)
                .map(DadosListagemRestaurante::new);
        return ResponseEntity.ok(page);
    }

    @PutMapping
    @Transactional
    public ResponseEntity atualizar(@RequestBody @Valid DadosAtualizacaoRestaurante dados) {
        var restaurante = repository.getReferenceById(dados.id());
        restaurante.atualizarDados(dados);

        return ResponseEntity.ok(new DadosDetalhamentoRestaurante(restaurante));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity deletar(@PathVariable Long id) {
        var restaurante = repository.getReferenceById(id);
        restaurante.desativar();

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity detalhar(@PathVariable Long id) {
        var restaurante = repository.getReferenceById(id);

        return ResponseEntity.ok(new DadosDetalhamentoRestaurante(restaurante));
    }
}
