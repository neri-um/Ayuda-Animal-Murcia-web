package vidanimal.infraestructura.rest.dto;

import java.util.Map;

public class SolicitudAdopcionDTO {
	private Long animalId;
	private String nombreAdoptante;
	private String email;
	private String telefono;
	private String dni;
	private Map<String, String> respuestas;

	public SolicitudAdopcionDTO() {
	}

	public Long getAnimalId() {
		return animalId;
	}

	public void setAnimalId(Long animalId) {
		this.animalId = animalId;
	}

	public String getNombreAdoptante() {
		return nombreAdoptante;
	}

	public void setNombreAdoptante(String nombreAdoptante) {
		this.nombreAdoptante = nombreAdoptante;
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

	public Map<String, String> getRespuestas() {
		return respuestas;
	}

	public void setRespuestas(Map<String, String> respuestas) {
		this.respuestas = respuestas;
	}
}
