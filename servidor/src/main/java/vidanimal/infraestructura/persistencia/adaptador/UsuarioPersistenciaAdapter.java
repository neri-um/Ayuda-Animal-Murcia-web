package vidanimal.infraestructura.persistencia.adaptador;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import vidanimal.aplicacion.output.UsuarioRepositorioPort;
import vidanimal.dominio.modelo.Rol;
import vidanimal.dominio.modelo.Usuario;
import vidanimal.infraestructura.persistencia.UsuarioRepositorio;

@Repository
public class UsuarioPersistenciaAdapter implements UsuarioRepositorioPort {

    private final UsuarioRepositorio repositorio;

    public UsuarioPersistenciaAdapter(UsuarioRepositorio repositorio) {
        this.repositorio = repositorio;
    }

    @Override
    public Usuario guardar(Usuario usuario) {
        return repositorio.save(usuario);
    }

    @Override
    public Optional<Usuario> buscarPorId(Long id) {
        return repositorio.findById(id);
    }

    @Override
    public Optional<Usuario> buscarPorEmail(String email) {
        return repositorio.findByEmail(email);
    }

    @Override
    public List<Usuario> buscarTodosOrdenados() {
        return repositorio.findAllByOrderByNombre();
    }

    @Override
    public List<Usuario> buscarPorRol(Rol rol) {
        return repositorio.findByRolOrderByNombre(rol);
    }

    @Override
    public List<Usuario> buscarPorNombre(String nombre) {
        return repositorio.findByNombreContainingIgnoreCaseOrderByNombre(nombre);
    }

    @Override
    public boolean existePorEmail(String email) {
        return repositorio.existsByEmail(email);
    }

    @Override
    public void eliminar(Usuario usuario) {
        repositorio.delete(usuario);
    }
}