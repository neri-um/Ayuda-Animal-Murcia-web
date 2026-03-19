package vidanimal.infraestructura.rest;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import vidanimal.dominio.modelo.Animal;
import vidanimal.dominio.modelo.CitaVeterinaria;
import vidanimal.dominio.puerto.entrada.AnimalServicioPuerto;
import vidanimal.infraestructura.rest.dto.AnimalNuevoDTO;
import vidanimal.infraestructura.rest.dto.CambioEstadoDTO;
import vidanimal.infraestructura.rest.dto.CitaNuevaDTO;

@RestController
@RequestMapping("/vidanimal/animales")
public class AnimalController {

    // Depende del PUERTO DE ENTRADA, no de la implementación
    private final AnimalServicioPuerto servicio;

    public AnimalController(AnimalServicioPuerto servicio) {
        this.servicio = servicio;
    }

    @GetMapping
    public ResponseEntity<List<Animal>> listar() {
        return ResponseEntity.ok(servicio.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Animal> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(servicio.obtenerPorId(id));
    }

    @PostMapping
    public ResponseEntity<Animal> crear(@RequestBody AnimalNuevoDTO dto) {
        return ResponseEntity.ok(servicio.crearAnimal(dto.toDominio()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Animal> editar(@PathVariable Long id,
                                          @RequestBody AnimalNuevoDTO dto) {
        return ResponseEntity.ok(servicio.editarAnimal(id, dto.toDominio()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        servicio.eliminarAnimal(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<Animal> cambiarEstado(@PathVariable Long id,
                                                 @RequestBody CambioEstadoDTO dto) {
        return ResponseEntity.ok(servicio.cambiarEstado(id, dto.getEstado()));
    }

    @GetMapping("/{id}/citas")
    public ResponseEntity<List<CitaVeterinaria>> listarCitas(@PathVariable Long id) {
        return ResponseEntity.ok(servicio.obtenerCitas(id));
    }

    @PostMapping("/{id}/citas")
    public ResponseEntity<CitaVeterinaria> agregarCita(@PathVariable Long id,
                                                        @RequestBody CitaNuevaDTO dto) {
        return ResponseEntity.ok(servicio.agregarCita(id, dto.toDominio()));
    }

    @GetMapping("/{id}/protocolo")
    public ResponseEntity<List<CitaVeterinaria>> verProtocolo(@PathVariable Long id) {
        return ResponseEntity.ok(servicio.obtenerProtocolo(id));
    }
}