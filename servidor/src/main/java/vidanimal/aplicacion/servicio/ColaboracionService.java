package vidanimal.aplicacion.servicio;

import java.util.LinkedHashMap;
import java.util.List;
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

    /** Orden en el que se muestran los campos del cuestionario de voluntariado. */
    private static final List<String> ETIQUETAS_VOLUNTARIADO = List.of(
            "Nombre",
            "Email",
            "Correo universitario",
            "Teléfono de contacto",
            "Edad",
            "Localidad de residencia",
            "¿Dispone de vehículo propio?",
            "Tareas de interés",
            "Comentario adicional");

    private final ResendEmailService resendEmailService;
    private final String mailDestination;
    private final String dashboardUrl;

    public ColaboracionService(ResendEmailService resendEmailService,
                               @Value("${adopcion.mail.destination:}") String mailDestination,
                               @Value("${adopcion.mail.dashboard-url:https://www.ayudaanimalmurcia.org/dashboard}") String dashboardUrl) {
        this.resendEmailService = resendEmailService;
        this.mailDestination = mailDestination;
        this.dashboardUrl = dashboardUrl;
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
        Map<String, String> respuestas = dto.getRespuestas();
        boolean esUmu = "VOLUNTARIADO_UMU".equals(tipo);
        boolean esVoluntariado = tipo.startsWith("VOLUNTARIADO");

        StringBuilder sb = new StringBuilder();
        sb.append("Se ha recibido una nueva solicitud de ").append(descripcionTipo(tipo)).append(".\n\n");
        sb.append("Tipo: ").append(tituloTipo(tipo)).append("\n\n");

        if (!esVoluntariado) {
            for (Map.Entry<String, String> entrada : respuestas.entrySet()) {
                if (entrada.getValue() == null || entrada.getValue().isBlank()) {
                    continue;
                }
                sb.append(entrada.getKey()).append(": ").append(entrada.getValue().trim()).append("\n");
            }
        } else {
            Map<String, String> pendientes = new LinkedHashMap<>(respuestas);
            for (String etiqueta : ETIQUETAS_VOLUNTARIADO) {
                if (!esUmu && "Correo universitario".equals(etiqueta)) {
                    pendientes.remove(etiqueta);
                    continue;
                }
                String valor = pendientes.remove(etiqueta);
                if (valor == null || valor.isBlank()) {
                    continue;
                }
                sb.append(etiqueta).append(": ").append(valor.trim()).append("\n");
            }

            if (!respuestas.containsKey("Email") && dto.getEmail() != null && !dto.getEmail().isBlank()) {
                sb.append("Email: ").append(dto.getEmail().trim()).append("\n");
            }
            for (Map.Entry<String, String> entrada : pendientes.entrySet()) {
                if (entrada.getValue() == null || entrada.getValue().isBlank()) {
                    continue;
                }
                sb.append(entrada.getKey()).append(": ").append(entrada.getValue().trim()).append("\n");
            }
        }

        sb.append(TextoNotificacion.cierreDashboard(dashboardUrl));

        return sb.toString();
    }

    private String tituloTipo(String tipo) {
        switch (tipo) {
            case "VOLUNTARIADO":
                return "No universitario";
            case "VOLUNTARIADO_UMU":
                return "UMU";
            case "ACOGIDA":
                return "Casa de acogida";
            default:
                return tipo;
        }
    }

    private String descripcionTipo(String tipo) {
        switch (tipo) {
            case "VOLUNTARIADO":
            case "VOLUNTARIADO_UMU":
                return "voluntariado";
            case "ACOGIDA":
                return "casa de acogida";
            default:
                return "colaboración";
        }
    }
}
