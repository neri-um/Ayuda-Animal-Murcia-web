package vidanimal.infraestructura.rest.dto;

import java.util.Map;

public class AcogidaDTO {
	private String nombre;
	private String apellidos;
	private String telefono;
	private String email;
	private String direccion;
	private String especie;
	private Map<String, String> respuestas;

	public AcogidaDTO() {
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getApellidos() {
		return apellidos;
	}

	public void setApellidos(String apellidos) {
		this.apellidos = apellidos;
	}

	public String getTelefono() {
		return telefono;
	}

	public void setTelefono(String telefono) {
		this.telefono = telefono;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getDireccion() {
		return direccion;
	}

	public void setDireccion(String direccion) {
		this.direccion = direccion;
	}

	public String getEspecie() {
		return especie;
	}

	public void setEspecie(String especie) {
		this.especie = especie;
	}

	public Map<String, String> getRespuestas() {
		return respuestas;
	}

	public void setRespuestas(Map<String, String> respuestas) {
		this.respuestas = respuestas;
	}
}