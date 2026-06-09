package vidanimal.infraestructura.persistencia;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import vidanimal.dominio.modelo.AsignacionProducto;

public interface AsignacionProductoRepositorio extends JpaRepository<AsignacionProducto, Long> {

    Optional<AsignacionProducto> findBySolicitud_Id(Long solicitudId);

    List<AsignacionProducto> findAllByOrderByFechaEntregaDesc();

    List<AsignacionProducto> findByDevueltoFalseOrderByFechaEntregaDesc();

    List<AsignacionProducto> findByDevueltoTrueOrderByFechaDevolucionDesc();

    List<AsignacionProducto> findBySolicitud_Voluntario_IdAndDevueltoFalseOrderByFechaEntregaDesc(Long voluntarioId);
}
