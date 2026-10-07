package vidanimal.infraestructura.persistencia;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import vidanimal.dominio.modelo.SolicitudVoluntariado;

public interface SolicitudVoluntariadoRepositorio extends JpaRepository<SolicitudVoluntariado, Long> {

    List<SolicitudVoluntariado> findAllByOrderByFechaDescIdDesc();
}