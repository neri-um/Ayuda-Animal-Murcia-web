package vidanimal.dominio.modelo;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class AsignacionProducto {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@OneToOne
	@JoinColumn(name = "solicitud_id", nullable = false)
	private SolicitudProducto solicitud;

	private LocalDateTime fechaEntrega = LocalDateTime.now();
	private LocalDateTime fechaDevolucion;

	private boolean devuelto = false;

	@ManyToOne
	@JoinColumn(name = "encargado_confirmacion_id")
	private Usuario encargadoConfirmacion;

	public AsignacionProducto() {
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public SolicitudProducto getSolicitud() {
		return solicitud;
	}

	public void setSolicitud(SolicitudProducto solicitud) {
		this.solicitud = solicitud;
	}

	public LocalDateTime getFechaEntrega() {
		return fechaEntrega;
	}

	public void setFechaEntrega(LocalDateTime fechaEntrega) {
		this.fechaEntrega = fechaEntrega;
	}

	public LocalDateTime getFechaDevolucion() {
		return fechaDevolucion;
	}

	public void setFechaDevolucion(LocalDateTime fechaDevolucion) {
		this.fechaDevolucion = fechaDevolucion;
	}

	public boolean isDevuelto() {
		return devuelto;
	}

	public void setDevuelto(boolean devuelto) {
		this.devuelto = devuelto;
	}

	public Usuario getEncargadoConfirmacion() {
		return encargadoConfirmacion;
	}

	public void setEncargadoConfirmacion(Usuario encargadoConfirmacion) {
		this.encargadoConfirmacion = encargadoConfirmacion;
	}
}