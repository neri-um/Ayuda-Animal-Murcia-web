package vidanimal.aplicacion.output;

import java.util.List;
import java.util.Optional;

import vidanimal.dominio.modelo.SolicitudVoluntariado;

public interface SolicitudVoluntariadoRepositorioPort {

    SolicitudVoluntariado guardar(SolicitudVoluntariado solicitud);

    Optional<SolicitudVoluntariado> buscarPorId(Long id);

    List<SolicitudVoluntariado> buscarTodasOrdenadas();

    void eliminar(Long id);
}