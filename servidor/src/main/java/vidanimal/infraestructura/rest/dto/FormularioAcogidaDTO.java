package vidanimal.infraestructura.rest.dto;

public class FormularioAcogidaDTO {
	private Long id;
	private String nombre;
	private String especie;
	private Object preguntas;

	public FormularioAcogidaDTO() {
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

	public String getEspecie() {
		return especie;
	}

	public void setEspecie(String especie) {
		this.especie = especie;
	}

	public Object getPreguntas() {
		return preguntas;
	}

	public void setPreguntas(Object preguntas) {
		this.preguntas = preguntas;
	}
}
