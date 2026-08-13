package vidanimal.aplicacion.servicio;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import vidanimal.dominio.modelo.SolicitudAdopcion;

@Service
public class NotificacionSolicitudAdopcionService {

    private static final Logger LOGGER = LoggerFactory.getLogger(NotificacionSolicitudAdopcionService.class);

    private final ResendEmailService resendEmailService;
    private final String mailDestination;
    private final String dashboardUrl;

    public NotificacionSolicitudAdopcionService(ResendEmailService resendEmailService,
                                                @Value("${adopcion.mail.destination:}") String mailDestination,
                                                @Value("${adopcion.mail.dashboard-url:}") String dashboardUrl) {
        this.resendEmailService = resendEmailService;
        this.mailDestination = mailDestination;
        this.dashboardUrl = dashboardUrl;
    }

    @Async("emailExecutor")
    public void enviarNuevaSolicitud(SolicitudAdopcion solicitud) {
        if (mailDestination == null || mailDestination.isBlank()) {
            LOGGER.warn("No se envía notificación de adopción porque EMAIL_DESTINO no está configurado.");
            return;
        }

        String nombreAnimal;
        if (solicitud.getAnimal() != null && solicitud.getAnimal().getNombre() != null
                && !solicitud.getAnimal().getNombre().isBlank()) {
            nombreAnimal = solicitud.getAnimal().getNombre();
        } else if (solicitud.getAnimalId() != null) {
            nombreAnimal = "Animal " + solicitud.getAnimalId();
        } else {
            nombreAnimal = "Animal";
        }

        String asunto = "Nueva solicitud de adopción: " + nombreAnimal;
        String texto = construirContenidoCorreo(solicitud, nombreAnimal);

        resendEmailService.enviar(mailDestination, asunto, texto);
    }

    private String construirContenidoCorreo(SolicitudAdopcion solicitud, String nombreAnimal) {
        StringBuilder sb = new StringBuilder();
        sb.append("Se ha recibido una nueva solicitud de adopción.\n\n");
        sb.append("Animal: ").append(nombreAnimal).append("\n");
        sb.append("Nombre: ").append(solicitud.getNombreAdoptante()).append("\n");
        sb.append("Email: ").append(solicitud.getEmail()).append("\n");
        sb.append("Teléfono: ").append(solicitud.getTelefono()).append("\n");
        sb.append("DNI/NIE: ").append(solicitud.getDni()).append("\n");

        if (dashboardUrl != null && !dashboardUrl.isBlank()) {
            sb.append("\nEntra al Dashboard para leer el formulario completo y descargarlo:\n");
            sb.append(dashboardUrl).append("\n");
        }

        return sb.toString();
    }
}
