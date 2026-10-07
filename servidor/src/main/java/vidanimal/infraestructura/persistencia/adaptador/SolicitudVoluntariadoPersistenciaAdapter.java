package vidanimal.infraestructura.persistencia.adaptador;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import vidanimal.aplicacion.output.SolicitudVoluntariadoRepositorioPort;
import vidanimal.dominio.modelo.SolicitudVoluntariado;
import vidanimal.infraestructura.persistencia.SolicitudVoluntariadoRepositorio;

@Repository
public class SolicitudVoluntariadoPersistenciaAdapter implements SolicitudVoluntariadoRepositorioPort {

    private final SolicitudVoluntariadoRepositorio repo;

    public SolicitudVoluntariadoPersistenciaAdapter(SolicitudVoluntariadoRepositorio repo) {
        this.repo = repo;
    }

    @Override
    public SolicitudVoluntariado guardar(SolicitudVoluntariado solicitud) {
        return repo.save(solicitud);
    }

    @Override
    public Optional<SolicitudVoluntariado> buscarPorId(Long id) {
        return repo.findById(id);
    }

    @Override
    public List<SolicitudVoluntariado> buscarTodasOrdenadas() {
        return repo.findAllByOrderByFechaDescIdDesc();
    }

    @Override
    public void eliminar(Long id) {
        repo.deleteById(id);
    }
}