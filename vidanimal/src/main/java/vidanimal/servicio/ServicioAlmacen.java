package vidanimal.servicio;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vidanimal.modelo.*;
import vidanimal.repositorio.ProductoRepository;
import vidanimal.repositorio.SolicitudProductoRepository;
import vidanimal.repositorio.UsuarioRepository;

@Service
public class ServicioAlmacen implements IServicioAlmacen {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private SolicitudProductoRepository solicitudRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // ===================== PRODUCTOS =====================

    // CU-13: Ver almacén
    @Override
    public List<Producto> getProductos(CategoriaProducto categoria) {
        if (categoria != null)
            return productoRepository.findByCategoriaOrderByNombre(categoria);

        return productoRepository.findAllByOrderByNombre();
    }

    @Override
    public Producto getProducto(Long id) {
        return productoRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException(
                "No existe producto con id: " + id));
    }

    // CU-17: Añadir producto al almacén
    @Override
    public Producto crearProducto(String nombre, String descripcion,
                                  CategoriaProducto categoria, int stock) {
        if (nombre == null || nombre.isBlank())
            throw new IllegalArgumentException("El nombre no puede ser vacío");
        if (categoria == null)
            throw new IllegalArgumentException("La categoría no puede ser nula");
        if (stock < 0)
            throw new IllegalArgumentException("El stock no puede ser negativo");

        Producto producto = new Producto(nombre, descripcion, categoria, stock);
        return productoRepository.save(producto);
    }

    // CU-18: Editar producto del almacén
    @Override
    public Producto editarProducto(Long id, String nombre, String descripcion,
                                   CategoriaProducto categoria, int stock) {
        Producto producto = getProducto(id);

        if (nombre != null && !nombre.isBlank()) producto.setNombre(nombre);
        if (descripcion != null) producto.setDescripcion(descripcion);
        if (categoria != null) producto.setCategoria(categoria);
        if (stock >= 0) {
            int diferencia = stock - producto.getStockTotal();
            producto.setStockTotal(stock);
            producto.setStockDisponible(producto.getStockDisponible() + diferencia);

            if (producto.getStockDisponible() < 0)
                producto.setStockDisponible(0);
        }

        return productoRepository.save(producto);
    }

    // CU-19: Eliminar producto del almacén
    @Override
    public void eliminarProducto(Long id) {
        Producto producto = getProducto(id);
        productoRepository.delete(producto);
    }

    // ===================== SOLICITUDES =====================

    // CU-14: Solicitar producto del almacén
    @Override
    public SolicitudProducto solicitarProducto(Long voluntarioId, Long productoId,
                                               int cantidad, String motivo) {
        if (cantidad <= 0)
            throw new IllegalArgumentException("La cantidad debe ser mayor que 0");

        Usuario voluntario = usuarioRepository.findById(voluntarioId)
            .orElseThrow(() -> new EntityNotFoundException(
                "No existe usuario con id: " + voluntarioId));

        Producto producto = getProducto(productoId);

        if (producto.getStockDisponible() < cantidad)
            throw new IllegalArgumentException(
                "Stock insuficiente. Disponible: " + producto.getStockDisponible());

        SolicitudProducto solicitud = new SolicitudProducto();
        solicitud.setVoluntario(voluntario);
        solicitud.setProducto(producto);
        solicitud.setCantidad(cantidad);
        solicitud.setMotivo(motivo);
        solicitud.setEstado(EstadoSolicitudProducto.PENDIENTE);
        solicitud.setFechaSolicitud(LocalDateTime.now());

        return solicitudRepository.save(solicitud);
    }

    // CU-15: Ver estado de mis solicitudes
    @Override
    public List<SolicitudProducto> getMisSolicitudes(Long voluntarioId) {
        return solicitudRepository.findByVoluntarioIdOrderByFechaSolicitudDesc(voluntarioId);
    }

    // CU-20: Gestionar solicitud (aceptar/rechazar)
    @Override
    public SolicitudProducto gestionarSolicitud(Long solicitudId,
                                                EstadoSolicitudProducto decision,
                                                Long encargadoId) {
        if (decision != EstadoSolicitudProducto.ACEPTADA &&
            decision != EstadoSolicitudProducto.RECHAZADA)
            throw new IllegalArgumentException("La decisión debe ser ACEPTADA o RECHAZADA");

        SolicitudProducto solicitud = solicitudRepository.findById(solicitudId)
            .orElseThrow(() -> new EntityNotFoundException(
                "No existe solicitud con id: " + solicitudId));

        if (solicitud.getEstado() != EstadoSolicitudProducto.PENDIENTE)
            throw new IllegalArgumentException(
                "Solo se pueden gestionar solicitudes pendientes. Estado: " + solicitud.getEstado());

        Usuario encargado = usuarioRepository.findById(encargadoId)
            .orElseThrow(() -> new EntityNotFoundException(
                "No existe usuario con id: " + encargadoId));

        if (decision == EstadoSolicitudProducto.ACEPTADA) {
            Producto producto = solicitud.getProducto();

            if (producto.getStockDisponible() < solicitud.getCantidad())
                throw new IllegalArgumentException(
                    "Stock insuficiente. Disponible: " + producto.getStockDisponible());

            producto.setStockDisponible(
                producto.getStockDisponible() - solicitud.getCantidad());
            productoRepository.save(producto);

            solicitud.setEstado(EstadoSolicitudProducto.ACEPTADA);
        } else {
            solicitud.setEstado(EstadoSolicitudProducto.RECHAZADA);
        }

        solicitud.setGestionadoPor(encargado);
        solicitud.setFechaResolucion(LocalDateTime.now());

        return solicitudRepository.save(solicitud);
    }

    // CU-21: Ver asignación de productos
    @Override
    public List<SolicitudProducto> getAsignaciones() {
        List<EstadoSolicitudProducto> estadosEnPosesion = Arrays.asList(
            EstadoSolicitudProducto.ACEPTADA,
            EstadoSolicitudProducto.DEVOLUCION_NOTIFICADA
        );
        return solicitudRepository.findByEstadoInOrderByFechaSolicitudDesc(estadosEnPosesion);
    }

    // ===================== DEVOLUCIONES =====================

    // CU-16: Notificar devolución
    @Override
    public SolicitudProducto notificarDevolucion(Long solicitudId) {
        SolicitudProducto solicitud = solicitudRepository.findById(solicitudId)
            .orElseThrow(() -> new EntityNotFoundException(
                "No existe solicitud con id: " + solicitudId));

        if (solicitud.getEstado() != EstadoSolicitudProducto.ACEPTADA)
            throw new IllegalArgumentException(
                "Solo se puede notificar devolución de solicitudes aceptadas. Estado: " + solicitud.getEstado());

        solicitud.setDevolucionNotificada(true);
        solicitud.setEstado(EstadoSolicitudProducto.DEVOLUCION_NOTIFICADA);

        return solicitudRepository.save(solicitud);
    }

    // CU-22: Confirmar devolución
    @Override
    public SolicitudProducto confirmarDevolucion(Long solicitudId, Long encargadoId) {
        SolicitudProducto solicitud = solicitudRepository.findById(solicitudId)
            .orElseThrow(() -> new EntityNotFoundException(
                "No existe solicitud con id: " + solicitudId));

        if (solicitud.getEstado() != EstadoSolicitudProducto.DEVOLUCION_NOTIFICADA)
            throw new IllegalArgumentException(
                "Solo se puede confirmar devolución de solicitudes con devolución notificada. Estado: " + solicitud.getEstado());

        Usuario encargado = usuarioRepository.findById(encargadoId)
            .orElseThrow(() -> new EntityNotFoundException(
                "No existe usuario con id: " + encargadoId));

        // Recuperar stock
        Producto producto = solicitud.getProducto();
        producto.setStockDisponible(
            producto.getStockDisponible() + solicitud.getCantidad());
        productoRepository.save(producto);

        solicitud.setDevolucionConfirmada(true);
        solicitud.setEstado(EstadoSolicitudProducto.DEVUELTA);
        solicitud.setGestionadoPor(encargado);
        solicitud.setFechaDevolucion(LocalDateTime.now());

        return solicitudRepository.save(solicitud);
    }
}