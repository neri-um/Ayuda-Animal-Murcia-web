package vidanimal.servicio;

import java.util.List;

import vidanimal.modelo.*;

public interface IServicioAlmacen {

    List<Producto> getProductos(CategoriaProducto categoria);             // CU-13
    Producto getProducto(Long id);
    Producto crearProducto(String nombre, String descripcion,
                           CategoriaProducto categoria, int stock);       // CU-17
    Producto editarProducto(Long id, String nombre, String descripcion,
                            CategoriaProducto categoria, int stock);      // CU-18
    void eliminarProducto(Long id);                                       // CU-19

    SolicitudProducto solicitarProducto(Long voluntarioId,
                                        Long productoId,
                                        int cantidad, String motivo);     // CU-14
    List<SolicitudProducto> getMisSolicitudes(Long voluntarioId);         // CU-15

    SolicitudProducto gestionarSolicitud(Long solicitudId,
                                         EstadoSolicitudProducto decision,
                                         Long encargadoId);              // CU-20
    List<SolicitudProducto> getAsignaciones();                           // CU-21

    SolicitudProducto notificarDevolucion(Long solicitudId);             // CU-16
    SolicitudProducto confirmarDevolucion(Long solicitudId,
                                          Long encargadoId);             // CU-22
}