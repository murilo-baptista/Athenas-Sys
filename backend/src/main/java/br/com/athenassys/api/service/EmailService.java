package br.com.athenassys.api.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${api.email.remetente}")
    private String remetente;

    @Value("${api.email.simulado}")
    private boolean simulado;

    public void enviar(String para, String assunto, String texto) {

        if (simulado) {
            log.warn("[EMAIL SIMULADO] para={} | {} | {}", para, assunto, texto);
            return;
        }
        try {
            var mensagem = new SimpleMailMessage();

            mensagem.setFrom(remetente);
            mensagem.setTo(para);
            mensagem.setSubject(assunto);
            mensagem.setText(texto);

            mailSender.send(mensagem);

        } catch (MailException ex) {
            log.error("Falha ao enviar email para {}", para, ex);
        }
    }
}
