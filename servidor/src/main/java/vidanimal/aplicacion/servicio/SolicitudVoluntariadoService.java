package vidanimal.aplicacion.servicio;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import vidanimal.aplicacion.input.SolicitudVoluntariadoUseCase;
import vidanimal.aplicacion.output.SolicitudVoluntariadoRepositorioPort;
import vidanimal.dominio.excepcion.RecursoNoEncontradoException;
import vidanimal.dominio.modelo.EstadoSolicitudCuestionario;
import vidanimal.dominio.modelo.SolicitudVoluntariado;
import vidanimal.dominio.modelo.TipoColaboracion;
import vidanimal.infraestructura.rest.dto.ColaboracionDTO;

/**
 * Gestiona las solicitudes de colaboración (voluntariado, UMU y casa de
 * acogida). Al recibirlas las guarda y avisa por correo a la protectora; al
 * aceptarlas o rechazarlas avisa (de forma asíncrona) a la persona solicitante.
 */
@Service
public class SolicitudVoluntariadoService implements SolicitudVoluntariadoUseCase {

    private static final Logger LOGGER = LoggerFactory.getLogger(SolicitudVoluntariadoService.class);

    private final SolicitudVoluntariadoRepositorioPort repo;
    private final ColaboracionService colaboracionService;

    public SolicitudVoluntariadoService(SolicitudVoluntariadoRepositorioPort repo,
                                        ColaboracionService colaboracionService) {
        this.repo = repo;
        this.colaboracionService = colaboracionService;
    }

    @Override
    public SolicitudVoluntariado registrar(ColaboracionDTO dto, String respuestasJson) {
        if (dto == null || dto.getEmail() == null || dto.getEmail().isBlank()) {
            throw new IllegalArgumentException("El email es obligatorio.");
        }
        if (dto.getRespuestas() == null || dto.getRespuestas().isEmpty()) {
            throw new IllegalArgumentException("El formulario no contiene respuestas.");
        }

        SolicitudVoluntariado solicitud = new SolicitudVoluntariado();
        solicitud.setTipo(TipoColaboracion.desde(dto.getTipo()));
        solicitud.setEmail(dto.getEmail().trim());
        solicitud.setNombre(extraerNombre(dto.getRespuestas()));
        solicitud.setFecha(LocalDate.now());
        solicitud.setEstado(EstadoSolicitudCuestionario.PENDIENTE);
        solicitud.setRespuestas(respuestasJson);

        SolicitudVoluntariado guardada = repo.guardar(solicitud);

        // Aviso por correo a la protectora: mejor esfuerzo, no impide registrar la solicitud.
        try {
            colaboracionService.enviarSolicitud(dto);
        } catch (Exception e) {
            LOGGER.warn("Solicitud de colaboración {} registrada pero no se pudo avisar por correo: {}",
                    guardada.getId(), e.getMessage());
        }

        return guardada;
    }

    @Override
    public List<SolicitudVoluntariado> listar() {
        return repo.buscarTodasOrdenadas();
    }

    @Override
    public SolicitudVoluntariado cambiarEstado(Long id, EstadoSolicitudCuestionario estado, String mensaje) {
        if (estado != EstadoSolicitudCuestionario.ACEPTADA && estado != EstadoSolicitudCuestionario.RECHAZADA) {
            throw new IllegalArgumentException("Solo se puede aceptar o rechazar una solicitud.");
        }

        SolicitudVoluntariado solicitud = repo.buscarPorId(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Solicitud no encontrada: " + id));

        solicitud.setEstado(estado);
        solicitud.setFechaDecision(LocalDate.now());
        solicitud.setMensajeRespuesta(mensaje);
        return repo.guardar(solicitud);
    }

    @Override
    public SolicitudVoluntariado actualizarCrau(Long id, Integer crau, String crauDetalleJson) {
        if (crau != null && crau < 0) {
            throw new IllegalArgumentException("Los CRAU no pueden ser negativos.");
        }
        SolicitudVoluntariado solicitud = repo.buscarPorId(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Solicitud no encontrada: " + id));

        solicitud.setCrau(crau);
        solicitud.setCrauDetalle(crauDetalleJson);
        return repo.guardar(solicitud);
    }

    @Override
    public void eliminar(Long id) {
        if (repo.buscarPorId(id).isEmpty()) {
            throw new RecursoNoEncontradoException("Solicitud no encontrada: " + id);
        }
        repo.eliminar(id);
    }

    private String extraerNombre(Map<String, String> respuestas) {
        if (respuestas == null) return null;
        String nombre = respuestas.get("Nombre");
        if (nombre != null && !nombre.isBlank()) return nombre.trim();

        for (Map.Entry<String, String> entrada : respuestas.entrySet()) {
            if (entrada.getKey() != null
                    && entrada.getKey().toLowerCase().contains("nombre")
                    && entrada.getValue() != null && !entrada.getValue().isBlank()) {
                return entrada.getValue().trim();
            }
        }
        return null;
    }
}