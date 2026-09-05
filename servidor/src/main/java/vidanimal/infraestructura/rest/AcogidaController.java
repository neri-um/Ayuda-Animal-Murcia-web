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

import vidanimal.aplicacion.input.AcogidaUseCase;
import vidanimal.dominio.modelo.Acogida;
import vidanimal.dominio.modelo.Especie;
import vidanimal.dominio.modelo.SolicitudAcogida;
import vidanimal.infraestructura.rest.dto.AcogidaDTO;
import vidanimal.infraestructura.rest.dto.AcogidaRespuestaDTO;
import vidanimal.infraestructura.rest.dto.CambioAnimalAcogidaDTO;
import vidanimal.infraestructura.rest.dto.CambioEstadoAcogidaDTO;
import vidanimal.infraestructura.rest.dto.CambioEstadoSolicitudAcogidaDTO;
import vidanimal.infraestructura.rest.dto.SolicitudAcogidaDTO;
import vidanimal.infraestructura.rest.dto.SolicitudAcogidaRespuestaDTO;

@RestController
@RequestMapping("/vidanimal/acogidas")
public class AcogidaController {

    private final AcogidaUseCase acogidaUseCase;
    private final ObjectMapper objectMapper;

    public AcogidaController(AcogidaUseCase acogidaUseCase, ObjectMapper objectMapper) {
        this.acogidaUseCase = acogidaUseCase;
        this.objectMapper   = objectMapper;
    }

    @PostMapping
    public ResponseEntity<AcogidaRespuestaDTO> crearAcogida(@RequestBody AcogidaDTO dto) {
        Especie especie = resolverEspecie(dto);

        String respuestasJson;
        try {
            respuestasJson = objectMapper.writeValueAsString(dto.getRespuestas());
        } catch (JsonProcessingException e) {
            respuestasJson = "{}";
        }

        Acogida resultado = acogidaUseCase.crearAcogidaConSolicitud(
                dto.getNombre(), dto.getApellidos(), dto.getTelefono(), dto.getEmail(),
                dto.getDireccion(), especie, respuestasJson);
        return ResponseEntity.status(HttpStatus.CREATED).body(toAcogidaResponseDTO(resultado));
    }

    private Especie resolverEspecie(AcogidaDTO dto) {
        if (dto.getEspecie() != null && !dto.getEspecie().isBlank()) {
            try {
                return Especie.valueOf(dto.getEspecie().toUpperCase());
            } catch (Exception ignored) {
                // se ignora y se intenta derivar de las respuestas
            }
        }
        Especie derivada = derivarDeRespuestas(dto.getRespuestas());
        if (derivada != null) return derivada;
        return Especie.PERRO;
    }

    // Deriva la especie de la casa de acogida a partir de la respuesta "qué tipo de animal quiere acoger".
    private Especie derivarDeRespuestas(Map<String, String> respuestas) {
        if (respuestas == null) return null;
        // Busca en cualquier clave que hable de "tipo de animal" o "tipo de acogida"
        for (Map.Entry<String, String> e : respuestas.entrySet()) {
            String k = e.getKey().toLowerCase();
            if (k.contains("tipo") && (k.contains("animal") || k.contains("acog")) && e.getValue() != null) {
                String v = e.getValue().trim().toLowerCase();
                if (v.contains("gato")) return Especie.GATO;
                if (v.contains("perro")) return Especie.PERRO;
                if (v.contains("conejo")) return Especie.CONEJO;
                if (v.contains("roedor")) return Especie.ROEDOR;
            }
        }
        return null;
    }

    private Especie derivarEspecieDeRespuestas(Map<String, String> respuestas) {
        Especie derivada = derivarDeRespuestas(respuestas);
        return derivada != null ? derivada : Especie.PERRO;
    }

    // Extrae la dirección de las respuestas si existe (clave "domicilio").
    private String extraerDireccion(Map<String, String> respuestas) {
        if (respuestas == null) return null;
        for (Map.Entry<String, String> e : respuestas.entrySet()) {
            if (e.getKey().equalsIgnoreCase("domicilio")) {
                return e.getValue();
            }
        }
        return null;
    }

    @GetMapping
    public ResponseEntity<List<AcogidaRespuestaDTO>> listarAcogidas() {
        return ResponseEntity.ok(
                acogidaUseCase.listarAcogidas().stream()
                        .map(this::toAcogidaResponseDTO)
                        .collect(Collectors.toList()));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<AcogidaRespuestaDTO> cambiarEstadoAcogida(
            @PathVariable Long id,
            @RequestBody CambioEstadoAcogidaDTO dto) {
        return ResponseEntity.ok(
                toAcogidaResponseDTO(acogidaUseCase.cambiarEstadoAcogida(id, dto.getEstado())));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarAcogida(@PathVariable Long id) {
        acogidaUseCase.eliminarAcogida(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/solicitudes")
    public ResponseEntity<SolicitudAcogidaRespuestaDTO> crearSolicitud(
            @RequestBody SolicitudAcogidaDTO dto) {
        SolicitudAcogida solicitud = new SolicitudAcogida();
        solicitud.setNombreAcogida(dto.getNombreAcogida());
        solicitud.setEmail(dto.getEmail());
        solicitud.setTelefono(dto.getTelefono());
        solicitud.setDni(dto.getDni());

        String respuestasJson;
        try {
            respuestasJson = objectMapper.writeValueAsString(dto.getRespuestas());
        } catch (JsonProcessingException e) {
            respuestasJson = "{}";
        }

        // La especie de la casa de acogida se deriva de la respuesta "tipo animal a acoger"
        Especie especie = derivarEspecieDeRespuestas(dto.getRespuestas());
        String direccion = extraerDireccion(dto.getRespuestas());

        SolicitudAcogida resultado = acogidaUseCase.crearSolicitudSolo(
                solicitud, dto.getAnimalId(), respuestasJson, especie, direccion);
        return ResponseEntity.status(HttpStatus.CREATED).body(toSolicitudResponseDTO(resultado));
    }

    @GetMapping("/solicitudes")
    public ResponseEntity<List<SolicitudAcogidaRespuestaDTO>> listarSolicitudes() {
        return ResponseEntity.ok(
                acogidaUseCase.listarSolicitudes().stream()
                        .map(this::toSolicitudResponseDTO)
                        .collect(Collectors.toList()));
    }

    @PatchMapping("/solicitudes/{id}/estado")
    public ResponseEntity<SolicitudAcogidaRespuestaDTO> cambiarEstadoSolicitud(
            @PathVariable Long id,
            @RequestBody CambioEstadoSolicitudAcogidaDTO dto) {
        return ResponseEntity.ok(
                toSolicitudResponseDTO(acogidaUseCase.cambiarEstadoSolicitud(id, dto.getEstado())));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/solicitudes/{id}")
    public ResponseEntity<Void> eliminarSolicitud(@PathVariable Long id) {
        acogidaUseCase.eliminarSolicitud(id);
        return ResponseEntity.noContent().build();
    }
        @PatchMapping("/solicitudes/{id}/animal")
    public ResponseEntity<SolicitudAcogidaRespuestaDTO> reubicarSolicitud(
            @PathVariable Long id,
            @RequestBody CambioAnimalAcogidaDTO dto) {
        return ResponseEntity.ok(
                toSolicitudResponseDTO(acogidaUseCase.reubicarSolicitud(id, dto.getAnimalId())));
    }

    @SuppressWarnings("unchecked")
    private AcogidaRespuestaDTO toAcogidaResponseDTO(Acogida a) {
        AcogidaRespuestaDTO dto = new AcogidaRespuestaDTO();
        dto.setId(a.getId());
        dto.setNombre(a.getNombre());
        dto.setApellidos(a.getApellidos());
        dto.setTelefono(a.getTelefono());
        dto.setEmail(a.getEmail());
        dto.setDireccion(a.getDireccion());
        dto.setEspecie(a.getEspecie());
        dto.setEstado(a.getEstado());
        if (a.getSolicitud() != null) {
            dto.setSolicitudId(a.getSolicitud().getId());
            dto.setSolicitudEstado(a.getSolicitud().getEstado());
            if (a.getSolicitud().getAnimalId() != null) {
                dto.setAnimalId(a.getSolicitud().getAnimalId());
            }
            if (a.getSolicitud().getAnimal() != null) {
                dto.setAnimalNombre(a.getSolicitud().getAnimal().getNombre());
            }
            if (a.getSolicitud().getRespuestas() != null) {
                try {
                    dto.setRespuestas(objectMapper.readValue(a.getSolicitud().getRespuestas(), Map.class));
                } catch (Exception e) {
                    dto.setRespuestas(Map.of());
                }
            }
        }
        return dto;
    }

    @SuppressWarnings("unchecked")
    private SolicitudAcogidaRespuestaDTO toSolicitudResponseDTO(SolicitudAcogida s) {
        SolicitudAcogidaRespuestaDTO dto = new SolicitudAcogidaRespuestaDTO();
        dto.setId(s.getId());
        dto.setAnimalId(s.getAnimalId());
        if (s.getAnimal() != null) dto.setAnimalNombre(s.getAnimal().getNombre());
        dto.setNombreAcogida(s.getNombreAcogida());
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