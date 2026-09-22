package vidanimal.dominio.modelo;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Registro de auditoría: guarda quién hizo qué en cada sección del panel.
 * Solo se consulta por usuarios ADMIN.
 */
@Entity
@Table(name = "registro_auditoria")
public class RegistroAuditoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "usuario_id")
    private Long usuarioId;

    @Column(name = "usuario_login", length = 100)
    private String usuarioLogin;

    @Column(name = "usuario_nombre", length = 200)
    private String usuarioNombre;

    @Column(name = "seccion", length = 50)
    private String seccion;

    @Column(name = "accion", length = 50)
    private String accion;

    @Column(name = "entidad_id", length = 50)
    private String entidadId;

    @Column(name = "detalle", length = 500)
    private String detalle;

    @Column(name = "fecha")
    private LocalDateTime fecha;

    public RegistroAuditoria() {}

    public RegistroAuditoria(Long usuarioId, String usuarioLogin, String usuarioNombre,
                             String seccion, String accion, String entidadId, String detalle) {
        this.usuarioId = usuarioId;
        this.usuarioLogin = usuarioLogin;
        this.usuarioNombre = usuarioNombre;
        this.seccion = seccion;
        this.accion = accion;
        this.entidadId = entidadId;
        this.detalle = detalle;
        this.fecha = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

    public String getUsuarioLogin() { return usuarioLogin; }
    public void setUsuarioLogin(String usuarioLogin) { this.usuarioLogin = usuarioLogin; }

    public String getUsuarioNombre() { return usuarioNombre; }
    public void setUsuarioNombre(String usuarioNombre) { this.usuarioNombre = usuarioNombre; }

    public String getSeccion() { return seccion; }
    public void setSeccion(String seccion) { this.seccion = seccion; }

    public String getAccion() { return accion; }
    public void setAccion(String accion) { this.accion = accion; }

    public String getEntidadId() { return entidadId; }
    public void setEntidadId(String entidadId) { this.entidadId = entidadId; }

    public String getDetalle() { return detalle; }
    public void setDetalle(String detalle) { this.detalle = detalle; }

    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }
}