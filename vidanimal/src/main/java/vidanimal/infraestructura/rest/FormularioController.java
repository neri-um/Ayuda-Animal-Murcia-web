package vidanimal.infraestructura.rest;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import vidanimal.dominio.modelo.Especie;
import vidanimal.dominio.modelo.FormularioAdopcion;
import vidanimal.infraestructura.persistencia.FormularioAdopcionRepositorio;
import vidanimal.infraestructura.rest.dto.FormularioAdopcionDTO;

@RestController
@RequestMapping("/vidanimal/formularios")
public class FormularioController {

    private final FormularioAdopcionRepositorio repositorio;
    private final ObjectMapper objectMapper;

    public FormularioController(FormularioAdopcionRepositorio repositorio, ObjectMapper objectMapper) {
        this.repositorio = repositorio;
        this.objectMapper = objectMapper;
    }

    @GetMapping
    public ResponseEntity<List<FormularioAdopcionDTO>> listar() {
        List<FormularioAdopcionDTO> resultado = repositorio.findAll().stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(resultado);
    }

    @PostMapping
    public ResponseEntity<FormularioAdopcionDTO> crear(@RequestBody FormularioAdopcionDTO dto) {
        FormularioAdopcion entidad = new FormularioAdopcion();
        entidad.setNombre(dto.getNombre());

        if (dto.getEspecie() != null && !dto.getEspecie().isBlank()) {
            try {
                entidad.setEspecie(Especie.valueOf(dto.getEspecie().toUpperCase()));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().build();
            }
        }

        entidad.setCachorro(dto.getCachorro());

        // Convertir preguntas (Object -> String JSON)
        try {
            String preguntasJson = dto.getPreguntas() instanceof String
                ? (String) dto.getPreguntas()
                : objectMapper.writeValueAsString(dto.getPreguntas());
            entidad.setPreguntas(preguntasJson);
        } catch (JsonProcessingException e) {
            return ResponseEntity.badRequest().build();
        }

        FormularioAdopcion guardado = repositorio.save(entidad);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(guardado));
    }

    private FormularioAdopcionDTO toDTO(FormularioAdopcion f) {
        FormularioAdopcionDTO dto = new FormularioAdopcionDTO();
        dto.setId(f.getId());
        dto.setNombre(f.getNombre());
        dto.setEspecie(f.getEspecie() != null ? f.getEspecie().name() : null);
        dto.setCachorro(f.getCachorro());
        // Intentar devolver preguntas como objeto JSON, si falla como string
        if (f.getPreguntas() != null) {
            try {
                dto.setPreguntas(objectMapper.readValue(f.getPreguntas(), Object.class));
            } catch (JsonProcessingException e) {
                dto.setPreguntas(f.getPreguntas());
            }
        }
        return dto;
    }
}
