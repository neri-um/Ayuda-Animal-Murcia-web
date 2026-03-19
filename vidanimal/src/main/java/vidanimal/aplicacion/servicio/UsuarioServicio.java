package vidanimal.aplicacion.servicio;

import java.util.List;

import org.springframework.stereotype.Service;

import vidanimal.dominio.excepcion.RecursoNoEncontradoException;
import vidanimal.dominio.modelo.Usuario;
import vidanimal.dominio.puerto.entrada.UsuarioServicioPuerto;
import vidanimal.infraestructura.persistencia.UsuarioRepositorio;

@Service
public class UsuarioServicio implements UsuarioServicioPuerto {

    private final UsuarioRepositorio repositorio;

    public UsuarioServicio(UsuarioRepositorio repositorio) {
        this.repositorio = repositorio;
    }

    @Override
    public Usuario login(String email, String password) {
        Usuario usuario = repositorio.findByEmail(email)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "Usuario con email " + email + " no encontrado"));

        if (!usuario.getPassword().equals(password)) {
            throw new RuntimeException("Credenciales inválidas");
        }

        return usuario;
    }

    @Override
    public Usuario crearUsuario(Usuario usuario) {
        return repositorio.save(usuario);
    }

    @Override
    public List<Usuario> obtenerTodos() {
        return repositorio.findAll();
    }

    @Override
    public Usuario obtenerPorId(Long id) {
        return repositorio.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "Usuario con id " + id + " no encontrado"));
    }

    @Override
    public Usuario editarUsuario(Long id, Usuario datosNuevos) {
        Usuario usuario = obtenerPorId(id);

        if (datosNuevos.getNombre() != null) usuario.setNombre(datosNuevos.getNombre());
        if (datosNuevos.getApellidos() != null) usuario.setApellidos(datosNuevos.getApellidos());
        if (datosNuevos.getTelefono() != null) usuario.setTelefono(datosNuevos.getTelefono());
        if (datosNuevos.getRol() != null) usuario.setRol(datosNuevos.getRol());

        return repositorio.save(usuario);
    }

    @Override
    public void eliminarUsuario(Long id) {
        Usuario usuario = obtenerPorId(id);
        repositorio.delete(usuario);
    }
}