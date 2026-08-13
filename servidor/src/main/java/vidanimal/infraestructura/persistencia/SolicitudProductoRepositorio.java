package vidanimal.infraestructura.persistencia;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import vidanimal.dominio.modelo.EstadoSolicitudProducto;
import vidanimal.dominio.modelo.SolicitudProducto;

public interface SolicitudProductoRepositorio extends JpaRepository<SolicitudProducto, Long> {

    List<SolicitudProducto> findAllByOrderByFechaSolicitudDesc();

    List<SolicitudProducto> findByEstadoOrderByFechaSolicitudDesc(EstadoSolicitudProducto estado);

    List<SolicitudProducto> findByVoluntario_IdOrderByFechaSolicitudDesc(Long voluntarioId);

    List<SolicitudProducto> findByProductoIdOrderByFechaSolicitudDesc(Long productoId);
}
