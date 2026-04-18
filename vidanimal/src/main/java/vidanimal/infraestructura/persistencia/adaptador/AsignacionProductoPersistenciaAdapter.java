package vidanimal.infraestructura.persistencia.adaptador;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import vidanimal.aplicacion.output.AsignacionProductoRepositorioPort;
import vidanimal.dominio.modelo.AsignacionProducto;
import vidanimal.infraestructura.persistencia.AsignacionProductoRepositorio;

@Repository
public class AsignacionProductoPersistenciaAdapter implements AsignacionProductoRepositorioPort {

    private final AsignacionProductoRepositorio jpa;

    public AsignacionProductoPersistenciaAdapter(AsignacionProductoRepositorio jpa) {
        this.jpa = jpa;
    }

    @Override
    public AsignacionProducto guardar(AsignacionProducto asignacion) {
        return jpa.save(asignacion);
    }

    @Override
    public Optional<AsignacionProducto> buscarPorSolicitudId(Long solicitudId) {
        return jpa.findBySolicitud_Id(solicitudId);
    }

    @Override
    public List<AsignacionProducto> buscarTodasOrdenadas() {
        return jpa.findAllByOrderByFechaEntregaDesc();
    }

    @Override
    public List<AsignacionProducto> buscarPendientesDeDevolucion() {
        return jpa.findByDevueltoFalseOrderByFechaEntregaDesc();
    }

    @Override
    public List<AsignacionProducto> buscarDevueltas() {
        return jpa.findByDevueltoTrueOrderByFechaDevolucionDesc();
    }
}
