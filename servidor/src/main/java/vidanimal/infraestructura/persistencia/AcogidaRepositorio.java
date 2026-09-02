package vidanimal.infraestructura.persistencia;

import org.springframework.data.jpa.repository.JpaRepository;
import vidanimal.dominio.modelo.Acogida;
import java.util.List;

public interface AcogidaRepositorio extends JpaRepository<Acogida, Long> {
    List<Acogida> findAllByOrderByIdAsc();
}