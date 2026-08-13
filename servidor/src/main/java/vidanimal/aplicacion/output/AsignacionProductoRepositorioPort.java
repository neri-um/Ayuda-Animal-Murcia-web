package vidanimal.aplicacion.output;

import java.util.List;
import java.util.Optional;

import vidanimal.dominio.modelo.AsignacionProducto;

public interface AsignacionProductoRepositorioPort {
	AsignacionProducto guardar(AsignacionProducto asignacion);

	Optional<AsignacionProducto> buscarPorSolicitudId(Long solicitudId);

	List<AsignacionProducto> buscarTodasOrdenadas();

	List<AsignacionProducto> buscarPendientesDeDevolucion();

	List<AsignacionProducto> buscarDevueltas();

	List<AsignacionProducto> buscarActivasPorVoluntarioId(Long voluntarioId);
}
