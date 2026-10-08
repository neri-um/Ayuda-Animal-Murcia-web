package vidanimal.aplicacion.servicio;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import vidanimal.infraestructura.rest.dto.ColaboracionDTO;

/**
 * Envía por correo (Resend) las solicitudes de colaboración recibidas desde
 * la página pública "Colaborar": voluntariado, voluntariado UMU y casa de
 * acogida. Sigue el mismo patrón que {@link ContactoService}.
 */
@Service
public class ColaboracionService {

    private static final Logger LOGGER = LoggerFactory.getLogger(ColaboracionService.class);

    private final ResendEmailService resendEmailService;
    private final String mailDestination;

    public ColaboracionService(ResendEmailService resendEmailService,
                               @Value("${adopcion.mail.destination:}") String mailDestination) {
        this.resendEmailService = resendEmailService;
        this.mailDestination = mailDestination;
    }

    /**
     * Envía la solicitud por correo. Devuelve {@code true} si se ha enviado
     * (o si falta configuración, para no bloquear la respuesta al visitante).
     */
    public boolean enviarSolicitud(ColaboracionDTO dto) {
        if (mailDestination == null || mailDestination.isBlank()) {
            LOGGER.warn("No se envía solicitud de colaboración porque EMAIL_DESTINO no está configurado.");
            return false;
        }
        if (dto == null || dto.getEmail() == null || dto.getEmail().isBlank()
                || dto.getRespuestas() == null || dto.getRespuestas().isEmpty()) {
            LOGGER.warn("No se envía solicitud de colaboración porque faltan campos obligatorios.");
            return false;
        }

        String tipo = dto.getTipo() != null ? dto.getTipo().toUpperCase() : "";
        String asunto = asuntoSegunTipo(tipo);
        String texto = construirContenido(dto, tipo);

        return resendEmailService.enviar(mailDestination, asunto, texto);
    }

    private String asuntoSegunTipo(String tipo) {
        switch (tipo) {
            case "VOLUNTARIADO":
                return "Nueva solicitud de voluntariado";
            case "VOLUNTARIADO_UMU":
                return "Nueva solicitud de voluntariado (UMU)";
            case "ACOGIDA":
                return "Nueva solicitud de casa de acogida";
            default:
                return "Nueva solicitud de colaboración";
        }
    }

    private String construirContenido(ColaboracionDTO dto, String tipo) {
        StringBuilder sb = new StringBuilder();
        sb.append("Se ha recibido una nueva solicitud de colaboración.\n\n");
        sb.append("Tipo: ").append(tipo).append("\n");
        sb.append("Email del solicitante: ").append(dto.getEmail()).append("\n\n");

        for (Map.Entry<String, String> entrada : dto.getRespuestas().entrySet()) {
            sb.append(entrada.getKey()).append(": ").append(entrada.getValue()).append("\n");
        }

        return sb.toString();
    }
}
