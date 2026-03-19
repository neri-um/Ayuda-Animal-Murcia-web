package vidanimal.infraestructura.rest;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import vidanimal.dominio.modelo.AsignacionProducto;
import vidanimal.dominio.modelo.Producto;
import vidanimal.dominio.modelo.SolicitudProducto;
import vidanimal.aplicacion.input.AlmacenUseCase;
import vidanimal.infraestructura.rest.dto.ConfirmacionDevolucionDTO;
import vidanimal.infraestructura.rest.dto.DecisionSolicitudDTO;
import vidanimal.infraestructura.rest.dto.SolicitudNuevaDTO;

import java.util.List;

@RestController
@RequestMapping("/vidanimal/almacen")
public class AlmacenController {
	private final AlmacenUseCase servicio;

	public AlmacenController(AlmacenUseCase servicio) {
		this.servicio = servicio;
	}

	// --- PRODUCTOS ---

	@GetMapping("/productos")
	public ResponseEntity<List<Producto>> listarProductos() {
		return ResponseEntity.ok(servicio.listarProductos());
	}

	@GetMapping("/productos/{id}")
	public ResponseEntity<Producto> obtenerProducto(@PathVariable Long id) {
		return ResponseEntity.ok(servicio.obtenerProductoPorId(id));
	}

	@PostMapping("/productos")
	@PreAuthorize("hasAnyAuthority('ADMIN', 'ENCARGADO')")
	public ResponseEntity<Producto> crearProducto(@RequestBody Producto producto) {
		return ResponseEntity.ok(servicio.crearProducto(producto));
	}

	@PutMapping("/productos/{id}")
	@PreAuthorize("hasAnyAuthority('ADMIN', 'ENCARGADO')")
	public ResponseEntity<Producto> editarProducto(@PathVariable Long id, @RequestBody Producto datosNuevos) {
		return ResponseEntity.ok(servicio.editarProducto(id, datosNuevos));
	}

	@DeleteMapping("/productos/{id}")
	@PreAuthorize("hasAuthority('ADMIN')")
	public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
		servicio.eliminarProducto(id);
		return ResponseEntity.noContent().build();
	}

	// --- SOLICITUDES ---

	@GetMapping("/solicitudes")
	@PreAuthorize("hasAnyAuthority('ADMIN', 'ENCARGADO')")
	public ResponseEntity<List<SolicitudProducto>> listarSolicitudes() {
		return ResponseEntity.ok(servicio.obtenerSolicitudes());
	}

	@PostMapping("/solicitudes")
	public ResponseEntity<SolicitudProducto> crearSolicitud(@RequestBody SolicitudNuevaDTO dto) {
		return ResponseEntity.ok(servicio.crearSolicitud(dto.getVoluntarioId(), dto.getProductoId(), dto.getCantidad(),
				dto.getMotivo()));
	}

	@PutMapping("/solicitudes/{id}")
	@PreAuthorize("hasAnyAuthority('ADMIN', 'ENCARGADO')")
	public ResponseEntity<SolicitudProducto> decidirSolicitud(@PathVariable Long id,
			@RequestBody DecisionSolicitudDTO dto) {
		return ResponseEntity.ok(servicio.decidirSolicitud(id, dto.getDecision(), dto.getEncargadoId()));
	}

	@PutMapping("/solicitudes/{id}/devolucion")
	public ResponseEntity<AsignacionProducto> registrarDevolucion(@PathVariable Long id) {
		return ResponseEntity.ok(servicio.registrarDevolucion(id));
	}

	@PutMapping("/solicitudes/{id}/confirmacion")
	@PreAuthorize("hasAnyAuthority('ADMIN', 'ENCARGADO')")
	public ResponseEntity<AsignacionProducto> confirmarDevolucion(@PathVariable Long id,
			@RequestBody ConfirmacionDevolucionDTO dto) {
		return ResponseEntity.ok(servicio.confirmarDevolucion(id, dto.getEncargadoId()));
	}

	// --- ASIGNACIONES ---

	@GetMapping("/asignaciones")
	@PreAuthorize("hasAnyAuthority('ADMIN', 'ENCARGADO')")
	public ResponseEntity<List<AsignacionProducto>> listarAsignaciones() {
		return ResponseEntity.ok(servicio.obtenerAsignaciones());
	}
}