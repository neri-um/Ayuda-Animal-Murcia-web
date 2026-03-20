package vidanimal.dominio.modelo;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Animal {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Especie especie;

	@Column(nullable = false)
	private String nombre;

	private String descripcion;

	@Enumerated(EnumType.STRING)
	private Sexo sexo;

	@Enumerated(EnumType.STRING)
	private Tamanyo tamanyo;

	private LocalDate fechaNacimiento;
	private LocalDate fechaIngreso;

	@Enumerated(EnumType.STRING)
	private Estado estado = Estado.EN_ADOPCION;

	private String fotoUrl;

	@OneToMany(mappedBy = "animal", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<CitaVeterinaria> protocolo = new ArrayList<>();

	@ManyToOne
	@JoinColumn(name = "responsable_id")
	private Usuario responsable;


	// Constructor vacío (necesario para JPA)
	public Animal() {
	}

	// Getters y Setters
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Especie getEspecie() {
		return especie;
	}

	public void setEspecie(Especie especie) {
		this.especie = especie;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
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

	public LocalDate getFechaNacimiento() {
		return fechaNacimiento;
	}

	public void setFechaNacimiento(LocalDate fechaNacimiento) {
		this.fechaNacimiento = fechaNacimiento;
	}

	public LocalDate getFechaIngreso() {
		return fechaIngreso;
	}

	public void setFechaIngreso(LocalDate fechaIngreso) {
		this.fechaIngreso = fechaIngreso;
	}

	public Estado getEstado() {
		return estado;
	}

	public void setEstado(Estado estado) {
		this.estado = estado;
	}

	public String getFotoUrl() {
		return fotoUrl;
	}

	public void setFotoUrl(String fotoUrl) {
		this.fotoUrl = fotoUrl;
	}

	public List<CitaVeterinaria> getProtocolo() {
		return protocolo;
	}

	public void setProtocolo(List<CitaVeterinaria> protocolo) {
		this.protocolo = protocolo;
	}
	
	public Usuario getResponsable() {
		return responsable;
	}

	public void setResponsable(Usuario responsable) {
		this.responsable = responsable;
	}
}