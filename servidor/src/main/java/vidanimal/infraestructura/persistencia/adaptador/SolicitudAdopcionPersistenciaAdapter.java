package vidanimal.infraestructura.persistencia.adaptador;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import vidanimal.aplicacion.output.SolicitudAdopcionRepositorioPort;
import vidanimal.dominio.modelo.SolicitudAdopcion;
import vidanimal.infraestructura.persistencia.SolicitudAdopcionRepositorio;

@Repository
public class SolicitudAdopcionPersistenciaAdapter implements SolicitudAdopcionRepositorioPort {

    private final SolicitudAdopcionRepositorio repo;

    public SolicitudAdopcionPersistenciaAdapter(SolicitudAdopcionRepositorio repo) {
        this.repo = repo;
    }

    @Override
    public SolicitudAdopcion guardar(SolicitudAdopcion solicitud) {
        return repo.save(solicitud);
    }

    @Override
    public Optional<SolicitudAdopcion> buscarPorId(Long id) {
        return repo.findById(id);
    }

    @Override
    public List<SolicitudAdopcion> buscarTodasOrdenadas() {
        return repo.findAllByOrderByFechaSolicitudDesc();
    }
}