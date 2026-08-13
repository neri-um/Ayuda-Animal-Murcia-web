package vidanimal.infraestructura.persistencia;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import vidanimal.dominio.modelo.EntradaBlog;

public interface EntradaBlogRepositorio extends JpaRepository<EntradaBlog, Long> {

    List<EntradaBlog> findByAnimalIsNullOrderByFechaDescIdDesc();

    List<EntradaBlog> findByAnimalIdOrderByFechaDescIdDesc(Long animalId);
}
