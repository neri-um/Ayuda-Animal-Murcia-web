package vidanimal.aplicacion.input;

import java.util.List;

import vidanimal.dominio.modelo.AsignacionProducto;
import vidanimal.dominio.modelo.CategoriaProducto;
import vidanimal.dominio.modelo.Producto;
import vidanimal.dominio.modelo.SolicitudProducto;

public interface AlmacenUseCase {

	// CU-15
	List<Producto> listarProductos();

	// CU-15 filtrado
	List<Producto> listarProductosPorCategoria(CategoriaProducto categoria);

	// CU-23
	Producto crearProducto(Producto producto);

	// CU-24
	Producto editarProducto(Long id, Producto datosNuevos);

	// CU-25
	void eliminarProducto(Long id);

	// CU-17
	SolicitudProducto crearSolicitud(Long voluntarioId, Long productoId, int cantidad, String motivo);

	// CU-18
	List<SolicitudProducto> listarSolicitudesDeVoluntario(Long voluntarioId);

	// CU-26
	SolicitudProducto decidirSolicitud(Long solicitudId, String decision, Long encargadoId);

	// CU-27
	List<AsignacionProducto> listarAsignaciones();

	// CU-19: Ver mis productos recogidos
	List<AsignacionProducto> listarAsignacionesDeVoluntario(Long voluntarioId);

	// CU-20
	AsignacionProducto notificarDevolucion(Long solicitudId);

	// CU-28
	AsignacionProducto confirmarDevolucion(Long solicitudId, Long encargadoId);

	Producto obtenerProductoPorId(Long id);

	List<SolicitudProducto> obtenerSolicitudes();

	List<AsignacionProducto> obtenerAsignaciones();

	AsignacionProducto registrarDevolucion(Long solicitudId);
}
