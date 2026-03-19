package vidanimal.dominio.puerto.entrada;

import vidanimal.dominio.modelo.Usuario;
import java.util.List;

public interface UsuarioServicioPuerto {

    // CU-05: Login
    Usuario login(String email, String password);

    // CU-23: Crear usuario
    Usuario crearUsuario(Usuario usuario);

    // Listar usuarios
    List<Usuario> obtenerTodos();

    // Obtener usuario por ID
    Usuario obtenerPorId(Long id);

    // CU-24: Editar usuario
    Usuario editarUsuario(Long id, Usuario datosNuevos);

    // CU-25: Eliminar usuario
    void eliminarUsuario(Long id);
}