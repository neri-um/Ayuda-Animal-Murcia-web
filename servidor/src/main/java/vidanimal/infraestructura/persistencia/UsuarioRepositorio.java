package vidanimal.infraestructura.persistencia;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import vidanimal.dominio.modelo.Rol;
import vidanimal.dominio.modelo.Usuario;

public interface UsuarioRepositorio extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);

    List<Usuario> findAllByOrderByNombre();

    List<Usuario> findByRolOrderByNombre(Rol rol);

    List<Usuario> findByNombreContainingIgnoreCaseOrderByNombre(String nombre);

    boolean existsByEmail(String email);
}