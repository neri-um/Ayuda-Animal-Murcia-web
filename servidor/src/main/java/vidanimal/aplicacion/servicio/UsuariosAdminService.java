package vidanimal.aplicacion.servicio;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import vidanimal.aplicacion.input.UsuariosAdminUseCase;
import vidanimal.aplicacion.output.UsuarioRepositorioPort;
import vidanimal.dominio.excepcion.RecursoNoEncontradoException;
import vidanimal.dominio.modelo.Rol;
import vidanimal.dominio.modelo.Usuario;

@Service
public class UsuariosAdminService implements UsuariosAdminUseCase {

    private final UsuarioRepositorioPort usuarioRepo;
    private final PasswordEncoder passwordEncoder;

    public UsuariosAdminService(UsuarioRepositorioPort usuarioRepo, PasswordEncoder passwordEncoder) {
        this.usuarioRepo = usuarioRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Usuario crearUsuario(Usuario usuario) {
        if (usuario.getUsuario() == null || usuario.getUsuario().isBlank()) {
            throw new RuntimeException("Usuario obligatorio");
        }
        if (usuarioRepo.existePorUsuario(usuario.getUsuario())) {
            throw new RuntimeException("Ese usuario ya está en uso");
        }
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        return usuarioRepo.guardar(usuario);
    }

    @Override
    public Usuario editarUsuario(Long id, Usuario datos) {
        Usuario usuario = usuarioRepo.buscarPorId(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "Usuario con id " + id + " no encontrado"));

        if (datos.getUsuario() != null && !datos.getUsuario().isBlank()) {
            if (usuarioRepo.existePorUsuario(datos.getUsuario()) &&
                !String.valueOf(usuario.getId()).equals(String.valueOf(
                    usuarioRepo.buscarPorUsuario(datos.getUsuario())
                        .map(u -> u.getId()).orElse(null)))) {
                throw new RuntimeException("Ese usuario ya está en uso");
            }
            usuario.setUsuario(datos.getUsuario());
        }
        if (datos.getNombre() != null)    usuario.setNombre(datos.getNombre());
        if (datos.getUsuario() != null)    usuario.setUsuario(datos.getUsuario());
        if (datos.getApellidos() != null) usuario.setApellidos(datos.getApellidos());
        if (datos.getTelefono() != null)  usuario.setTelefono(datos.getTelefono());
        if (datos.getRol() != null)       usuario.setRol(datos.getRol());

        return usuarioRepo.guardar(usuario);
    }

    @Override
    public Usuario cambiarActivo(Long id, boolean activo) {
        Usuario usuario = usuarioRepo.buscarPorId(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "Usuario con id " + id + " no encontrado"));
        usuario.setActivo(activo);
        return usuarioRepo.guardar(usuario);
    }

    @Override
    public void eliminarUsuario(Long id) {
        Usuario usuario = usuarioRepo.buscarPorId(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "Usuario con id " + id + " no encontrado"));
        usuarioRepo.eliminar(usuario);
    }

    @Override
    public List<Usuario> listarUsuarios(Rol rol, String nombre) {
        if (rol != null) return usuarioRepo.buscarPorRol(rol);
        if (nombre != null && !nombre.isBlank()) return usuarioRepo.buscarPorNombre(nombre);
        return usuarioRepo.buscarTodosOrdenados();
    }

    @Override
    public Usuario obtenerPorId(Long id) {
        return usuarioRepo.buscarPorId(id)
            .orElseThrow(() -> new RecursoNoEncontradoException(
                    "Usuario con id " + id + " no encontrado"));
    }
}