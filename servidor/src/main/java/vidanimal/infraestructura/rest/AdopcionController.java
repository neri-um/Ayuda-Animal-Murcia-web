package vidanimal.infraestructura.rest;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import vidanimal.aplicacion.input.AdopcionUseCase;
import vidanimal.dominio.modelo.FormularioAdopcion;
import vidanimal.dominio.modelo.SolicitudAdopcion;
import vidanimal.infraestructura.rest.dto.CambioAnimalAdopcionDTO;
import vidanimal.infraestructura.rest.dto.CambioEstadoAdopcionDTO;
import vidanimal.infraestructura.rest.dto.FormularioAdopcionDTO;
import vidanimal.infraestructura.rest.dto.SolicitudAdopcionDTO;
import vidanimal.infraestructura.rest.dto.SolicitudAdopcionRespuestaDTO;

@RestController
@RequestMapping("/vidanimal/adopciones")
public class AdopcionController {

    private final AdopcionUseCase adopcionUseCase;
    private final ObjectMapper objectMapper;

    public AdopcionController(AdopcionUseCase adopcionUseCase, ObjectMapper objectMapper) {
        this.adopcionUseCase = adopcionUseCase;
        this.objectMapper    = objectMapper;
    }

    @GetMapping("/formulario/{animalId}")
    public ResponseEntity<FormularioAdopcionDTO> getFormulario(@PathVariable Long animalId) {
        FormularioAdopcion f = adopcionUseCase.obtenerFormularioPorAnimal(animalId);
        return ResponseEntity.ok(toFormularioDTO(f));
    }

    @PostMapping
    public ResponseEntity<SolicitudAdopcionRespuestaDTO> crearSolicitud(
            @RequestBody SolicitudAdopcionDTO dto) {
        SolicitudAdopcion solicitud = new SolicitudAdopcion();
        solicitud.setNombreAdoptante(dto.getNombreAdoptante());
        solicitud.setEmail(dto.getEmail());
        solicitud.setTelefono(dto.getTelefono());
        solicitud.setDni(dto.getDni());

        String respuestasJson;
        try {
            respuestasJson = objectMapper.writeValueAsString(dto.getRespuestas());
        } catch (JsonProcessingException e) {
            respuestasJson = "{}";
        }

        SolicitudAdopcion resultado = adopcionUseCase.crearSolicitud(
                solicitud, dto.getAnimalId(), respuestasJson);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(resultado));
    }

    @GetMapping
    public ResponseEntity<List<SolicitudAdopcionRespuestaDTO>> listar() {
        return ResponseEntity.ok(
                adopcionUseCase.listarSolicitudes().stream()
                        .map(this::toResponseDTO)
                        .collect(Collectors.toList()));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<SolicitudAdopcionRespuestaDTO> cambiarEstado(
            @PathVariable Long id,
            @RequestBody CambioEstadoAdopcionDTO dto) {
        return ResponseEntity.ok(
                toResponseDTO(adopcionUseCase.cambiarEstado(id, dto.getEstado())));
    }

    @PatchMapping("/{id}/animal")
    public ResponseEntity<SolicitudAdopcionRespuestaDTO> reubicarSolicitud(
            @PathVariable Long id,
            @RequestBody CambioAnimalAdopcionDTO dto) {
        return ResponseEntity.ok(
                toResponseDTO(adopcionUseCase.reubicarSolicitud(id, dto.getAnimalId())));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarSolicitud(@PathVariable Long id) {
        adopcionUseCase.eliminarSolicitud(id);
        return ResponseEntity.noContent().build();
    }

    private FormularioAdopcionDTO toFormularioDTO(FormularioAdopcion f) {
        FormularioAdopcionDTO dto = new FormularioAdopcionDTO();
        dto.setId(f.getId());
        dto.setNombre(f.getNombre());
        dto.setEspecie(f.getEspecie() != null ? f.getEspecie().name() : null);
        dto.setCachorro(f.getCachorro());
        if (f.getPreguntas() != null) {
            try {
                dto.setPreguntas(objectMapper.readValue(f.getPreguntas(), Object.class));
            } catch (Exception e) {
                dto.setPreguntas(List.of());
            }
        }
        return dto;
    }

    @SuppressWarnings("unchecked")
    private SolicitudAdopcionRespuestaDTO toResponseDTO(SolicitudAdopcion s) {
        SolicitudAdopcionRespuestaDTO dto = new SolicitudAdopcionRespuestaDTO();
        dto.setId(s.getId());
        dto.setAnimalId(s.getAnimalId());
        if (s.getAnimal() != null) dto.setAnimalNombre(s.getAnimal().getNombre());
        dto.setNombreAdoptante(s.getNombreAdoptante());
        dto.setEmail(s.getEmail());
        dto.setTelefono(s.getTelefono());
        dto.setDni(s.getDni());
        dto.setFechaSolicitud(s.getFechaSolicitud());
        dto.setEstado(s.getEstado());
        try {
            dto.setRespuestas(objectMapper.readValue(s.getRespuestas(), Map.class));
        } catch (Exception e) {
            dto.setRespuestas(Map.of());
        }
        return dto;
    }
}