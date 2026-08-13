package vidanimal.infraestructura.persistencia;

import org.springframework.data.jpa.repository.JpaRepository;
import vidanimal.dominio.modelo.Configuracion;

public interface ConfiguracionJpaRepository extends JpaRepository<Configuracion, String> {}
