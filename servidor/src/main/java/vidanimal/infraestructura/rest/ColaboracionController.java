package vidanimal.infraestructura.rest;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import vidanimal.aplicacion.servicio.ColaboracionService;
import vidanimal.infraestructura.rest.dto.ColaboracionDTO;

@RestController
@RequestMapping("/vidanimal/colaboracion")
public class ColaboracionController {

    private final ColaboracionService colaboracionService;

    public ColaboracionController(ColaboracionService colaboracionService) {
        this.colaboracionService = colaboracionService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> enviarSolicitud(@RequestBody ColaboracionDTO dto) {
        boolean enviado = colaboracionService.enviarSolicitud(dto);
        if (!enviado) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "No se pudo enviar la solicitud. Inténtalo de nuevo más tarde."));
        }
        return ResponseEntity.ok(Map.of("mensaje", "Solicitud enviada"));
    }
}
