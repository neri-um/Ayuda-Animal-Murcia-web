package vidanimal.infraestructura.rest.dto;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import vidanimal.dominio.modelo.EntradaBlog;

public class EntradaBlogNuevaDTO {

	private String titulo;
	private String contenido;
	private String fecha;
	private String imagenUrl;
	private List<String> galeria;
	private Set<String> etiquetas;
	private Long animalId;

	public EntradaBlog toDominio() {
		EntradaBlog entrada = new EntradaBlog();
		entrada.setTitulo(titulo);
		entrada.setContenido(contenido);
		entrada.setFecha(DtoParsers.parseLocalDate(fecha, "fecha"));
		entrada.setImagenUrl(imagenUrl);
		entrada.setGaleria(galeria != null ? galeria : new ArrayList<>());
		entrada.setEtiquetas(etiquetas != null ? etiquetas : new HashSet<>());
		return entrada;
	}

	public String getTitulo() {
		return titulo;
	}

	public void setTitulo(String titulo) {
		this.titulo = titulo;
	}

	public String getContenido() {
		return contenido;
	}

	public void setContenido(String contenido) {
		this.contenido = contenido;
	}

	public String getFecha() {
		return fecha;
	}

	public void setFecha(String fecha) {
		this.fecha = fecha;
	}

	public String getImagenUrl() {
		return imagenUrl;
	}

	public void setImagenUrl(String imagenUrl) {
		this.imagenUrl = imagenUrl;
	}

	public List<String> getGaleria() {
		return galeria;
	}

	public void setGaleria(List<String> galeria) {
		this.galeria = galeria;
	}

	public Set<String> getEtiquetas() {
		return etiquetas;
	}

	public void setEtiquetas(Set<String> etiquetas) {
		this.etiquetas = etiquetas;
	}

	public Long getAnimalId() {
		return animalId;
	}

	public void setAnimalId(Long animalId) {
		this.animalId = animalId;
	}
}
