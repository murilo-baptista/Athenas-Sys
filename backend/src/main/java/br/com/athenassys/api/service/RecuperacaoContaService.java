package br.com.athenassys.api.service;

import br.com.athenassys.api.config.LimitadorDeTentativas;
import br.com.athenassys.api.exception.CodigoInvalidoException;
import br.com.athenassys.api.model.Restaurante;
import br.com.athenassys.api.repository.RestauranteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class RecuperacaoContaService {

    @Autowired
    private RestauranteRepository restauranteRepository;

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
}
