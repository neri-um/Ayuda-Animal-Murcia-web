package vidanimal.infraestructura.rest.dto;

import vidanimal.dominio.modelo.EstadoSolicitudVoluntariado;

/**
 * Decisión del equipo sobre una solicitud de colaboración: estado nuevo
 * (PENDIENTE, ACTIVA, INACTIVA o RECHAZADA) y nota interna opcional.
 */
public class DecisionSolicitudVoluntariadoDTO {

    private EstadoSolicitudVoluntariado estado;
    private String mensaje;

    public EstadoSolicitudVoluntariado getEstado() { return estado; }
    public void setEstado(EstadoSolicitudVoluntariado estado) { this.estado = estado; }

    public String getMensaje() { return mensaje; }
    public void setMensaje(String mensaje) { this.mensaje = mensaje; }
}