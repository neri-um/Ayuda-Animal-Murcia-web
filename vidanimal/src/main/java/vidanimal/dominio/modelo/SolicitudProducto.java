package vidanimal.dominio.modelo;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class SolicitudProducto {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "voluntario_id", nullable = false)
	@JsonIgnore 
	private Usuario voluntario; // CU-14: quién solicita

	@ManyToOne
	@JoinColumn(name = "producto_id", nullable = false)
	private Producto producto; // CU-14: qué solicita

	@Column(nullable = false)
	private int cantidad; // CU-14

	private String motivo; // CU-14: para qué lo necesita

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private EstadoSolicitudProducto estado = EstadoSolicitudProducto.PENDIENTE;

	private LocalDateTime fechaSolicitud; // CU-14: automático

	private LocalDateTime fechaDecision; // CU-20: cuando se acepta/rechaza

	@ManyToOne
	@JoinColumn(name = "gestionado_por")
	@JsonIgnore 
	private Usuario encargado; // CU-20: encargado que decide

	// ---- Flujo de devolución (CU-16, CU-22) ----

	private boolean devolucionNotificada = false; // CU-16
	private boolean devolucionConfirmada = false; // CU-22
	private LocalDateTime fechaDevolucion; // CU-22

	public SolicitudProducto() {
	}

	// Expone solo el id del voluntario sin serializar el objeto completo
	public Long getVoluntarioId() {
		return voluntario != null ? voluntario.getId() : null;
	}

	// Expone solo el id del encargado sin serializar el objeto completo
	public Long getEncargadoId() {
		return encargado != null ? encargado.getId() : null;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Usuario getVoluntario() {
		return voluntario;
	}

	public void setVoluntario(Usuario voluntario) {
		this.voluntario = voluntario;
	}

	public Producto getProducto() {
		return producto;
	}

	public void setProducto(Producto producto) {
		this.producto = producto;
	}

	public int getCantidad() {
		return cantidad;
	}

	public void setCantidad(int cantidad) {
		this.cantidad = cantidad;
	}

	public String getMotivo() {
		return motivo;
	}

	public void setMotivo(String motivo) {
		this.motivo = motivo;
	}

	public EstadoSolicitudProducto getEstado() {
		return estado;
	}

	public void setEstado(EstadoSolicitudProducto estado) {
		this.estado = estado;
	}

	public LocalDateTime getFechaSolicitud() {
		return fechaSolicitud;
	}

	public void setFechaSolicitud(LocalDateTime fechaSolicitud) {
		this.fechaSolicitud = fechaSolicitud;
	}

	public Usuario getEncargado() {
		return encargado;
	}

	public void setEncargado(Usuario encargado) {
		this.encargado = encargado;
	}

	public boolean isDevolucionNotificada() {
		return devolucionNotificada;
	}

	public void setDevolucionNotificada(boolean devolucionNotificada) {
		this.devolucionNotificada = devolucionNotificada;
	}

	public boolean isDevolucionConfirmada() {
		return devolucionConfirmada;
	}

	public void setDevolucionConfirmada(boolean devolucionConfirmada) {
		this.devolucionConfirmada = devolucionConfirmada;
	}

	public LocalDateTime getFechaDevolucion() {
		return fechaDevolucion;
	}

	public void setFechaDevolucion(LocalDateTime fechaDevolucion) {
		this.fechaDevolucion = fechaDevolucion;
	}

	public LocalDateTime getFechaDecision() {
		return fechaDecision;
	}

	public void setFechaDecision(LocalDateTime fechaDecision) {
		this.fechaDecision = fechaDecision;
	}

}
