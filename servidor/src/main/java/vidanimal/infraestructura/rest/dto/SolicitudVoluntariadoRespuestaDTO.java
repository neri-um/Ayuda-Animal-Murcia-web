package vidanimal.infraestructura.rest.dto;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;

import vidanimal.dominio.modelo.EstadoSolicitudCuestionario;

/**
 * Solicitud de colaboración tal y como se devuelve al dashboard: datos de
 * contacto, estado y respuestas del cuestionario (pregunta → respuesta).
 */
public class SolicitudVoluntariadoRespuestaDTO {

    private Long id;
    private String tipo;
    private String email;
    private String nombre;
    private LocalDate fechaSolicitud;
    private LocalDate fechaDecision;
    private EstadoSolicitudCuestionario estado;
    private String mensajeRespuesta;
    private Integer crau;
    private Map<String, String> respuestas = new LinkedHashMap<>();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public LocalDate getFechaSolicitud() { return fechaSolicitud; }
    public void setFechaSolicitud(LocalDate fechaSolicitud) { this.fechaSolicitud = fechaSolicitud; }

    public LocalDate getFechaDecision() { return fechaDecision; }
    public void setFechaDecision(LocalDate fechaDecision) { this.fechaDecision = fechaDecision; }

    public EstadoSolicitudCuestionario getEstado() { return estado; }
    public void setEstado(EstadoSolicitudCuestionario estado) { this.estado = estado; }

    public String getMensajeRespuesta() { return mensajeRespuesta; }
    public void setMensajeRespuesta(String mensajeRespuesta) { this.mensajeRespuesta = mensajeRespuesta; }

    public Integer getCrau() { return crau; }
    public void setCrau(Integer crau) { this.crau = crau; }

    public Map<String, String> getRespuestas() { return respuestas; }
    public void setRespuestas(Map<String, String> respuestas) {
        this.respuestas = respuestas != null ? respuestas : new LinkedHashMap<>();
    }
}