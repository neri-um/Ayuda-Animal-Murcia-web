package vidanimal.dominio.modelo;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Solicitud de colaboración (voluntariado, voluntariado UMU o casa de acogida)
 * recibida desde la página pública "Colaborar". Antes solo se enviaba por
 * correo; ahora queda registrada para poder gestionarla desde el Dashboard.
 */
@Entity
@Table(name = "solicitudes_voluntariado")
public class SolicitudVoluntariado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoColaboracion tipo;

    @Column(nullable = false)
    private String email;

    private String nombre;

    private LocalDate fecha;

    private LocalDate fechaDecision;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoSolicitudCuestionario estado = EstadoSolicitudCuestionario.PENDIENTE;

    @Column(columnDefinition = "TEXT")
    private String respuestas;

    @Column(columnDefinition = "TEXT")
    private String mensajeRespuesta;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TipoColaboracion getTipo() {
        return tipo;
    }

    public void setTipo(TipoColaboracion tipo) {
        this.tipo = tipo;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public LocalDate getFechaDecision() {
        return fechaDecision;
    }

    public void setFechaDecision(LocalDate fechaDecision) {
        this.fechaDecision = fechaDecision;
    }

    public EstadoSolicitudCuestionario getEstado() {
        return estado;
    }

    public void setEstado(EstadoSolicitudCuestionario estado) {
        this.estado = estado;
    }

    public String getRespuestas() {
        return respuestas;
    }

    public void setRespuestas(String respuestas) {
        this.respuestas = respuestas;
    }

    public String getMensajeRespuesta() {
        return mensajeRespuesta;
    }

    public void setMensajeRespuesta(String mensajeRespuesta) {
        this.mensajeRespuesta = mensajeRespuesta;
    }
}