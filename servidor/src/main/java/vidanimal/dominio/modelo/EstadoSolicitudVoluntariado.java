package vidanimal.dominio.modelo;

/**
 * Estado de seguimiento de una solicitud de voluntariado. Un voluntario va
 * cambiando de actividad con el tiempo: puede estar pendiente de resolver,
 * activo, inactivo (por ejemplo si deja de responder) o rechazado.
 */
public enum EstadoSolicitudVoluntariado {
    PENDIENTE, ACTIVA, INACTIVA, RECHAZADA
}