package vidanimal.aplicacion.servicio;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import vidanimal.dominio.excepcion.RecursoNoEncontradoException;
import vidanimal.dominio.modelo.AsignacionProducto;
import vidanimal.dominio.modelo.EstadoSolicitudProducto;
import vidanimal.dominio.modelo.Producto;
import vidanimal.dominio.modelo.SolicitudProducto;
import vidanimal.dominio.modelo.Usuario;
import vidanimal.dominio.puerto.entrada.AlmacenServicioPuerto;
import vidanimal.infraestructura.persistencia.AsignacionProductoRepositorio;
import vidanimal.infraestructura.persistencia.ProductoRepositorio;
import vidanimal.infraestructura.persistencia.SolicitudProductoRepositorio;
import vidanimal.infraestructura.persistencia.UsuarioRepositorio;

@Service
public class AlmacenServicio implements AlmacenServicioPuerto {

	private final ProductoRepositorio productoRepo;
	private final SolicitudProductoRepositorio solicitudRepo;
	private final AsignacionProductoRepositorio asignacionRepo;
	private final UsuarioRepositorio usuarioRepo;

	public AlmacenServicio(ProductoRepositorio productoRepo, SolicitudProductoRepositorio solicitudRepo,
			AsignacionProductoRepositorio asignacionRepo, UsuarioRepositorio usuarioRepo) {
		this.productoRepo = productoRepo;
		this.solicitudRepo = solicitudRepo;
		this.asignacionRepo = asignacionRepo;
		this.usuarioRepo = usuarioRepo;
	}

	// --- PRODUCTOS ---

	@Override
	public Producto crearProducto(Producto producto) {
		return productoRepo.save(producto);
	}

	@Override
	public List<Producto> obtenerProductos() {
		return productoRepo.findAll();
	}

	@Override
	public Producto obtenerProductoPorId(Long id) {
		return productoRepo.findById(id)
				.orElseThrow(() -> new RecursoNoEncontradoException("Producto con id " + id + " no encontrado"));
	}

	@Override
	public Producto editarProducto(Long id, Producto datosNuevos) {
		Producto producto = obtenerProductoPorId(id);

		if (datosNuevos.getNombre() != null)
			producto.setNombre(datosNuevos.getNombre());
		if (datosNuevos.getDescripcion() != null)
			producto.setDescripcion(datosNuevos.getDescripcion());
		if (datosNuevos.getCategoria() != null)
			producto.setCategoria(datosNuevos.getCategoria());
		producto.setStockTotal(datosNuevos.getStockTotal());

		return productoRepo.save(producto);
	}

	@Override
	public void eliminarProducto(Long id) {
		Producto producto = obtenerProductoPorId(id);
		productoRepo.delete(producto);
	}

	// --- SOLICITUDES ---

	@Override
	public SolicitudProducto crearSolicitud(Long voluntarioId, Long productoId, int cantidad, String motivo) {
		Usuario voluntario = usuarioRepo.findById(voluntarioId)
				.orElseThrow(() -> new RecursoNoEncontradoException("Voluntario no encontrado"));

		Producto producto = obtenerProductoPorId(productoId);

		if (producto.getStockTotal() < cantidad) {
			throw new RuntimeException("Stock insuficiente. Disponible: " + producto.getStockTotal());
		}

		SolicitudProducto solicitud = new SolicitudProducto();
		solicitud.setVoluntario(voluntario);
		solicitud.setProducto(producto);
		solicitud.setCantidad(cantidad);
		solicitud.setMotivo(motivo);

		return solicitudRepo.save(solicitud);
	}

	@Override
	public List<SolicitudProducto> obtenerSolicitudes() {
		return solicitudRepo.findAll();
	}

	@Override
	public SolicitudProducto decidirSolicitud(Long solicitudId, String decision, Long encargadoId) {
		SolicitudProducto solicitud = solicitudRepo.findById(solicitudId)
				.orElseThrow(() -> new RecursoNoEncontradoException("Solicitud no encontrada"));

		Usuario encargado = usuarioRepo.findById(encargadoId)
				.orElseThrow(() -> new RecursoNoEncontradoException("Encargado no encontrado"));

		solicitud.setEncargado(encargado);
		solicitud.setFechaDecision(LocalDateTime.now());

		if ("ACEPTADA".equalsIgnoreCase(decision)) {
			solicitud.setEstado(EstadoSolicitudProducto.ACEPTADA);

			// Descontar stock
			Producto producto = solicitud.getProducto();
			producto.setStockTotal(producto.getStockTotal() - solicitud.getCantidad());
			productoRepo.save(producto);

			// Crear asignación
			AsignacionProducto asignacion = new AsignacionProducto();
			asignacion.setSolicitud(solicitud);
			asignacionRepo.save(asignacion);

		} else {
			solicitud.setEstado(EstadoSolicitudProducto.RECHAZADA);
		}

		return solicitudRepo.save(solicitud);
	}

	// --- DEVOLUCIONES ---

	@Override
	public AsignacionProducto registrarDevolucion(Long solicitudId) {
		AsignacionProducto asignacion = asignacionRepo.findBySolicitudId(solicitudId)
				.orElseThrow(() -> new RecursoNoEncontradoException("Asignación no encontrada"));

		asignacion.setFechaDevolucion(LocalDateTime.now());
		return asignacionRepo.save(asignacion);
	}

	@Override
	public AsignacionProducto confirmarDevolucion(Long solicitudId, Long encargadoId) {
		AsignacionProducto asignacion = asignacionRepo.findBySolicitudId(solicitudId)
				.orElseThrow(() -> new RecursoNoEncontradoException("Asignación no encontrada"));

		Usuario encargado = usuarioRepo.findById(encargadoId)
				.orElseThrow(() -> new RecursoNoEncontradoException("Encargado no encontrado"));

		asignacion.setDevuelto(true);
		asignacion.setEncargadoConfirmacion(encargado);

		// Devolver stock
		Producto producto = asignacion.getSolicitud().getProducto();
		producto.setStockTotal(producto.getStockTotal() + asignacion.getSolicitud().getCantidad());
		productoRepo.save(producto);

		return asignacionRepo.save(asignacion);
	}

	@Override
	public List<AsignacionProducto> obtenerAsignaciones() {
		return asignacionRepo.findAll();
	}
}