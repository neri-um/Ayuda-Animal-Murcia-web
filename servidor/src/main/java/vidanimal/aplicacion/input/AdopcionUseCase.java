package vidanimal.aplicacion.input;

import java.util.List;

import vidanimal.dominio.modelo.EstadoSolicitudCuestionario;
import vidanimal.dominio.modelo.FormularioAdopcion;
import vidanimal.dominio.modelo.SolicitudAdopcion;

public interface AdopcionUseCase {
	FormularioAdopcion obtenerFormularioPorAnimal(Long animalId);

	SolicitudAdopcion crearSolicitud(SolicitudAdopcion solicitud, Long animalId, String respuestasJson);

	List<SolicitudAdopcion> listarSolicitudes();

	SolicitudAdopcion cambiarEstado(Long id, EstadoSolicitudCuestionario nuevoEstado);

	SolicitudAdopcion reubicarSolicitud(Long id, Long animalId);

	void eliminarSolicitud(Long id);

	List<FormularioAdopcion> listarFormularios();

	FormularioAdopcion crearFormulario(FormularioAdopcion formulario, String preguntasJson);

	void eliminarFormulario(Long id);
}