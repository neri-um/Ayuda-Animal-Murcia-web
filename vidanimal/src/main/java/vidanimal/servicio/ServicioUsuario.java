package vidanimal.servicio;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vidanimal.modelo.Rol;
import vidanimal.modelo.Usuario;
import vidanimal.repositorio.UsuarioRepository;

@Service
public class ServicioUsuario implements IServicioUsuario {

    @Autowired
    private UsuarioRepository repositorio;

    // CU-05: Iniciar sesión
    @Override
    public Usuario login(String email, String password) {
        if (email == null || email.isBlank())
            throw new IllegalArgumentException("El email no puede ser vacío");
        if (password == null || password.isBlank())
            throw new IllegalArgumentException("La contraseña no puede ser vacía");

        Usuario usuario = repositorio.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("Credenciales incorrectas"));

        // TODO: comparar con hash (BCrypt) cuando se implemente seguridad
        if (!usuario.getPassword().equals(password))
            throw new IllegalArgumentException("Credenciales incorrectas");

        return usuario;
    }

    // CU-23: Crear cuenta de usuario
    @Override
    public Usuario crearUsuario(String email, String password, String nombre,
                                String apellidos, String telefono, Rol rol) {
        if (email == null || email.isBlank())
            throw new IllegalArgumentException("El email no puede ser vacío");
        if (password == null || password.isBlank())
            throw new IllegalArgumentException("La contraseña no puede ser vacía");
        if (nombre == null || nombre.isBlank())
            throw new IllegalArgumentException("El nombre no puede ser vacío");
        if (rol == null)
            throw new IllegalArgumentException("El rol no puede ser nulo");

        if (repositorio.existsByEmail(email))
            throw new IllegalArgumentException("Ya existe un usuario con ese email");

        Usuario usuario = new Usuario(email, password, nombre, apellidos, telefono, rol);
        usuario.setFechaAlta(LocalDate.now());

        return repositorio.save(usuario);
    }

    // CU-24: Editar cuenta de usuario
    @Override
    public Usuario editarUsuario(Long id, String nombre, String apellidos,
                                 String telefono, Rol rol) {
        Usuario usuario = getUsuario(id);

        if (nombre != null && !nombre.isBlank()) usuario.setNombre(nombre);
        if (apellidos != null) usuario.setApellidos(apellidos);
        if (telefono != null) usuario.setTelefono(telefono);
        if (rol != null) usuario.setRol(rol);

        return repositorio.save(usuario);
    }

    // CU-25: Eliminar cuenta de usuario
    @Override
    public void eliminarUsuario(Long id) {
        Usuario usuario = getUsuario(id);
        repositorio.delete(usuario);
    }

    @Override
    public Usuario getUsuario(Long id) {
        return repositorio.findById(id)
            .orElseThrow(() -> new EntityNotFoundException(
                "No existe usuario con id: " + id));
    }

    @Override
    public List<Usuario> getUsuarios() {
        return repositorio.findAll();
    }
}