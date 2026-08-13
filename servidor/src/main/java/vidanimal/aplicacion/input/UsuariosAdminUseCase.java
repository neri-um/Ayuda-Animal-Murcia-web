package vidanimal.aplicacion.input;

import java.util.List;

import vidanimal.dominio.modelo.Rol;
import vidanimal.dominio.modelo.Usuario;

public interface UsuariosAdminUseCase {

    Usuario crearUsuario(Usuario usuario);

    // (para endpoint /usuarios/{id})
    Usuario obtenerPorId(Long id);

    Usuario editarUsuario(Long id, Usuario datos);

    void eliminarUsuario(Long id);

    List<Usuario> listarUsuarios(Rol rol, String nombre);

    Usuario cambiarActivo(Long id, boolean activo);
}
