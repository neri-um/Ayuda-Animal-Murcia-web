package vidanimal.repositorio;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import vidanimal.modelo.EstadoSolicitudProducto;
import vidanimal.modelo.SolicitudProducto;

public interface SolicitudProductoRepository extends JpaRepository<SolicitudProducto, Long> {

    List<SolicitudProducto> findByVoluntarioIdOrderByFechaSolicitudDesc(Long voluntarioId);

    List<SolicitudProducto> findByEstadoOrderByFechaSolicitudDesc(EstadoSolicitudProducto estado);

    List<SolicitudProducto> findByEstadoInOrderByFechaSolicitudDesc(List<EstadoSolicitudProducto> estados);

    List<SolicitudProducto> findByVoluntarioIdAndEstadoIn(Long voluntarioId, List<EstadoSolicitudProducto> estados);
}