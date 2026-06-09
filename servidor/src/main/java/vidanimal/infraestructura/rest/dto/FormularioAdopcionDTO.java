package vidanimal.infraestructura.rest.dto;

public class FormularioAdopcionDTO {
	private Long id;
	private String nombre;
	private String especie;
	private Boolean cachorro;
	private Object preguntas;

	public FormularioAdopcionDTO() {
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

	public Boolean getCachorro() {
		return cachorro;
	}

	public void setCachorro(Boolean cachorro) {
		this.cachorro = cachorro;
	}

	public Object getPreguntas() {
		return preguntas;
	}

	public void setPreguntas(Object preguntas) {
		this.preguntas = preguntas;
	}
}
