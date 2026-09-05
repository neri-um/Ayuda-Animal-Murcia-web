package vidanimal.infraestructura.persistencia.adaptador;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import vidanimal.aplicacion.output.AcogidaRepositorioPort;
import vidanimal.dominio.modelo.Acogida;
import vidanimal.infraestructura.persistencia.AcogidaRepositorio;

@Repository
public class AcogidaPersistenciaAdapter implements AcogidaRepositorioPort {

    private final AcogidaRepositorio repo;

    public AcogidaPersistenciaAdapter(AcogidaRepositorio repo) {
        this.repo = repo;
    }

    @Override
    public Acogida guardar(Acogida acogida) {
        return repo.save(acogida);
    }

    @Override
    public Optional<Acogida> buscarPorId(Long id) {
        return repo.findById(id);
    }

    @Override
    public List<Acogida> buscarTodas() {
        return repo.findAllByOrderByIdAsc();
    }

    @Override
    public void eliminar(Long id) {
        repo.deleteById(id);
    }
}