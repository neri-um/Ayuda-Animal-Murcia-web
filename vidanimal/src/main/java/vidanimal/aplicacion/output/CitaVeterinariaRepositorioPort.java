package vidanimal.aplicacion.output;

import java.util.List;
import vidanimal.dominio.modelo.CitaVeterinaria;

public interface CitaVeterinariaRepositorioPort {
	CitaVeterinaria guardar(CitaVeterinaria cita);

	List<CitaVeterinaria> buscarPorAnimalId(Long animalId);
}
