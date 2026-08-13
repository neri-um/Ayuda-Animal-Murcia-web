package vidanimal.aplicacion.output;

import java.util.List;
import java.util.Optional;

import vidanimal.dominio.modelo.SolicitudAdopcion;

public interface SolicitudAdopcionRepositorioPort {
	SolicitudAdopcion guardar(SolicitudAdopcion solicitud);

	Optional<SolicitudAdopcion> buscarPorId(Long id);

	List<SolicitudAdopcion> buscarTodasOrdenadas();

	void eliminar(Long id);
}