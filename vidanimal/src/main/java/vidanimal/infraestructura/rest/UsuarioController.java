package vidanimal.infraestructura.rest;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import vidanimal.aplicacion.input.UsuariosAdminUseCase;
import vidanimal.dominio.modelo.Rol;
import vidanimal.dominio.modelo.Usuario;
import vidanimal.infraestructura.rest.dto.UsuarioEditarDTO;
import vidanimal.infraestructura.rest.dto.UsuarioNuevoDTO;

@RestController
@RequestMapping("/vidanimal/usuarios")
public class UsuarioController {

    private final UsuariosAdminUseCase usuariosAdmin;

    public UsuarioController(UsuariosAdminUseCase usuariosAdmin) {
        this.usuariosAdmin = usuariosAdmin;
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> listar(
            @RequestParam(required = false) Rol rol,
            @RequestParam(required = false) String nombre) {
        return ResponseEntity.ok(usuariosAdmin.listarUsuarios(rol, nombre));
    }

    @PostMapping
    public ResponseEntity<Usuario> crear(@RequestBody UsuarioNuevoDTO dto) {
        return ResponseEntity.ok(usuariosAdmin.crearUsuario(dto.toDominio()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> editar(@PathVariable Long id, @RequestBody UsuarioEditarDTO dto) {
        return ResponseEntity.ok(usuariosAdmin.editarUsuario(id, dto.toDominio()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        usuariosAdmin.eliminarUsuario(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(usuariosAdmin.obtenerPorId(id));
    }
}