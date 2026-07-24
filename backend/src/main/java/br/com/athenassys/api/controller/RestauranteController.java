package br.com.athenassys.api.controller;

import br.com.athenassys.api.dto.DadosAtualizacaoRestaurante;
import br.com.athenassys.api.dto.DadosCadastroRestaurante;
import br.com.athenassys.api.dto.DadosListagemRestaurante;
import br.com.athenassys.api.model.Restaurante;
import br.com.athenassys.api.repository.RestauranteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("restaurantes")
@RequiredArgsConstructor
public class RestauranteController {

    private final RestauranteRepository repository;

    @PostMapping
    @Transactional
    //Devolvendo void *por enquanto*
    public void cadastrar(@RequestBody @Valid DadosCadastroRestaurante dados) {
        repository.save(new Restaurante(dados));
    }

    @GetMapping
    public Page<DadosListagemRestaurante> listar(Pageable paginacao) {
        return repository.findAllByAtivoTrue(paginacao)
                .map(DadosListagemRestaurante::new);
    }

    @PutMapping
    @Transactional
    public void atualizar(@RequestBody @Valid DadosAtualizacaoRestaurante dados) {
        var restaurante = repository.getReferenceById(dados.id());
        restaurante.atualizarDados(dados);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public void deletar(@PathVariable Long id) {
        var restaurante = repository.getReferenceById(id);
        restaurante.desativar();
    }
}
