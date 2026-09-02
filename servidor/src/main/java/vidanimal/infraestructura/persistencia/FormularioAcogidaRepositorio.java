package vidanimal.infraestructura.persistencia;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import vidanimal.dominio.modelo.FormularioAcogida;

public interface FormularioAcogidaRepositorio extends JpaRepository<FormularioAcogida, Long> {
	Optional<FormularioAcogida> findByEspecieIsNull();
}
