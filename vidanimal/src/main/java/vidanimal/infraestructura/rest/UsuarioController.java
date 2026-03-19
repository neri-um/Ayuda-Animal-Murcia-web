package vidanimal.infraestructura.rest;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import vidanimal.dominio.modelo.Usuario;
import vidanimal.dominio.puerto.entrada.UsuarioServicioPuerto;

import java.util.List;

@RestController
@RequestMapping("/vidanimal/usuarios")
public class UsuarioController {

    private final UsuarioServicioPuerto servicio;

    public UsuarioController(UsuarioServicioPuerto servicio) {
        this.servicio = servicio;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<Usuario>> listar() {
        return ResponseEntity.ok(servicio.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(servicio.obtenerPorId(id));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Usuario> crear(@RequestBody Usuario usuario) {
        return ResponseEntity.ok(servicio.crearUsuario(usuario));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'ENCARGADO')")
    public ResponseEntity<Usuario> editar(@PathVariable Long id,
                                           @RequestBody Usuario datosNuevos) {
        return ResponseEntity.ok(servicio.editarUsuario(id, datosNuevos));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        servicio.eliminarUsuario(id);
        return ResponseEntity.noContent().build();
    }
}