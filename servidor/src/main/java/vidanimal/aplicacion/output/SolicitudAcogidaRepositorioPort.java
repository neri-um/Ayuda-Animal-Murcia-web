package vidanimal.aplicacion.output;

import java.util.List;
import java.util.Optional;

import vidanimal.dominio.modelo.SolicitudAcogida;

public interface SolicitudAcogidaRepositorioPort {
	SolicitudAcogida guardar(SolicitudAcogida solicitud);

	Optional<SolicitudAcogida> buscarPorId(Long id);

	List<SolicitudAcogida> buscarTodasOrdenadas();

	void eliminar(Long id);
}