package vidanimal.aplicacion.output;

import java.util.List;
import java.util.Optional;

import vidanimal.dominio.modelo.Rol;
import vidanimal.dominio.modelo.Usuario;

public interface UsuarioRepositorioPort {
	Usuario guardar(Usuario usuario);

	Optional<Usuario> buscarPorId(Long id);

	Optional<Usuario> buscarPorUsuario(String usuario);

	List<Usuario> buscarTodosOrdenados();

	List<Usuario> buscarPorRol(Rol rol);

	List<Usuario> buscarPorNombre(String nombre);

	boolean existePorUsuario(String usuario);

	void eliminar(Usuario usuario);
}