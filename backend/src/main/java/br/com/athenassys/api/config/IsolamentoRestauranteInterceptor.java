package br.com.athenassys.api.config;

import br.com.athenassys.api.model.Funcionario;
import br.com.athenassys.api.model.Restaurante;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.HandlerMapping;

import java.util.Map;

@Component
public class IsolamentoRestauranteInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserDetails)) {
            return true;
        }

        @SuppressWarnings("unchecked")
        var variaveis = (Map<String, String>) request
                .getAttribute(HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE);
        if (variaveis == null) {
            return true;
        }
        var idTexto = variaveis.get("idRestaurante");

        if (idTexto == null) {
            return true;
        }
        try {
            var idDaUrl = Long.valueOf(idTexto);

            Long idDoToken = null;
            if (auth.getPrincipal() instanceof Restaurante r) {
                idDoToken = r.getId();

            } else if (auth.getPrincipal() instanceof Funcionario f) {
                idDoToken = f.getRestaurante().getId();
            }

            if (!idDaUrl.equals(idDoToken)) {
                throw new AccessDeniedException("Restaurante diferente do autenticado!");
            }

        } catch (NumberFormatException ex) {
            return true;
        }

        return true;
    }
}
