package vidanimal.aplicacion.servicio;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import vidanimal.aplicacion.output.AuditoriaRepositorioPort;
import vidanimal.dominio.modelo.RegistroAuditoria;

@Service
public class AuditoriaService {

    private final AuditoriaRepositorioPort auditoriaRepo;

    public AuditoriaService(AuditoriaRepositorioPort auditoriaRepo) {
        this.auditoriaRepo = auditoriaRepo;
    }

    public void registrar(Long usuarioId, String usuarioLogin, String usuarioNombre,
                          String seccion, String accion, String entidadId, String detalle) {
        if (usuarioId == null) return;
        auditoriaRepo.guardar(new RegistroAuditoria(
                usuarioId, usuarioLogin, usuarioNombre, seccion, accion, entidadId, detalle));
    }

    public List<RegistroAuditoria> listar(String seccion, Long usuarioId,
                                          LocalDateTime desde, LocalDateTime hasta) {
        boolean hayFiltros = (seccion != null && !seccion.isBlank())
                || usuarioId != null || desde != null || hasta != null;
        if (!hayFiltros) {
            return auditoriaRepo.listarTodos();
        }
        return auditoriaRepo.listar(seccion, usuarioId, desde, hasta);
    }
}