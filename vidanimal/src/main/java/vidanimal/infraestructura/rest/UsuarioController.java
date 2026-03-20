package vidanimal.infraestructura.rest;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import vidanimal.aplicacion.input.AnimalesUseCase;
import vidanimal.aplicacion.input.UsuariosAdminUseCase;
import vidanimal.dominio.modelo.Animal;
import vidanimal.dominio.modelo.Rol;
import vidanimal.dominio.modelo.Usuario;
import vidanimal.infraestructura.rest.dto.DtoParsers;
import vidanimal.infraestructura.rest.dto.UsuarioEditarDTO;
import vidanimal.infraestructura.rest.dto.UsuarioNuevoDTO;

@RestController
@RequestMapping("/vidanimal/usuarios")
public class UsuarioController {

    private final UsuariosAdminUseCase usuariosAdmin;
    private final AnimalesUseCase animales;

    public UsuarioController(UsuariosAdminUseCase usuariosAdmin, AnimalesUseCase animales) {
        this.usuariosAdmin = usuariosAdmin;
        this.animales = animales;
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> listar(
            @RequestParam(required = false) String rol,
            @RequestParam(required = false) String nombre) {

        return ResponseEntity.ok(
                usuariosAdmin.listarUsuarios(DtoParsers.parseEnum(Rol.class, rol, "rol"), nombre)
        );
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(usuariosAdmin.obtenerPorId(id));
    }

    @GetMapping("/{id}/animales")
    public ResponseEntity<List<Animal>> listarAnimalesDeUsuario(@PathVariable Long id) {
        return ResponseEntity.ok(animales.listarPorResponsable(id));
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
    	


}