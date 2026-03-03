package vidanimal.repositorio;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import vidanimal.modelo.CitaVeterinaria;

public interface CitaVeterinariaRepository extends JpaRepository<CitaVeterinaria, Long> {

    List<CitaVeterinaria> findByAnimalIdOrderByFechaDesc(Long animalId);
}