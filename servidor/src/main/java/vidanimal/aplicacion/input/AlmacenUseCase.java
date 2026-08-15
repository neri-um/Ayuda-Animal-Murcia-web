package vidanimal.aplicacion.input;

import java.util.List;

import vidanimal.dominio.modelo.AsignacionProducto;
import vidanimal.dominio.modelo.CategoriaProducto;
import vidanimal.dominio.modelo.Producto;
import vidanimal.dominio.modelo.SolicitudProducto;

public interface AlmacenUseCase {

	List<Producto> listarProductos();

	List<Producto> listarProductosPorCategoria(CategoriaProducto categoria);

	Producto crearProducto(Producto producto);

	Producto editarProducto(Long id, Producto datosNuevos);

	void eliminarProducto(Long id);

	SolicitudProducto crearSolicitud(Long voluntarioId, Long productoId, int cantidad, String motivo);

	List<SolicitudProducto> listarSolicitudesDeVoluntario(Long voluntarioId);

	SolicitudProducto decidirSolicitud(Long solicitudId, String decision, Long encargadoId, String notaEncargado, String detalleEntregado);

	List<AsignacionProducto> listarAsignaciones();

	List<AsignacionProducto> listarAsignacionesDeVoluntario(Long voluntarioId);

	AsignacionProducto notificarDevolucion(Long solicitudId);

	AsignacionProducto confirmarDevolucion(Long solicitudId, Long encargadoId);

	Producto obtenerProductoPorId(Long id);

	List<SolicitudProducto> obtenerSolicitudes();

	List<AsignacionProducto> obtenerAsignaciones();

	AsignacionProducto registrarDevolucion(Long solicitudId);
}
