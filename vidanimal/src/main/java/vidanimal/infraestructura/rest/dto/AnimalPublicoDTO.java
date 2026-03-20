package vidanimal.infraestructura.rest.dto;

import vidanimal.dominio.modelo.Animal;
import vidanimal.dominio.modelo.Especie;
import vidanimal.dominio.modelo.Estado;
import vidanimal.dominio.modelo.Sexo;
import vidanimal.dominio.modelo.Tamanyo;

public class AnimalPublicoDTO {

	private Long id;
	private Especie especie;
	private String nombre;
	private String descripcion;
	private Sexo sexo;
	private Tamanyo tamanyo;
	private Estado estado;
	private String fotoUrl;

	public static AnimalPublicoDTO fromDominio(Animal a) {
		AnimalPublicoDTO dto = new AnimalPublicoDTO();
		dto.id = a.getId();
		dto.especie = a.getEspecie();
		dto.nombre = a.getNombre();
		dto.descripcion = a.getDescripcion();
		dto.sexo = a.getSexo();
		dto.tamanyo = a.getTamanyo();
		dto.estado = a.getEstado();
		dto.fotoUrl = a.getFotoUrl();
		return dto;
	}

	public Long getId() {
		return id;
	}

	public Especie getEspecie() {
		return especie;
	}

	public String getNombre() {
		return nombre;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public Sexo getSexo() {
		return sexo;
	}

	public Tamanyo getTamanyo() {
		return tamanyo;
	}

	public Estado getEstado() {
		return estado;
	}

	public String getFotoUrl() {
		return fotoUrl;
	}
}