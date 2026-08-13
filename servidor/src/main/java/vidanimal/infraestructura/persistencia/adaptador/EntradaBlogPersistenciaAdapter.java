package vidanimal.infraestructura.persistencia.adaptador;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import vidanimal.aplicacion.output.EntradaBlogRepositorioPort;
import vidanimal.dominio.modelo.EntradaBlog;
import vidanimal.infraestructura.persistencia.EntradaBlogRepositorio;

@Repository
public class EntradaBlogPersistenciaAdapter implements EntradaBlogRepositorioPort {

    private final EntradaBlogRepositorio repo;

    public EntradaBlogPersistenciaAdapter(EntradaBlogRepositorio repo) {
        this.repo = repo;
    }

    @Override
    public EntradaBlog guardar(EntradaBlog entrada) {
        return repo.save(entrada);
    }

    @Override
    public Optional<EntradaBlog> buscarPorId(Long id) {
        return repo.findById(id);
    }

    @Override
    public List<EntradaBlog> buscarGenerales() {
        return repo.findByAnimalIsNullOrderByFechaDescIdDesc();
    }

    @Override
    public List<EntradaBlog> buscarPorAnimal(Long animalId) {
        return repo.findByAnimalIdOrderByFechaDescIdDesc(animalId);
    }

    @Override
    public void eliminar(EntradaBlog entrada) {
        repo.delete(entrada);
    }
}
