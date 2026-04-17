package vidanimal.infraestructura.persistencia;

import org.springframework.data.jpa.repository.JpaRepository;
import vidanimal.dominio.modelo.Especie;
import vidanimal.dominio.modelo.FormularioAdopcion;
import java.util.Optional;

public interface FormularioAdopcionRepositorio extends JpaRepository<FormularioAdopcion, Long> {
	Optional<FormularioAdopcion> findByEspecieAndCria(Especie especie, Boolean cria);

	Optional<FormularioAdopcion> findByEspecieAndCriaIsNull(Especie especie);

	Optional<FormularioAdopcion> findByEspecieIsNull();
}
