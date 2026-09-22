package vidanimal.aplicacion.output;

import java.time.LocalDateTime;
import java.util.List;

import vidanimal.dominio.modelo.RegistroAuditoria;

public interface AuditoriaRepositorioPort {

    void guardar(RegistroAuditoria registro);

    List<RegistroAuditoria> listar(String seccion, Long usuarioId,
                                   LocalDateTime desde, LocalDateTime hasta);

    List<RegistroAuditoria> listarTodos();
}