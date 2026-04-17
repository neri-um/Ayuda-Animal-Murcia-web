package vidanimal.infraestructura.rest;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import vidanimal.aplicacion.servicio.AdopcionService;
import vidanimal.infraestructura.rest.dto.CambioEstadoAdopcionDTO;
import vidanimal.infraestructura.rest.dto.FormularioAdopcionDTO;
import vidanimal.infraestructura.rest.dto.SolicitudAdopcionDTO;
import vidanimal.infraestructura.rest.dto.SolicitudAdopcionRespuestaDTO;

@RestController
@RequestMapping("/vidanimal/adopciones")
public class AdopcionController {

    private final AdopcionService adopcionService;

    public AdopcionController(AdopcionService adopcionService) {
        this.adopcionService = adopcionService;
    }

    @GetMapping("/formulario/{animalId}")
    public ResponseEntity<FormularioAdopcionDTO> getFormulario(@PathVariable Long animalId) {
        return ResponseEntity.ok(adopcionService.getFormularioPorAnimal(animalId));
    }

    @PostMapping
    public ResponseEntity<SolicitudAdopcionRespuestaDTO> crearSolicitud(
            @RequestBody SolicitudAdopcionDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(adopcionService.crearSolicitud(dto));
    }

    @GetMapping
    public ResponseEntity<List<SolicitudAdopcionRespuestaDTO>> listar() {
        return ResponseEntity.ok(adopcionService.listarSolicitudes());
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<SolicitudAdopcionRespuestaDTO> cambiarEstado(
            @PathVariable Long id,
            @RequestBody CambioEstadoAdopcionDTO dto) {
        return ResponseEntity.ok(adopcionService.cambiarEstado(id, dto.getEstado()));
    }
}