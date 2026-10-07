package vidanimal.aplicacion.input;

import java.util.List;

import vidanimal.dominio.modelo.EstadoSolicitudCuestionario;
import vidanimal.dominio.modelo.SolicitudVoluntariado;
import vidanimal.infraestructura.rest.dto.ColaboracionDTO;

public interface SolicitudVoluntariadoUseCase {

    /** Registra la solicitud recibida desde la web pública y avisa por correo a la protectora. */
    SolicitudVoluntariado registrar(ColaboracionDTO dto, String respuestasJson);

    List<SolicitudVoluntariado> listar();

    SolicitudVoluntariado cambiarEstado(Long id, EstadoSolicitudCuestionario estado, String mensaje);

    void eliminar(Long id);
}