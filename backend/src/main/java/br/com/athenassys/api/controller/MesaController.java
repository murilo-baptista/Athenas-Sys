package br.com.athenassys.api.controller;

import br.com.athenassys.api.dto.DadosCadastroMesa;
import br.com.athenassys.api.model.Mesa;
import br.com.athenassys.api.repository.MesaRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("mesas")
@RequiredArgsConstructor
public class MesaController {

    private final MesaRepository repository;

    @PostMapping
    @Transactional
    //Devolvendo void *por enquanto*
    public void cadastrar(@RequestBody @Valid DadosCadastroMesa dados) {

    }
}
