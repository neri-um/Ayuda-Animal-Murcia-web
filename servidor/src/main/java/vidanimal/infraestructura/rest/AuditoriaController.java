package vidanimal.infraestructura.rest;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import vidanimal.aplicacion.servicio.AuditoriaService;
import vidanimal.dominio.modelo.RegistroAuditoria;

@RestController
@RequestMapping("/vidanimal/auditoria")
public class AuditoriaController {

    private final AuditoriaService auditoriaService;

    public AuditoriaController(AuditoriaService auditoriaService) {
        this.auditoriaService = auditoriaService;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<RegistroAuditoria>> listar(
            @RequestParam(required = false) String seccion,
            @RequestParam(required = false) Long usuarioId,
            @RequestParam(required = false)
                @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) String desde,
            @RequestParam(required = false)
                @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) String hasta) {

        LocalDateTime desdeFecha = parseFecha(desde);
        LocalDateTime hastaFecha = parseFecha(hasta);

        // Al fijar hasta en 23:59:59.999999 del día indicado
        if (hastaFecha != null && hasta.endsWith("T00:00"))
            hastaFecha = hastaFecha.plusDays(1).minusNanos(1);

        return ResponseEntity.ok(
                auditoriaService.listar(seccion, usuarioId, desdeFecha, hastaFecha));
    }

    private LocalDateTime parseFecha(String valor) {
        if (valor == null || valor.isBlank()) return null;
        try {
            return LocalDateTime.parse(valor);
        } catch (DateTimeParseException e) {
            return null;
        }
    }
}