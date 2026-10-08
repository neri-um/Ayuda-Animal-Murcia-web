package vidanimal.aplicacion.input;

import java.util.List;

import vidanimal.dominio.modelo.EstadoSolicitudVoluntariado;
import vidanimal.dominio.modelo.SolicitudVoluntariado;
import vidanimal.infraestructura.rest.dto.ColaboracionDTO;

public interface SolicitudVoluntariadoUseCase {

    /** Registra la solicitud recibida desde la web pública y avisa por correo a la protectora. */
    SolicitudVoluntariado registrar(ColaboracionDTO dto, String respuestasJson);

    List<SolicitudVoluntariado> listar();

    SolicitudVoluntariado cambiarEstado(Long id, EstadoSolicitudVoluntariado estado, String mensaje);

    /** Fija los créditos CRAU (voluntariado UMU) de una solicitud y su desglose por categoría. */
    SolicitudVoluntariado actualizarCrau(Long id, Integer crau, String crauDetalleJson);

    void eliminar(Long id);
}