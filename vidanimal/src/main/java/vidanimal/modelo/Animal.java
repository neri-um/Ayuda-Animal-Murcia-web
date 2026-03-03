package vidanimal.modelo;

import java.time.LocalDate;
import java.util.LinkedList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class Animal {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String nombre;

	private LocalDate fechaNacimiento;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Especie especie;

	private LocalDate fechaIngreso;

	@Column(length = 1000)
	private String descripcion;

	@Enumerated(EnumType.STRING)
	private Sexo sexo;

	@Enumerated(EnumType.STRING)
	private Tamanyo tamanyo;

	private String fotoUrl;

	private boolean esterilizado = false;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Estado estado = Estado.EN_ADOPCION;

	@OneToMany(mappedBy = "animal", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<CitaVeterinaria> citas = new LinkedList<>();

	@ElementCollection
	@Enumerated(EnumType.STRING)
	private List<Tratamiento> protocolo = new LinkedList<>();

	@ManyToOne
	@JoinColumn(name = "responsable_id")
	private Usuario responsable;

	public Animal() {
	}

	public Animal(Especie especie, String nombre, LocalDate fechaNacimiento, LocalDate fechaIngreso) {
		this.especie = especie;
		this.nombre = nombre;
		this.fechaNacimiento = fechaNacimiento;
		this.fechaIngreso = fechaIngreso;
	}

	// --- Getters y Setters ---

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

	public LocalDate getFechaNacimiento() {
		return fechaNacimiento;
	}

	public void setFechaNacimiento(LocalDate fechaNacimiento) {
		this.fechaNacimiento = fechaNacimiento;
	}

	public Especie getEspecie() {
		return especie;
	}

	public void setEspecie(Especie especie) {
		this.especie = especie;
	}

	public LocalDate getFechaIngreso() {
		return fechaIngreso;
	}

	public void setFechaIngreso(LocalDate fechaIngreso) {
		this.fechaIngreso = fechaIngreso;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public Sexo getSexo() {
		return sexo;
	}

	public void setSexo(Sexo sexo) {
		this.sexo = sexo;
	}

	public Tamanyo getTamanyo() {
		return tamanyo;
	}

	public void setTamanyo(Tamanyo tamanyo) {
		this.tamanyo = tamanyo;
	}

	public String getFotoUrl() {
		return fotoUrl;
	}

	public void setFotoUrl(String fotoUrl) {
		this.fotoUrl = fotoUrl;
	}

	public boolean isEsterilizado() {
		return esterilizado;
	}

	public void setEsterilizado(boolean esterilizado) {
		this.esterilizado = esterilizado;
	}

	public Estado getEstado() {
		return estado;
	}

	public void setEstado(Estado estado) {
		this.estado = estado;
	}

	public List<CitaVeterinaria> getCitas() {
		return citas;
	}

	public void setCitas(List<CitaVeterinaria> citas) {
		this.citas = citas;
	}

	public List<Tratamiento> getProtocolo() {
		return protocolo;
	}

	public void setProtocolo(List<Tratamiento> protocolo) {
		this.protocolo = protocolo;
	}

	public Usuario getResponsable() {
		return responsable;
	}

	public void setResponsable(Usuario responsable) {
		this.responsable = responsable;
	}
}