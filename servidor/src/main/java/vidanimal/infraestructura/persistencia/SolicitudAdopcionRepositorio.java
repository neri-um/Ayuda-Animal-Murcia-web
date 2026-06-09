package vidanimal.infraestructura.persistencia;

import org.springframework.data.jpa.repository.JpaRepository;
import vidanimal.dominio.modelo.SolicitudAdopcion;
import java.util.List;

public interface SolicitudAdopcionRepositorio extends JpaRepository<SolicitudAdopcion, Long> {
    List<SolicitudAdopcion> findAllByOrderByFechaSolicitudDesc();
}