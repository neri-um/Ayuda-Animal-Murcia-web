package vidanimal.infraestructura.rest;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import vidanimal.aplicacion.input.AlmacenUseCase;
import vidanimal.dominio.modelo.AsignacionProducto;
import vidanimal.dominio.modelo.CategoriaProducto;
import vidanimal.dominio.modelo.Producto;
import vidanimal.dominio.modelo.SolicitudProducto;
import vidanimal.infraestructura.rest.dto.ConfirmacionDevolucionDTO;
import vidanimal.infraestructura.rest.dto.DecisionSolicitudDTO;
import vidanimal.infraestructura.rest.dto.ProductoNuevoDTO;
import vidanimal.infraestructura.rest.dto.SolicitudNuevaDTO;

@RestController
@RequestMapping("/vidanimal/almacen")
public class AlmacenController {
    private final AlmacenUseCase servicio;

    public AlmacenController(AlmacenUseCase servicio) {
        this.servicio = servicio;
    }

    // --- PRODUCTOS ---

    @PreAuthorize("hasAnyAuthority('ADMIN', 'ENCARGADO', 'VOLUNTARIO')")
    @GetMapping("/productos")
    public ResponseEntity<List<Producto>> listarProductos(
            @RequestParam(required = false) String categoria) {
        if (categoria != null) {
            CategoriaProducto cat = CategoriaProducto.valueOf(categoria.toUpperCase());
            return ResponseEntity.ok(servicio.listarProductosPorCategoria(cat));
        }
        return ResponseEntity.ok(servicio.listarProductos());
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'ENCARGADO', 'VOLUNTARIO')")
    @GetMapping("/productos/{id}")
    public ResponseEntity<Producto> obtenerProducto(@PathVariable Long id) {
        return ResponseEntity.ok(servicio.obtenerProductoPorId(id));
    }

    @PostMapping("/productos")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'ENCARGADO')")
    public ResponseEntity<Producto> crearProducto(@RequestBody ProductoNuevoDTO dto) {
        return ResponseEntity.ok(servicio.crearProducto(dto.toDominio()));
    }

    @PutMapping("/productos/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'ENCARGADO')")
    public ResponseEntity<Producto> editarProducto(@PathVariable Long id, @RequestBody ProductoNuevoDTO dto) {
        return ResponseEntity.ok(servicio.editarProducto(id, dto.toDominio()));
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

    @PreAuthorize("hasAnyAuthority('ADMIN', 'ENCARGADO', 'VOLUNTARIO')")
    @PostMapping("/solicitudes")
    public ResponseEntity<SolicitudProducto> crearSolicitud(@RequestBody SolicitudNuevaDTO dto) {
        return ResponseEntity.ok(servicio.crearSolicitud(
                dto.getVoluntarioId(), dto.getProductoId(), dto.getCantidad(), dto.getMotivo()));
    }

    @PutMapping("/solicitudes/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'ENCARGADO')")
    public ResponseEntity<SolicitudProducto> decidirSolicitud(@PathVariable Long id,
            @RequestBody DecisionSolicitudDTO dto) {
        return ResponseEntity.ok(servicio.decidirSolicitud(id, dto.getDecision(), dto.getEncargadoId()));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'ENCARGADO', 'VOLUNTARIO')")
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
