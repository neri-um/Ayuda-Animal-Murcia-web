package vidanimal.infraestructura.rest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import vidanimal.dominio.modelo.Especie;
import vidanimal.dominio.modelo.Estado;
import vidanimal.dominio.modelo.Sexo;
import vidanimal.dominio.modelo.Tamanyo;

import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/vidanimal")
public class EnumsController {

    @GetMapping("/enums")
    public ResponseEntity<Map<String, Object>> getEnums() {
        return ResponseEntity.ok(Map.of(
            "especies",  Arrays.stream(Especie.values()).map(Enum::name).collect(Collectors.toList()),
            "estados",   Arrays.stream(Estado.values()).map(Enum::name).collect(Collectors.toList()),
            "sexos",     Arrays.stream(Sexo.values()).map(Enum::name).collect(Collectors.toList()),
            "tamanyes",  Arrays.stream(Tamanyo.values()).map(Enum::name).collect(Collectors.toList())
        ));
    }
}
