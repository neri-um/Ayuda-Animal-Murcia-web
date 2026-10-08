package vidanimal.infraestructura.persistencia;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import vidanimal.dominio.modelo.FormularioVoluntariado;
import vidanimal.dominio.modelo.TipoColaboracion;

public interface FormularioVoluntariadoRepositorio extends JpaRepository<FormularioVoluntariado, Long> {

    Optional<FormularioVoluntariado> findFirstByTipoOrderByIdDesc(TipoColaboracion tipo);
}