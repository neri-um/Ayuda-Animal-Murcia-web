package vidanimal.repositorio;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import vidanimal.modelo.Animal;
import vidanimal.modelo.Especie;
import vidanimal.modelo.Estado;
import vidanimal.modelo.Sexo;
import vidanimal.modelo.Tamanyo;

public interface AnimalRepository extends JpaRepository<Animal, Long> {

    List<Animal> findAllByOrderByNombre();

    List<Animal> findByEspecieOrderByNombre(Especie especie);

    List<Animal> findByEstadoOrderByNombre(Estado estado);

    List<Animal> findByEspecieAndEstadoOrderByNombre(Especie especie, Estado estado);

    List<Animal> findByNombreContainingIgnoreCaseOrderByNombre(String nombre);

    List<Animal> findByTamanyoOrderByNombre(Tamanyo tamanyo);

    List<Animal> findBySexoOrderByNombre(Sexo sexo);

    List<Animal> findByFechaNacimientoBetweenOrderByFechaNacimiento(LocalDate desde, LocalDate hasta);

    List<Animal> findByFechaIngresoBetweenOrderByFechaIngresoAsc(LocalDate desde, LocalDate hasta);

    List<Animal> findByResponsableIdOrderByNombre(Long responsableId);
}