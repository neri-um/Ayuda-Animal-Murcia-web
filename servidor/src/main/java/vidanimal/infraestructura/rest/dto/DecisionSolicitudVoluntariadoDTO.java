package vidanimal.infraestructura.rest.dto;

import vidanimal.dominio.modelo.EstadoSolicitudCuestionario;

/**
 * Decisión del equipo sobre una solicitud de colaboración: estado nuevo
 * (ACEPTADA o RECHAZADA) y mensaje opcional que se envía a la persona.
 */
public class DecisionSolicitudVoluntariadoDTO {

    private EstadoSolicitudCuestionario estado;
    private String mensaje;

    public EstadoSolicitudCuestionario getEstado() { return estado; }
    public void setEstado(EstadoSolicitudCuestionario estado) { this.estado = estado; }

    public String getMensaje() { return mensaje; }
    public void setMensaje(String mensaje) { this.mensaje = mensaje; }
}