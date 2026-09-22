package vidanimal.infraestructura.persistencia;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import vidanimal.dominio.modelo.RegistroAuditoria;

public interface AuditoriaJpaRepository extends JpaRepository<RegistroAuditoria, Long> {

    List<RegistroAuditoria> findAllByOrderByFechaDesc();

    List<RegistroAuditoria> findBySeccionOrderByFechaDesc(String seccion);

    List<RegistroAuditoria> findByUsuarioIdOrderByFechaDesc(Long usuarioId);

    List<RegistroAuditoria> findByFechaAfterOrderByFechaDesc(LocalDateTime desde);

    List<RegistroAuditoria> findByFechaBeforeOrderByFechaDesc(LocalDateTime hasta);

    List<RegistroAuditoria> findByFechaBetweenOrderByFechaDesc(LocalDateTime desde, LocalDateTime hasta);
}