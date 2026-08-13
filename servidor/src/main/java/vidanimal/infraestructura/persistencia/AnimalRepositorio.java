package vidanimal.infraestructura.persistencia;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import vidanimal.dominio.modelo.Animal;
import vidanimal.dominio.modelo.Especie;
import vidanimal.dominio.modelo.Estado;
import vidanimal.dominio.modelo.Sexo;
import vidanimal.dominio.modelo.Tamanyo;

public interface AnimalRepositorio extends JpaRepository<Animal, Long> {

    List<Animal> findAllByOrderByNombre();

    List<Animal> findAllByOrderByFechaIngresoDescIdDesc();

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