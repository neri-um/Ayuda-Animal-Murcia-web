package vidanimal.aplicacion.servicio;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import vidanimal.infraestructura.rest.dto.ContactoDTO;

@Service
public class ContactoService {

    private static final Logger LOGGER = LoggerFactory.getLogger(ContactoService.class);

    private final ResendEmailService resendEmailService;
    private final String mailDestination;

    public ContactoService(ResendEmailService resendEmailService,
                           @Value("${adopcion.mail.destination:}") String mailDestination) {
        this.resendEmailService = resendEmailService;
        this.mailDestination = mailDestination;
    }

    /**
     * Envía por correo un mensaje del formulario de contacto.
     * Devuelve {@code true} si el mensaje se ha enviado (o si falta configuración,
     * para no bloquear la respuesta al visitante).
     */
    public boolean enviarMensaje(ContactoDTO dto) {
        if (mailDestination == null || mailDestination.isBlank()) {
            LOGGER.warn("No se envía mensaje de contacto porque EMAIL_DESTINO no está configurado.");
            return false;
        }
        if (dto == null || dto.getNombre() == null || dto.getNombre().isBlank()
                || dto.getEmail() == null || dto.getEmail().isBlank()
                || dto.getMensaje() == null || dto.getMensaje().isBlank()) {
            LOGGER.warn("No se envía mensaje de contacto porque faltan campos obligatorios.");
            return false;
        }

        String asunto = "Mensaje de contacto: " + (dto.getAsunto() != null && !dto.getAsunto().isBlank()
                ? dto.getAsunto()
                : "Sin asunto");
        String texto = "Has recibido un nuevo mensaje desde el formulario de contacto de la web.\n\n"
                + "Nombre: " + dto.getNombre() + "\n"
                + "Email: " + dto.getEmail() + "\n"
                + "Asunto: " + dto.getAsunto() + "\n\n"
                + "Mensaje:\n" + dto.getMensaje() + "\n";

        return resendEmailService.enviar(mailDestination, asunto, texto);
    }
}
