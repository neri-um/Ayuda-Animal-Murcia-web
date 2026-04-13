package vidanimal.aplicacion.output;

import java.util.List;
import java.util.Optional;
import vidanimal.dominio.modelo.CitaVeterinaria;

public interface CitaVeterinariaRepositorioPort {
    CitaVeterinaria guardar(CitaVeterinaria cita);
    List<CitaVeterinaria> buscarPorAnimalId(Long animalId);
    Optional<CitaVeterinaria> buscarPorId(Long id);
}
