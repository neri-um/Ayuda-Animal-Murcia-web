package vidanimal.aplicacion.servicio;


import java.util.List;

import org.springframework.stereotype.Service;

import vidanimal.aplicacion.input.UsuariosAdminUseCase;
import vidanimal.aplicacion.output.UsuarioRepositorioPort;
import vidanimal.dominio.excepcion.RecursoNoEncontradoException;
import vidanimal.dominio.modelo.Rol;
import vidanimal.dominio.modelo.Usuario;

@Service
public class UsuariosAdminService implements UsuariosAdminUseCase {

    private final UsuarioRepositorioPort usuarioRepo;

    public UsuariosAdminService(UsuarioRepositorioPort usuarioRepo) {
        this.usuarioRepo = usuarioRepo;
    }

    @Override
    public Usuario crearUsuario(Usuario usuario) {
        if (usuario.getEmail() == null || usuario.getEmail().isBlank()) {
            throw new RuntimeException("Email obligatorio");
        }
        if (usuarioRepo.existePorEmail(usuario.getEmail())) {
            throw new RuntimeException("Ya existe un usuario con ese email");
        }
        return usuarioRepo.guardar(usuario);
    }

    @Override
    public Usuario editarUsuario(Long id, Usuario datos) {
        Usuario usuario = usuarioRepo.buscarPorId(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "Usuario con id " + id + " no encontrado"));

        if (datos.getNombre() != null) usuario.setNombre(datos.getNombre());
        if (datos.getApellidos() != null) usuario.setApellidos(datos.getApellidos());
        if (datos.getTelefono() != null) usuario.setTelefono(datos.getTelefono());
        if (datos.getRol() != null) usuario.setRol(datos.getRol());

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
}