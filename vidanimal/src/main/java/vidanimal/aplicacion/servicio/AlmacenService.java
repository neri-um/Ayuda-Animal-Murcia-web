package vidanimal.aplicacion.servicio;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import vidanimal.aplicacion.input.AlmacenUseCase;
import vidanimal.aplicacion.output.AsignacionProductoRepositorioPort;
import vidanimal.aplicacion.output.ProductoRepositorioPort;
import vidanimal.aplicacion.output.SolicitudProductoRepositorioPort;
import vidanimal.aplicacion.output.UsuarioRepositorioPort;
import vidanimal.dominio.excepcion.RecursoNoEncontradoException;
import vidanimal.dominio.modelo.AsignacionProducto;
import vidanimal.dominio.modelo.EstadoSolicitudProducto;
import vidanimal.dominio.modelo.Producto;
import vidanimal.dominio.modelo.SolicitudProducto;
import vidanimal.dominio.modelo.Usuario;

@Service
public class AlmacenService implements AlmacenUseCase {

    private final ProductoRepositorioPort productoRepo;
    private final SolicitudProductoRepositorioPort solicitudRepo;
    private final AsignacionProductoRepositorioPort asignacionRepo;
    private final UsuarioRepositorioPort usuarioRepo;

    public AlmacenService(ProductoRepositorioPort productoRepo,
                          SolicitudProductoRepositorioPort solicitudRepo,
                          AsignacionProductoRepositorioPort asignacionRepo,
                          UsuarioRepositorioPort usuarioRepo) {
        this.productoRepo = productoRepo;
        this.solicitudRepo = solicitudRepo;
        this.asignacionRepo = asignacionRepo;
        this.usuarioRepo = usuarioRepo;
    }

    // CU-13
    @Override
    public List<Producto> listarProductos() {
        return productoRepo.buscarTodosOrdenados();
    }

    // CU-17
    @Override
    public Producto crearProducto(Producto producto) {
        return productoRepo.guardar(producto);
    }

    // CU-18
    @Override
    public Producto editarProducto(Long id, Producto datosNuevos) {
        Producto producto = productoRepo.buscarPorId(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Producto con id " + id + " no encontrado"));

        if (datosNuevos.getNombre() != null) producto.setNombre(datosNuevos.getNombre());
        if (datosNuevos.getDescripcion() != null) producto.setDescripcion(datosNuevos.getDescripcion());
        if (datosNuevos.getCategoria() != null) producto.setCategoria(datosNuevos.getCategoria());

        producto.setStockTotal(datosNuevos.getStockTotal());

        return productoRepo.guardar(producto);
    }

    // CU-19
    @Override
    public void eliminarProducto(Long id) {
        Producto producto = productoRepo.buscarPorId(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Producto con id " + id + " no encontrado"));
        productoRepo.eliminar(producto);
    }

    // CU-14
    @Override
    public SolicitudProducto crearSolicitud(Long voluntarioId, Long productoId, int cantidad, String motivo) {
        Usuario voluntario = usuarioRepo.buscarPorId(voluntarioId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Voluntario no encontrado"));

        Producto producto = productoRepo.buscarPorId(productoId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Producto no encontrado"));

        if (producto.getStockTotal() < cantidad) {
            throw new RuntimeException("Stock insuficiente. Disponible: " + producto.getStockTotal());
        }

        SolicitudProducto solicitud = new SolicitudProducto();
        solicitud.setVoluntario(voluntario);
        solicitud.setProducto(producto);
        solicitud.setCantidad(cantidad);
        solicitud.setMotivo(motivo);

        // tu entidad tiene fechaSolicitud porque la ordenas por ella
        solicitud.setFechaSolicitud(LocalDateTime.now());
        solicitud.setEstado(EstadoSolicitudProducto.PENDIENTE);

        return solicitudRepo.guardar(solicitud);
    }

    // CU-15
    @Override
    public List<SolicitudProducto> listarSolicitudesDeVoluntario(Long voluntarioId) {
        usuarioRepo.buscarPorId(voluntarioId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Voluntario no encontrado"));

        return solicitudRepo.buscarPorVoluntarioId(voluntarioId);
    }

    // CU-20
    @Override
    public SolicitudProducto decidirSolicitud(Long solicitudId, String decision, Long encargadoId) {
        SolicitudProducto solicitud = solicitudRepo.buscarPorId(solicitudId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Solicitud no encontrada"));

        Usuario encargado = usuarioRepo.buscarPorId(encargadoId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Encargado no encontrado"));

        solicitud.setEncargado(encargado);
        solicitud.setFechaDecision(LocalDateTime.now());

        if ("ACEPTADA".equalsIgnoreCase(decision)) {
            solicitud.setEstado(EstadoSolicitudProducto.ACEPTADA);

            Producto producto = solicitud.getProducto();
            producto.setStockTotal(producto.getStockTotal() - solicitud.getCantidad());
            productoRepo.guardar(producto);

            AsignacionProducto asignacion = new AsignacionProducto();
            asignacion.setSolicitud(solicitud);
            asignacion.setFechaEntrega(LocalDateTime.now());
            asignacion.setDevuelto(false);

            asignacionRepo.guardar(asignacion);

        } else {
            solicitud.setEstado(EstadoSolicitudProducto.RECHAZADA);
        }

        return solicitudRepo.guardar(solicitud);
    }

    // CU-21
    @Override
    public List<AsignacionProducto> listarAsignaciones() {
        return asignacionRepo.buscarTodasOrdenadas();
    }

    // CU-16
    @Override
    public AsignacionProducto notificarDevolucion(Long solicitudId) {
        AsignacionProducto asignacion = asignacionRepo.buscarPorSolicitudId(solicitudId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Asignación no encontrada"));

        asignacion.setFechaDevolucion(LocalDateTime.now());
        return asignacionRepo.guardar(asignacion);
    }

    // CU-22
    @Override
    public AsignacionProducto confirmarDevolucion(Long solicitudId, Long encargadoId) {
        AsignacionProducto asignacion = asignacionRepo.buscarPorSolicitudId(solicitudId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Asignación no encontrada"));

        Usuario encargado = usuarioRepo.buscarPorId(encargadoId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Encargado no encontrado"));

        asignacion.setDevuelto(true);
        asignacion.setEncargadoConfirmacion(encargado);

        Producto producto = asignacion.getSolicitud().getProducto();
        producto.setStockTotal(producto.getStockTotal() + asignacion.getSolicitud().getCantidad());
        productoRepo.guardar(producto);

        return asignacionRepo.guardar(asignacion);
    }
    
    @Override
    public Producto obtenerProductoPorId(Long id) {
        return productoRepo.buscarPorId(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Producto con id " + id + " no encontrado"));
    }

    @Override
    public List<SolicitudProducto> obtenerSolicitudes() {
        return solicitudRepo.buscarTodasOrdenadas();
    }

    @Override
    public List<AsignacionProducto> obtenerAsignaciones() {
        return asignacionRepo.buscarTodasOrdenadas();
    }

    @Override
    public AsignacionProducto registrarDevolucion(Long solicitudId) {
        return notificarDevolucion(solicitudId);
    }
}