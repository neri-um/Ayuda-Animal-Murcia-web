package vidanimal.dominio.modelo;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

/**
 * Entrada de blog. Si tiene {@code animal}, es una entrada vinculada a ese
 * animal (aparece en su ficha); si no, es una entrada general (aparece en la
 * página pública de blog).
 */
@Entity
public class EntradaBlog {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String titulo;

	@Column(columnDefinition = "TEXT")
	private String contenido;

	private LocalDate fecha;

	private String imagenUrl;

	@ElementCollection
	@CollectionTable(name = "entrada_blog_galeria", joinColumns = @JoinColumn(name = "entrada_id"))
	@Column(name = "foto_url")
	private List<String> galeria = new ArrayList<>();

	@ElementCollection
	@CollectionTable(name = "entrada_blog_etiquetas", joinColumns = @JoinColumn(name = "entrada_id"))
	@Column(name = "etiqueta")
	private Set<String> etiquetas = new HashSet<>();

	@ManyToOne
	@JoinColumn(name = "animal_id")
	@JsonIgnore
	private Animal animal;

	@ManyToOne
	@JoinColumn(name = "autor_id")
	private Usuario autor;

	public EntradaBlog() {
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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

	public LocalDate getFecha() {
		return fecha;
	}

	public void setFecha(LocalDate fecha) {
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
		this.galeria = galeria != null ? galeria : new ArrayList<>();
	}

	public Set<String> getEtiquetas() {
		return etiquetas;
	}

	public void setEtiquetas(Set<String> etiquetas) {
		this.etiquetas = etiquetas != null ? etiquetas : new HashSet<>();
	}

	public Animal getAnimal() {
		return animal;
	}

	public void setAnimal(Animal animal) {
		this.animal = animal;
	}

	public Usuario getAutor() {
		return autor;
	}

	public void setAutor(Usuario autor) {
		this.autor = autor;
	}
}
