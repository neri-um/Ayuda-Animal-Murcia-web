package vidanimal.infraestructura.rest;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import vidanimal.aplicacion.input.AdopcionUseCase;
import vidanimal.dominio.modelo.Especie;
import vidanimal.dominio.modelo.FormularioAdopcion;
import vidanimal.infraestructura.rest.dto.FormularioAdopcionDTO;

@RestController
@RequestMapping("/vidanimal/formularios")
public class FormularioController {

    private final AdopcionUseCase adopcionUseCase;
    private final ObjectMapper objectMapper;

    public FormularioController(AdopcionUseCase adopcionUseCase, ObjectMapper objectMapper) {
        this.adopcionUseCase = adopcionUseCase;
        this.objectMapper    = objectMapper;
    }

    @GetMapping
    public ResponseEntity<List<FormularioAdopcionDTO>> listar() {
        return ResponseEntity.ok(
                adopcionUseCase.listarFormularios().stream()
                        .map(this::toDTO)
                        .collect(Collectors.toList()));
    }

    @PostMapping
    public ResponseEntity<FormularioAdopcionDTO> crear(@RequestBody FormularioAdopcionDTO dto) {
        FormularioAdopcion entidad = new FormularioAdopcion();
        entidad.setNombre(dto.getNombre());
        entidad.setCachorro(dto.getCachorro());

        if (dto.getEspecie() != null && !dto.getEspecie().isBlank()) {
            try {
                entidad.setEspecie(Especie.valueOf(dto.getEspecie().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Especie inválida: " + dto.getEspecie());
            }
        }

        String preguntasJson;
        try {
            preguntasJson = dto.getPreguntas() instanceof String
                    ? (String) dto.getPreguntas()
                    : objectMapper.writeValueAsString(dto.getPreguntas());
        } catch (JsonProcessingException e) {
            preguntasJson = "[]";
        }

        FormularioAdopcion guardado = adopcionUseCase.crearFormulario(entidad, preguntasJson);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(guardado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        adopcionUseCase.eliminarFormulario(id);
        return ResponseEntity.noContent().build();
    }

    private FormularioAdopcionDTO toDTO(FormularioAdopcion f) {
        FormularioAdopcionDTO dto = new FormularioAdopcionDTO();
        dto.setId(f.getId());
        dto.setNombre(f.getNombre());
        dto.setEspecie(f.getEspecie() != null ? f.getEspecie().name() : null);
        dto.setCachorro(f.getCachorro());
        if (f.getPreguntas() != null) {
            try {
                dto.setPreguntas(objectMapper.readValue(f.getPreguntas(), Object.class));
            } catch (Exception e) {
                dto.setPreguntas(f.getPreguntas());
            }
        }
        return dto;
    }
}