package vidanimal.infraestructura.rest;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import vidanimal.aplicacion.input.AnimalesUseCase;
import vidanimal.dominio.modelo.Animal;
import vidanimal.dominio.modelo.CitaVeterinaria;
import vidanimal.dominio.modelo.Especie;
import vidanimal.dominio.modelo.Estado;
import vidanimal.dominio.modelo.Sexo;
import vidanimal.dominio.modelo.Tamanyo;
import vidanimal.infraestructura.rest.dto.AnimalEditarDTO;
import vidanimal.infraestructura.rest.dto.AnimalNuevoDTO;
import vidanimal.infraestructura.rest.dto.CambioEstadoDTO;
import vidanimal.infraestructura.rest.dto.CitaNuevaDTO;

@RestController
@RequestMapping("/vidanimal/animales")
public class AnimalController {

    private final AnimalesUseCase animales;

    public AnimalController(AnimalesUseCase animales) {
        this.animales = animales;
    }

    @GetMapping
    public ResponseEntity<List<Animal>> listar(
            @RequestParam(required = false) Especie especie,
            @RequestParam(required = false) Estado estado,
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) Tamanyo tamanyo,
            @RequestParam(required = false) Sexo sexo) {

        return ResponseEntity.ok(animales.listar(especie, estado, nombre, tamanyo, sexo));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Animal> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(animales.obtenerPorId(id));
    }

    @PostMapping
    public ResponseEntity<Animal> crear(@RequestBody AnimalNuevoDTO dto) {
        return ResponseEntity.ok(animales.crear(dto.toDominio()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Animal> editar(@PathVariable Long id, @RequestBody AnimalEditarDTO dto) {
        return ResponseEntity.ok(animales.editar(id, dto.toDominio()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        animales.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<Animal> cambiarEstado(@PathVariable Long id, @RequestBody CambioEstadoDTO dto) {
        return ResponseEntity.ok(animales.cambiarEstado(id, dto.getEstado()));
    }

    @PostMapping("/{id}/citas")
    public ResponseEntity<CitaVeterinaria> agregarCita(@PathVariable Long id, @RequestBody CitaNuevaDTO dto) {
        return ResponseEntity.ok(animales.agregarCita(id, dto.toDominio()));
    }

    @GetMapping("/{id}/citas")
    public ResponseEntity<List<CitaVeterinaria>> listarCitas(@PathVariable Long id) {
        return ResponseEntity.ok(animales.listarCitas(id));
    }
}