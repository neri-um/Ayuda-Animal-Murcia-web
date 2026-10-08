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

import vidanimal.aplicacion.input.SolicitudVoluntariadoUseCase;
import vidanimal.dominio.modelo.SolicitudVoluntariado;
import vidanimal.infraestructura.rest.dto.ColaboracionDTO;
import vidanimal.infraestructura.rest.dto.CrauDTO;
import vidanimal.infraestructura.rest.dto.DecisionSolicitudVoluntariadoDTO;
import vidanimal.infraestructura.rest.dto.SolicitudVoluntariadoRespuestaDTO;

/**
 * Solicitudes de colaboración (voluntariado, voluntariado UMU y casa de
 * acogida). El POST es público (llega desde la web); el resto está reservado
 * al personal del dashboard.
 */
@RestController
@RequestMapping("/vidanimal/colaboracion")
public class ColaboracionController {

    private final SolicitudVoluntariadoUseCase solicitudUseCase;
    private final ObjectMapper objectMapper;

    public ColaboracionController(SolicitudVoluntariadoUseCase solicitudUseCase,
                                  ObjectMapper objectMapper) {
        this.solicitudUseCase = solicitudUseCase;
        this.objectMapper = objectMapper;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> registrarSolicitud(@RequestBody ColaboracionDTO dto) {
        String respuestasJson;
        try {
            respuestasJson = objectMapper.writeValueAsString(dto.getRespuestas());
        } catch (JsonProcessingException e) {
            respuestasJson = "{}";
        }

        SolicitudVoluntariado guardada = solicitudUseCase.registrar(dto, respuestasJson);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("mensaje", "Solicitud enviada", "id", guardada.getId()));
    }

    @GetMapping
    public ResponseEntity<List<SolicitudVoluntariadoRespuestaDTO>> listar() {
        return ResponseEntity.ok(
                solicitudUseCase.listar().stream()
                        .map(this::toDTO)
                        .collect(Collectors.toList()));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<SolicitudVoluntariadoRespuestaDTO> cambiarEstado(
            @PathVariable Long id,
            @RequestBody DecisionSolicitudVoluntariadoDTO dto) {
        return ResponseEntity.ok(
                toDTO(solicitudUseCase.cambiarEstado(id, dto.getEstado(), dto.getMensaje())));
    }

    @PatchMapping("/{id}/crau")
    public ResponseEntity<SolicitudVoluntariadoRespuestaDTO> actualizarCrau(
            @PathVariable Long id,
            @RequestBody CrauDTO dto) {
        String crauDetalleJson;
        try {
            crauDetalleJson = objectMapper.writeValueAsString(
                    dto.getCrauDetalle() != null ? dto.getCrauDetalle() : Map.of());
        } catch (JsonProcessingException e) {
            crauDetalleJson = "{}";
        }
        return ResponseEntity.ok(
                toDTO(solicitudUseCase.actualizarCrau(id, dto.getCrau(), crauDetalleJson)));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        solicitudUseCase.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @SuppressWarnings("unchecked")
    private SolicitudVoluntariadoRespuestaDTO toDTO(SolicitudVoluntariado s) {
        SolicitudVoluntariadoRespuestaDTO dto = new SolicitudVoluntariadoRespuestaDTO();
        dto.setId(s.getId());
        dto.setTipo(s.getTipo() != null ? s.getTipo().name() : null);
        dto.setEmail(s.getEmail());
        dto.setNombre(s.getNombre());
        dto.setFechaSolicitud(s.getFecha());
        dto.setFechaDecision(s.getFechaDecision());
        dto.setEstado(s.getEstado());
        dto.setMensajeRespuesta(s.getMensajeRespuesta());
        dto.setCrau(s.getCrau());
        if (s.getCrauDetalle() != null && !s.getCrauDetalle().isBlank()) {
            try {
                dto.setCrauDetalle(objectMapper.readValue(s.getCrauDetalle(), Map.class));
            } catch (Exception e) {
                dto.setCrauDetalle(Map.of());
            }
        }
        try {
            dto.setRespuestas(objectMapper.readValue(s.getRespuestas(), Map.class));
        } catch (Exception e) {
            dto.setRespuestas(Map.of());
        }
        return dto;
    }
}