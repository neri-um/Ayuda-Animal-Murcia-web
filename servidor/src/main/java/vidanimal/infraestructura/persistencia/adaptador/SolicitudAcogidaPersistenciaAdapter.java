package vidanimal.infraestructura.persistencia.adaptador;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import vidanimal.aplicacion.output.SolicitudAcogidaRepositorioPort;
import vidanimal.dominio.modelo.SolicitudAcogida;
import vidanimal.infraestructura.persistencia.SolicitudAcogidaRepositorio;

@Repository
public class SolicitudAcogidaPersistenciaAdapter implements SolicitudAcogidaRepositorioPort {

    private final SolicitudAcogidaRepositorio repo;

    public SolicitudAcogidaPersistenciaAdapter(SolicitudAcogidaRepositorio repo) {
        this.repo = repo;
    }

    @Override
    public SolicitudAcogida guardar(SolicitudAcogida solicitud) {
        return repo.save(solicitud);
    }

    @Override
    public Optional<SolicitudAcogida> buscarPorId(Long id) {
        return repo.findById(id);
    }

    @Override
    public List<SolicitudAcogida> buscarTodasOrdenadas() {
        return repo.findAllByOrderByFechaSolicitudDesc();
    }

    @Override
    public void eliminar(Long id) {
        repo.deleteById(id);
    }
}