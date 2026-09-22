package vidanimal.infraestructura.persistencia.adaptador;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Component;

import vidanimal.aplicacion.output.AuditoriaRepositorioPort;
import vidanimal.dominio.modelo.RegistroAuditoria;
import vidanimal.infraestructura.persistencia.AuditoriaJpaRepository;

@Component
public class AuditoriaPersistenciaAdapter implements AuditoriaRepositorioPort {

    private final AuditoriaJpaRepository jpa;

    public AuditoriaPersistenciaAdapter(AuditoriaJpaRepository jpa) {
        this.jpa = jpa;
    }

    @Override
    public void guardar(RegistroAuditoria registro) {
        jpa.save(registro);
    }

    @Override
    public List<RegistroAuditoria> listar(String seccion, Long usuarioId,
                                          LocalDateTime desde, LocalDateTime hasta) {
        boolean sinSeccion = (seccion == null || seccion.isBlank());
        boolean sinUsuario = (usuarioId == null);
        boolean sinDesde = (desde == null);
        boolean sinHasta = (hasta == null);

        List<RegistroAuditoria> resultado = jpa.findAllByOrderByFechaDesc();
        List<RegistroAuditoria> filtrada = resultado.stream()
                .filter(r -> sinSeccion || seccion.equals(r.getSeccion()))
                .filter(r -> sinUsuario || usuarioId.equals(r.getUsuarioId()))
                .filter(r -> sinDesde || !r.getFecha().isBefore(desde))
                .filter(r -> sinHasta || !r.getFecha().isAfter(hasta))
                .sorted(Comparator.comparing(RegistroAuditoria::getFecha).reversed())
                .toList();
        return filtrada;
    }

    @Override
    public List<RegistroAuditoria> listarTodos() {
        return jpa.findAllByOrderByFechaDesc();
    }
}