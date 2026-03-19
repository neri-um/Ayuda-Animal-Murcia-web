package vidanimal.dominio.puerto.entrada;

import vidanimal.dominio.modelo.Producto;
import vidanimal.dominio.modelo.SolicitudProducto;
import vidanimal.dominio.modelo.AsignacionProducto;
import java.util.List;

public interface AlmacenServicioPuerto {

    // CU-17: Registrar producto
    Producto crearProducto(Producto producto);

    // CU-13: Consultar productos
    List<Producto> obtenerProductos();

    // CU-14: Consultar ficha producto
    Producto obtenerProductoPorId(Long id);

    // CU-18: Editar producto
    Producto editarProducto(Long id, Producto datosNuevos);

    // CU-19: Eliminar producto
    void eliminarProducto(Long id);

    // CU-15: Solicitar producto
    SolicitudProducto crearSolicitud(Long voluntarioId, Long productoId,
                                      int cantidad, String motivo);

    // CU-16: Consultar solicitudes
    List<SolicitudProducto> obtenerSolicitudes();

    // CU-20: Aceptar/Rechazar solicitud
    SolicitudProducto decidirSolicitud(Long solicitudId, String decision,
                                        Long encargadoId);

    // CU-21: Registrar devolución
    AsignacionProducto registrarDevolucion(Long solicitudId);

    // CU-22: Confirmar devolución
    AsignacionProducto confirmarDevolucion(Long solicitudId, Long encargadoId);

    // Consultar asignaciones
    List<AsignacionProducto> obtenerAsignaciones();
}