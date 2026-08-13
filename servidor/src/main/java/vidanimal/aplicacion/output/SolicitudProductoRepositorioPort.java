package vidanimal.aplicacion.output;

import java.util.List;
import java.util.Optional;

import vidanimal.dominio.modelo.EstadoSolicitudProducto;
import vidanimal.dominio.modelo.SolicitudProducto;

public interface SolicitudProductoRepositorioPort {
	SolicitudProducto guardar(SolicitudProducto solicitud);

	Optional<SolicitudProducto> buscarPorId(Long id);

	List<SolicitudProducto> buscarTodasOrdenadas();

	List<SolicitudProducto> buscarPorEstado(EstadoSolicitudProducto estado);

	List<SolicitudProducto> buscarPorVoluntarioId(Long voluntarioId);

	List<SolicitudProducto> buscarPorProductoId(Long productoId);
}
