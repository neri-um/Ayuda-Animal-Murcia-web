package vidanimal.infraestructura.rest;

import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vidanimal.aplicacion.output.ConfiguracionRepositorioPort;

@RestController
@RequestMapping("/vidanimal/configuracion")
public class ConfiguracionController {

    private static final String CLAVE_ANIMAL_MES = "animal_del_mes_id";

    private final ConfiguracionRepositorioPort configuracion;

    public ConfiguracionController(ConfiguracionRepositorioPort configuracion) {
        this.configuracion = configuracion;
    }

    /**
     * GET /vidanimal/configuracion/animal-del-mes
     * Público — lo necesita el Home sin login.
     * Devuelve: { "animalId": "42" } o { "animalId": null }
     */
    @GetMapping("/animal-del-mes")
    public ResponseEntity<Map<String, String>> obtenerAnimalDelMes() {
        String id = configuracion.obtenerValor(CLAVE_ANIMAL_MES).orElse(null);
        return ResponseEntity.ok(Map.of("animalId", id != null ? id : ""));
    }

    /**
     * PUT /vidanimal/configuracion/animal-del-mes
     * Solo ADMIN o ENCARGADO.
     * Body: { "animalId": "42" }  — enviar "" o null para quitar.
     */
    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/animal-del-mes")
    public ResponseEntity<Map<String, String>> fijarAnimalDelMes(@RequestBody Map<String, String> body) {
        String id = body.get("animalId");
        if (id == null || id.isBlank()) {
            configuracion.eliminarClave(CLAVE_ANIMAL_MES);
            return ResponseEntity.ok(Map.of("animalId", ""));
        }
        configuracion.guardarValor(CLAVE_ANIMAL_MES, id.trim());
        return ResponseEntity.ok(Map.of("animalId", id.trim()));
    }

    /**
     * DELETE /vidanimal/configuracion/animal-del-mes
     * Alternativa REST semántica para quitar el animal del mes.
     */
    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/animal-del-mes")
    public ResponseEntity<Void> quitarAnimalDelMes() {
        configuracion.eliminarClave(CLAVE_ANIMAL_MES);
        return ResponseEntity.noContent().build();
    }
}
