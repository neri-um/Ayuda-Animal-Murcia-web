package vidanimal.aplicacion.servicio;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import vidanimal.dominio.modelo.TipoCuestionario;

@Service
public class NotificacionService {

    private static final Logger LOGGER = LoggerFactory.getLogger(NotificacionService.class);

    private final ResendEmailService resendEmailService;
    private final String mailDestination;
    private final String dashboardAdopcionUrl;
    private final String dashboardAcogidaUrl;

    public NotificacionService(ResendEmailService resendEmailService,
                                                @Value("${adopcion.mail.destination:}") String mailDestination,
                                                @Value("${adopcion.mail.dashboard-url:https://www.ayudaanimalmurcia.org/dashboard/adopciones}") String dashboardAdopcionUrl,
                                                @Value("${acogida.mail.dashboard-url:https://www.ayudaanimalmurcia.org/dashboard/acogidas}") String dashboardAcogidaUrl) {
        this.resendEmailService = resendEmailService;
        this.mailDestination = mailDestination;
        this.dashboardAdopcionUrl = dashboardAdopcionUrl;
        this.dashboardAcogidaUrl = dashboardAcogidaUrl;
    }

    @Async("emailExecutor")
    public void enviarNuevaSolicitud(TipoCuestionario tipo, String nombreAnimal,
            String nombreSolicitante, String email, String telefono, String dni) {
        if (mailDestination == null || mailDestination.isBlank()) {
            LOGGER.warn("No se envía notificación de {} porque EMAIL_DESTINO no está configurado.",
                    etiqueta(tipo));
            return;
        }

        boolean esAcogida = tipo == TipoCuestionario.ACOGIDA;
        boolean conAnimal = nombreAnimal != null && !nombreAnimal.isBlank();

        String asunto;
        if (esAcogida) {
            asunto = conAnimal
                    ? "Nueva solicitud de acogida: " + nombreAnimal
                    : "Nueva solicitud de casa de acogida";
        } else {
            asunto = "Nueva solicitud de adopción: " + (conAnimal ? nombreAnimal : "Animal");
        }

        String texto = construirContenidoCorreo(esAcogida, conAnimal ? nombreAnimal : null,
                nombreSolicitante, email, telefono, dni);

        resendEmailService.enviar(mailDestination, asunto, texto);
    }

    private String etiqueta(TipoCuestionario tipo) {
        return tipo == TipoCuestionario.ACOGIDA ? "acogida" : "adopción";
    }

    private String construirContenidoCorreo(boolean esAcogida, String nombreAnimal,
            String nombreSolicitante, String email, String telefono, String dni) {
        StringBuilder sb = new StringBuilder();
        sb.append("Se ha recibido una nueva solicitud de ").append(esAcogida ? "acogida" : "adopción").append(".\n\n");
        if (nombreAnimal != null && !nombreAnimal.isBlank()) {
            sb.append("Animal: ").append(nombreAnimal).append("\n");
        }
        sb.append("Nombre: ").append(nombreSolicitante != null ? nombreSolicitante : "").append("\n");
        sb.append("Email: ").append(email != null ? email : "").append("\n");
        sb.append("Teléfono: ").append(telefono != null ? telefono : "").append("\n");
        if (dni != null && !dni.isBlank()) {
            sb.append("DNI/NIE: ").append(dni).append("\n");
        }

        String dashboardUrl = esAcogida ? dashboardAcogidaUrl : dashboardAdopcionUrl;
        if (dashboardUrl != null && !dashboardUrl.isBlank()) {
            sb.append("\nEntra al Dashboard para leer el formulario completo y descargarlo:\n");
            sb.append(dashboardUrl).append("\n");
        }

        return sb.toString();
    }
}