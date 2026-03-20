package vidanimal.aplicacion.input;

import java.util.List;

import vidanimal.dominio.modelo.AsignacionProducto;
import vidanimal.dominio.modelo.CategoriaProducto;
import vidanimal.dominio.modelo.Producto;
import vidanimal.dominio.modelo.SolicitudProducto;

public interface AlmacenUseCase {

	// CU-13
	List<Producto> listarProductos();

	// CU-13 filtrado
	List<Producto> listarProductosPorCategoria(CategoriaProducto categoria);

	// CU-17
	Producto crearProducto(Producto producto);

	// CU-18
	Producto editarProducto(Long id, Producto datosNuevos);

	// CU-19
	void eliminarProducto(Long id);

	// CU-14
	SolicitudProducto crearSolicitud(Long voluntarioId, Long productoId, int cantidad, String motivo);

	// CU-15
	List<SolicitudProducto> listarSolicitudesDeVoluntario(Long voluntarioId);

	// CU-20
	SolicitudProducto decidirSolicitud(Long solicitudId, String decision, Long encargadoId);

	// CU-21
	List<AsignacionProducto> listarAsignaciones();

	// CU-16
	AsignacionProducto notificarDevolucion(Long solicitudId);

	// CU-22
	AsignacionProducto confirmarDevolucion(Long solicitudId, Long encargadoId);

	Producto obtenerProductoPorId(Long id);

	List<SolicitudProducto> obtenerSolicitudes();

	List<AsignacionProducto> obtenerAsignaciones();

	AsignacionProducto registrarDevolucion(Long solicitudId);
}