package vidanimal.infraestructura.rest;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import vidanimal.aplicacion.servicio.ContactoService;
import vidanimal.infraestructura.rest.dto.ContactoDTO;

@RestController
@RequestMapping("/vidanimal/contacto")
public class ContactoController {

    private final ContactoService contactoService;

    public ContactoController(ContactoService contactoService) {
        this.contactoService = contactoService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> enviarMensaje(@RequestBody ContactoDTO dto) {
        if (dto == null || dto.getNombre() == null || dto.getNombre().isBlank()
                || dto.getEmail() == null || dto.getEmail().isBlank()
                || dto.getMensaje() == null || dto.getMensaje().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Los campos nombre, email y mensaje son obligatorios."));
        }

        boolean enviado = contactoService.enviarMensaje(dto);
        if (!enviado) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "No se pudo enviar el mensaje. Inténtalo de nuevo más tarde."));
        }
        return ResponseEntity.ok(Map.of("mensaje", "Mensaje enviado"));
    }
}
