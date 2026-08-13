package vidanimal.dominio.modelo;

import jakarta.persistence.*;

@Entity
@Table(name = "formularios_adopcion")
public class FormularioAdopcion {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String nombre;

	@Enumerated(EnumType.STRING)
	@Column(nullable = true)
	private Especie especie;

	@Column(nullable = true)
	private Boolean cachorro;

	@Column(columnDefinition = "TEXT")
	private String preguntas;

	public FormularioAdopcion() {
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

	public Especie getEspecie() {
		return especie;
	}

	public void setEspecie(Especie especie) {
		this.especie = especie;
	}

	public Boolean getCachorro() {
		return cachorro;
	}

	public void setCachorro(Boolean cachorro) {
		this.cachorro = cachorro;
	}

	public String getPreguntas() {
		return preguntas;
	}

	public void setPreguntas(String preguntas) {
		this.preguntas = preguntas;
	}
}