package vidanimal.infraestructura.rest.dto;

import vidanimal.dominio.modelo.Especie;
import vidanimal.dominio.modelo.EstadoAcogida;
import java.util.Map;

public class AcogidaRespuestaDTO {
	private Long id;
	private String nombre;
	private String apellidos;
	private String telefono;
	private String email;
	private String direccion;
	private Especie especie;
	private EstadoAcogida estado;
	private Map<String, String> respuestas;

	public AcogidaRespuestaDTO() {
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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

	public Especie getEspecie() {
		return especie;
	}

	public void setEspecie(Especie especie) {
		this.especie = especie;
	}

	public EstadoAcogida getEstado() {
		return estado;
	}

	public void setEstado(EstadoAcogida estado) {
		this.estado = estado;
	}

	public Map<String, String> getRespuestas() {
		return respuestas;
	}

	public void setRespuestas(Map<String, String> respuestas) {
		this.respuestas = respuestas;
	}
}