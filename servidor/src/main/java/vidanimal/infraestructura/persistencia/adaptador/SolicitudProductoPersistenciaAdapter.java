package vidanimal.infraestructura.persistencia.adaptador;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import vidanimal.aplicacion.output.SolicitudProductoRepositorioPort;
import vidanimal.dominio.modelo.EstadoSolicitudProducto;
import vidanimal.dominio.modelo.SolicitudProducto;
import vidanimal.infraestructura.persistencia.SolicitudProductoRepositorio;

@Repository
public class SolicitudProductoPersistenciaAdapter implements SolicitudProductoRepositorioPort {

    private final SolicitudProductoRepositorio jpa;

    public SolicitudProductoPersistenciaAdapter(SolicitudProductoRepositorio jpa) {
        this.jpa = jpa;
    }

    @Override
    public SolicitudProducto guardar(SolicitudProducto solicitud) {
        return jpa.save(solicitud);
    }

    @Override
    public Optional<SolicitudProducto> buscarPorId(Long id) {
        return jpa.findById(id);
    }

    @Override
    public List<SolicitudProducto> buscarTodasOrdenadas() {
        return jpa.findAllByOrderByFechaSolicitudDesc();
    }

    @Override
    public List<SolicitudProducto> buscarPorEstado(EstadoSolicitudProducto estado) {
        return jpa.findByEstadoOrderByFechaSolicitudDesc(estado);
    }

    @Override
    public List<SolicitudProducto> buscarPorVoluntarioId(Long voluntarioId) {
        return jpa.findByVoluntario_IdOrderByFechaSolicitudDesc(voluntarioId);
    }

    @Override
    public List<SolicitudProducto> buscarPorProductoId(Long productoId) {
        return jpa.findByProductoIdOrderByFechaSolicitudDesc(productoId);
    }
}
