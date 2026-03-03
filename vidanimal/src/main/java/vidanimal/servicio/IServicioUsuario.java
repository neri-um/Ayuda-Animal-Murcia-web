package vidanimal.servicio;

import java.util.List;

import vidanimal.modelo.Rol;
import vidanimal.modelo.Usuario;

public interface IServicioUsuario {

    Usuario login(String email, String password);               // CU-05

    Usuario crearUsuario(String email, String password,
                         String nombre, String apellidos,
                         String telefono, Rol rol);             // CU-23

    Usuario editarUsuario(Long id, String nombre,
                          String apellidos, String telefono,
                          Rol rol);                             // CU-24

    void eliminarUsuario(Long id);                              // CU-25

    Usuario getUsuario(Long id);

    List<Usuario> getUsuarios();
}