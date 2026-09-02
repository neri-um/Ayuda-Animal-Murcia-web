package vidanimal.infraestructura.rest.dto;

import vidanimal.dominio.modelo.EstadoSolicitudCuestionario;
import java.time.LocalDate;
import java.util.Map;

public class SolicitudAcogidaRespuestaDTO {
	private Long id;
	private Long animalId;
	private String animalNombre;
	private String nombreAcogida;
	private String email;
	private String telefono;
	private String dni;
	private LocalDate fechaSolicitud;
	private EstadoSolicitudCuestionario estado;
	private Map<String, String> respuestas;

	public SolicitudAcogidaRespuestaDTO() {
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getAnimalId() {
		return animalId;
	}

	public void setAnimalId(Long animalId) {
		this.animalId = animalId;
	}

	public String getAnimalNombre() {
		return animalNombre;
	}

	public void setAnimalNombre(String animalNombre) {
		this.animalNombre = animalNombre;
	}

	public String getNombreAcogida() {
		return nombreAcogida;
	}

	public void setNombreAcogida(String nombreAcogida) {
		this.nombreAcogida = nombreAcogida;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getTelefono() {
		return telefono;
	}

	public void setTelefono(String telefono) {
		this.telefono = telefono;
	}

	public String getDni() {
		return dni;
	}

	public void setDni(String dni) {
		this.dni = dni;
	}

	public LocalDate getFechaSolicitud() {
		return fechaSolicitud;
	}

	public void setFechaSolicitud(LocalDate fechaSolicitud) {
		this.fechaSolicitud = fechaSolicitud;
	}

	public EstadoSolicitudCuestionario getEstado() {
		return estado;
	}

	public void setEstado(EstadoSolicitudCuestionario estado) {
		this.estado = estado;
	}

	public Map<String, String> getRespuestas() {
		return respuestas;
	}

	public void setRespuestas(Map<String, String> respuestas) {
		this.respuestas = respuestas;
	}
}