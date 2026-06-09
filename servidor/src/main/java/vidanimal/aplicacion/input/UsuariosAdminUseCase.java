package vidanimal.aplicacion.input;

import java.util.List;

import vidanimal.dominio.modelo.Rol;
import vidanimal.dominio.modelo.Usuario;

public interface UsuariosAdminUseCase {

    // CU-23
    Usuario crearUsuario(Usuario usuario);

    // (para endpoint /usuarios/{id})
    Usuario obtenerPorId(Long id);

    // CU-24
    Usuario editarUsuario(Long id, Usuario datos);

    // CU-25
    void eliminarUsuario(Long id);

    List<Usuario> listarUsuarios(Rol rol, String nombre);

    // Activar/desactivar usuario
    Usuario cambiarActivo(Long id, boolean activo);
}
