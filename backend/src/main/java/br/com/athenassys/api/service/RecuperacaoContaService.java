package br.com.athenassys.api.service;

import br.com.athenassys.api.config.LimitadorDeTentativas;
import br.com.athenassys.api.exception.CodigoInvalidoException;
import br.com.athenassys.api.model.Funcionario;
import br.com.athenassys.api.model.Restaurante;
import br.com.athenassys.api.repository.FuncionarioRepository;
import br.com.athenassys.api.repository.RestauranteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class RecuperacaoContaService {

    @Autowired
    private RestauranteRepository restauranteRepository;

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    @Autowired
    private CodigoVerificacaoService codigoService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private LimitadorDeTentativas limitador;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void solicitar(CodigoVerificacaoService.Finalidade finalidade,
                          String email, boolean exigeAtivo, String assunto) {

        var chave = "codigo:" + finalidade + ":" + email.trim().toLowerCase();
        limitador.verificar(chave);
        limitador.registrarFalha(chave);

        restauranteRepository.findByEmail(email.trim())
                .filter(r -> r.isEnabled() == exigeAtivo)
                .ifPresent(r -> {
                    var codigo = codigoService.gerar(finalidade, r.getEmail());
                    emailService.enviar(r.getEmail(), assunto,
                            "Seu código é: " + codigo + ". Ele vale por 10 minutos. "
                    + "\nSe você não solicitou nenhum código, ignore este email.");
                });
    }

    public void solicitarRecuperacao(String email) {
        solicitar(CodigoVerificacaoService.Finalidade.RECUPERAR_SENHA, email, true, "Athenas Sys - recuperação de senha");
    }

    public void solicitarReativacao(String email) {
        solicitar(CodigoVerificacaoService.Finalidade.REATIVAR, email, false, "Athenas Sys - reativação do restaurante");
    }

    public Restaurante buscar(String email) {
        return restauranteRepository.findByEmail(email.trim())
                .orElseThrow(() -> new CodigoInvalidoException("Código inválido ou expirado. Solicite um novo."));
    }

    public void confirmarRecuperacao(String email, String codigo, String novaSenha) {
        codigoService.validar(CodigoVerificacaoService.Finalidade.RECUPERAR_SENHA, email, codigo);
        var restaurante = buscar(email);
        restaurante.alterarSenha(passwordEncoder.encode(novaSenha));
    }

    public void confirmarReativacao(String email, String codigo) {
        codigoService.validar(CodigoVerificacaoService.Finalidade.REATIVAR, email, codigo);
        var restaurante = buscar(email);
        restaurante.reativar();
    }

    private Restaurante restauranteAutenticado() {
        var principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!(principal instanceof Restaurante restaurante)) {
            throw new AccessDeniedException("Apenas o restaurante autenticado pode recuperar o código de um funcionário.");
        }
        return restaurante;
    }

    private String chaveCodigo(Restaurante restaurante, Funcionario funcionario) {
        return restaurante.getId() + ":" + funcionario.getId();
    }

    public void solicitarRecuperacaoCodigo(String usuario) {
        var restaurante = restauranteAutenticado();

        var limite = "codigo:RECUPERAR_CODIGO:" + restaurante.getId() + ":" + usuario.trim().toLowerCase();
        limitador.verificar(limite);
        limitador.registrarFalha(limite);

        funcionarioRepository.findByNomeAndRestauranteId(usuario.trim(), restaurante.getId())
                        .filter(Funcionario::isEnabled)
                        .ifPresent(funcionario -> {
                            var codigo = codigoService.gerar(
                                    CodigoVerificacaoService.Finalidade.RECUPERAR_CODIGO,
                                    chaveCodigo(restaurante, funcionario));

                            emailService.enviar(restaurante.getEmail(),
                                    "Athenas Sys - redefinição de código de funcionário",
                                    "O funcionário " + funcionario.getNome() + " (" + funcionario.getCargo()
                                            + ") pediu para redefinir o código de acesso."
                                            + "\nCódigo de confirmação: " + codigo + " (vale por 10 minutos)."
                                            + "\nSe ninguém do restaurante pediu isso, ignore este e-mail");
                        });
    }

    public void confirmarRecuperacaoCodigo(String usuario, String codigo, String novoCodigo) {
        var restaurante = restauranteAutenticado();

        var funcionario = funcionarioRepository.findByNomeAndRestauranteId(usuario.trim(), restaurante.getId())
                .filter(Funcionario::isEnabled)
                .orElseThrow(() -> new CodigoInvalidoException("Codigo inválido ou expirado. Solicite um novo."));

        codigoService.validar(CodigoVerificacaoService.Finalidade.RECUPERAR_CODIGO, chaveCodigo(restaurante, funcionario), codigo);
        funcionario.alterarCodigo(passwordEncoder.encode(novoCodigo));
    }


}
