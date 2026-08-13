package vidanimal.aplicacion.servicio;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Service
public class ResendEmailService {

    private static final Logger LOGGER = LoggerFactory.getLogger(ResendEmailService.class);
    private static final String RESEND_URL = "https://api.resend.com/emails";

    private final RestClient restClient;
    private final String mailFrom;

    public ResendEmailService(RestClient.Builder restClientBuilder,
                              @Value("${adopcion.mail.resend-api-key:}") String apiKey,
                              @Value("${adopcion.mail.from:}") String mailFrom) {
        this.restClient = restClientBuilder
                .baseUrl(RESEND_URL)
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .build();
        this.mailFrom = mailFrom;
    }

    /**
     * Envía un correo a través de Resend. Devuelve {@code true} si se ha podido
     * enviar (o si la configuración está vacía, en cuyo caso solo se registra
     * un aviso en el log para no bloquear la operación que lo invoca).
     */
    public boolean enviar(String to, String subject, String text) {
        if (mailFrom == null || mailFrom.isBlank()) {
            LOGGER.warn("No se envía correo porque RESEND_FROM no está configurado.");
            return false;
        }
        if (to == null || to.isBlank()) {
            LOGGER.warn("No se envía correo porque la dirección de destino está vacía.");
            return false;
        }

        Map<String, String> body = Map.of(
                "from", mailFrom,
                "to", to,
                "subject", subject,
                "text", text);

        try {
            restClient.post()
                    .uri("")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .toBodilessEntity();
            return true;
        } catch (RestClientException ex) {
            LOGGER.error("No se pudo enviar el correo \"{}\" a {}. Causa: {}",
                    subject, to, ex.getMessage(), ex);
            return false;
        }
    }
}
