package br.com.athenassys.api.controller;

import br.com.athenassys.api.dto.recuperacao.*;
import br.com.athenassys.api.service.RecuperacaoContaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class RecuperacaoContaController {

    @Autowired
    private RecuperacaoContaService service;

    @PostMapping("/recuperar-senha/solicitar")
    public ResponseEntity<Void> solicitarRecuperacao(@RequestBody @Valid DadosSolicitacaoCodigo dados) {

        service.solicitarRecuperacao(dados.email());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/recuperar-senha/confirmar")
    @Transactional
    public ResponseEntity<Void> confirmarRecuperacao(@RequestBody @Valid DadosConfirmacaoRecuperacao dados) {

        service.confirmarRecuperacao(dados.email(), dados.codigo(), dados.novaSenha());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/reativar-conta/solicitar")
    public ResponseEntity<Void> solicitarReativacao(@RequestBody @Valid DadosSolicitacaoCodigo dados) {

        service.solicitarReativacao(dados.email());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/reativar-conta/confirmar")
    @Transactional
    public ResponseEntity<Void> confirmarReativacao(@RequestBody @Valid DadosConfirmacaoReativacao dados) {

        service.confirmarReativacao(dados.email(), dados.codigo());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/funcionario/recuperar-codigo/solicitar")
    public ResponseEntity<Void> solicitarRecuperacaoCodigo(@RequestBody @Valid DadosSolicitacaoCodigoFuncionario dados) {

        service.solicitarRecuperacaoCodigo(dados.usuario());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/funcionario/recuperar-codigo/confirmar")
    @Transactional
    public ResponseEntity<Void> confirmarRecuperacaoCodigo(@RequestBody @Valid DadosConfirmacaoCodigoFuncionario dados) {

        service.confirmarRecuperacaoCodigo(dados.usuario(), dados.codigo(), dados.novoCodigo());
        return ResponseEntity.noContent().build();
    }
}
