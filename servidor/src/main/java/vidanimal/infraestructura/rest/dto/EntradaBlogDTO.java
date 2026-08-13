package vidanimal.infraestructura.rest.dto;

import java.time.LocalDate;
import java.util.Set;

import vidanimal.dominio.modelo.EntradaBlog;

public class EntradaBlogDTO {

	private Long id;
	private String titulo;
	private String contenido;
	private LocalDate fecha;
	private String imagenUrl;
	private Set<String> etiquetas;
	private Long animalId;
	private String autorNombre;

	public static EntradaBlogDTO fromDominio(EntradaBlog e) {
		EntradaBlogDTO dto = new EntradaBlogDTO();
		dto.id = e.getId();
		dto.titulo = e.getTitulo();
		dto.contenido = e.getContenido();
		dto.fecha = e.getFecha();
		dto.imagenUrl = e.getImagenUrl();
		dto.etiquetas = e.getEtiquetas();
		if (e.getAnimal() != null) {
			dto.animalId = e.getAnimal().getId();
		}
		if (e.getAutor() != null) {
			dto.autorNombre = e.getAutor().getNombre();
		}
		return dto;
	}

	public Long getId() {
		return id;
	}

	public String getTitulo() {
		return titulo;
	}

	public String getContenido() {
		return contenido;
	}

	public LocalDate getFecha() {
		return fecha;
	}

	public String getImagenUrl() {
		return imagenUrl;
	}

	public Set<String> getEtiquetas() {
		return etiquetas;
	}

	public Long getAnimalId() {
		return animalId;
	}

	public String getAutorNombre() {
		return autorNombre;
	}
}
