package vidanimal.infraestructura.persistencia;

import org.springframework.data.jpa.repository.JpaRepository;
import vidanimal.dominio.modelo.SolicitudAcogida;
import java.util.List;

public interface SolicitudAcogidaRepositorio extends JpaRepository<SolicitudAcogida, Long> {
    List<SolicitudAcogida> findAllByOrderByFechaSolicitudDesc();
}