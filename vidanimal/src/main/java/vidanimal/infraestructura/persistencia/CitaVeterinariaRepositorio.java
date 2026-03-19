package vidanimal.infraestructura.persistencia;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import vidanimal.dominio.modelo.CitaVeterinaria;
import vidanimal.dominio.modelo.Tratamiento;

public interface CitaVeterinariaRepositorio extends JpaRepository<CitaVeterinaria, Long> {

    List<CitaVeterinaria> findByAnimalIdOrderByFechaDesc(Long animalId);

    List<CitaVeterinaria> findByAnimalIdAndTratamientoOrderByFechaDesc(Long animalId, Tratamiento tratamiento);

    List<CitaVeterinaria> findByFechaBetweenOrderByFechaAsc(LocalDate desde, LocalDate hasta);

    List<CitaVeterinaria> findByCompletadaFalseOrderByFechaAsc();
}