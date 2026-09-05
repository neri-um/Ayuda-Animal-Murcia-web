package vidanimal.infraestructura.rest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import vidanimal.dominio.modelo.Especie;
import vidanimal.dominio.modelo.Estado;
import vidanimal.dominio.modelo.Rol;
import vidanimal.dominio.modelo.Sexo;
import vidanimal.dominio.modelo.Tamanyo;
import vidanimal.dominio.modelo.CategoriaProducto;
import vidanimal.dominio.modelo.EstadoSolicitudCuestionario;
import vidanimal.dominio.modelo.EstadoSolicitudProducto;
import vidanimal.dominio.protocolo.*;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/vidanimal")
public class EnumsController {

    @GetMapping("/enums")
    public ResponseEntity<Map<String, Object>> getEnums() {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("especies",                 Arrays.stream(Especie.values()).map(Enum::name).collect(Collectors.toList()));
        data.put("estados",                  Arrays.stream(Estado.values()).map(Enum::name).collect(Collectors.toList()));
        data.put("sexos",                    Arrays.stream(Sexo.values()).map(Enum::name).collect(Collectors.toList()));
        data.put("tamanyes",                 Arrays.stream(Tamanyo.values()).map(Enum::name).collect(Collectors.toList()));
        data.put("categoriasProducto",       Arrays.stream(CategoriaProducto.values()).map(Enum::name).collect(Collectors.toList()));
        data.put("estadosSolicitudAdopcion", Arrays.stream(EstadoSolicitudCuestionario.values()).map(Enum::name).collect(Collectors.toList()));
        data.put("estadosSolicitudProducto", Arrays.stream(EstadoSolicitudProducto.values()).map(Enum::name).collect(Collectors.toList()));
        data.put("roles",                    Arrays.stream(Rol.values()).map(Enum::name).collect(Collectors.toList()));
        return ResponseEntity.ok(data);
    }

    /**
     * Devuelve el protocolo veterinario base para una especie.
     *
     * Acepta dos formas de indicar la edad:
     *   1. ?fechaNacimiento=YYYY-MM-DD  → el backend calcula si es cachorro (< 12 meses)
     *   2. ?tipo=cachorro|adulto        → forma legacy, se mantiene por compatibilidad
     *
     * Reglas:
     *   - GATO:  mismo protocolo adulto y cachorro (ProtocoloGato)
     *   - PERRO: ProtocoloPerroCachorro si < 12 meses, ProtocoloPerroAdulto si >= 12 meses
     *   - Resto: lista vacía
     */
    @GetMapping("/enums/protocolo/{especie}")
    public ResponseEntity<?> getProtocolo(
            @PathVariable String especie,
            @RequestParam(required = false) String fechaNacimiento,
            @RequestParam(defaultValue = "adulto") String tipo) {

        // Si llega fechaNacimiento, el backend decide si es cachorro
        if (fechaNacimiento != null && !fechaNacimiento.isBlank()) {
            try {
                LocalDate nacimiento = LocalDate.parse(fechaNacimiento);
                long meses = ChronoUnit.MONTHS.between(nacimiento, LocalDate.now());
                tipo = meses < 12 ? "cachorro" : "adulto";
            } catch (Exception ignored) {
                // fecha malformada → mantener el valor de ?tipo
            }
        }

        IProtocoloVeterinario protocolo = switch (especie.toUpperCase()) {
            case "GATO"  -> new ProtocoloGato();   // mismo protocolo para adulto y cachorro
            case "PERRO" -> tipo.equalsIgnoreCase("cachorro")
                                ? new ProtocoloPerroCachorro()
                                : new ProtocoloPerroAdulto();
            default      -> null;
        };

        if (protocolo == null) {
            return ResponseEntity.ok(Map.of("base", List.of()));
        }

        List<Map<String, String>> base = protocolo.getProtocolo().stream()
            .map(cita -> {
                Map<String, String> item = new LinkedHashMap<>();
                item.put("tratamiento", cita.getTratamiento().name());
                item.put("descripcion", cita.getDescripcion());
                return item;
            })
            .collect(Collectors.toList());

        return ResponseEntity.ok(Map.of("base", base));
    }
}
