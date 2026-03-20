package vidanimal.infraestructura.persistencia.adaptador;

import java.util.List;

import org.springframework.stereotype.Component;

import vidanimal.aplicacion.output.CitaVeterinariaRepositorioPort;
import vidanimal.dominio.modelo.CitaVeterinaria;
import vidanimal.infraestructura.persistencia.CitaVeterinariaRepositorio;

@Component
public class CitaVeterinariaPersistenciaAdapter implements CitaVeterinariaRepositorioPort {

    private final CitaVeterinariaRepositorio repo;

    public CitaVeterinariaPersistenciaAdapter(CitaVeterinariaRepositorio repo) {
        this.repo = repo;
    }

    @Override
    public CitaVeterinaria guardar(CitaVeterinaria cita) {
        return repo.save(cita);
    }

    @Override
    public List<CitaVeterinaria> buscarPorAnimalId(Long animalId) {
        return repo.findByAnimalIdOrderByFechaDesc(animalId);
    }
}