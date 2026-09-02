package vidanimal.aplicacion.input;

import java.util.List;

import vidanimal.dominio.modelo.Acogida;
import vidanimal.dominio.modelo.Especie;
import vidanimal.dominio.modelo.EstadoAcogida;
import vidanimal.dominio.modelo.EstadoSolicitudCuestionario;
import vidanimal.dominio.modelo.SolicitudAcogida;

public interface AcogidaUseCase {
	SolicitudAcogida crearSolicitudSolo(SolicitudAcogida solicitud, Long animalId, String respuestasJson);

	List<SolicitudAcogida> listarSolicitudes();

	SolicitudAcogida cambiarEstadoSolicitud(Long id, EstadoSolicitudCuestionario nuevoEstado);

	void eliminarSolicitud(Long id);

	Acogida crearAcogedorConSolicitud(String nombre, String apellidos, String telefono, String email,
			String direccion, Especie especie, String respuestasJson);

	List<Acogida> listarAcogedores();

	Acogida cambiarEstadoAcogida(Long id, EstadoAcogida nuevoEstado);

	void eliminarAcogedor(Long id);
}