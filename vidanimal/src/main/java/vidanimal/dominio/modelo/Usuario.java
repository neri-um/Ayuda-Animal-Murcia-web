package vidanimal.dominio.modelo;

import java.time.LocalDate;
import java.util.LinkedList;
import java.util.List;

import jakarta.persistence.*;

@Entity
public class Usuario {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true)
	private String email;

	@Column(nullable = false)
	private String password;

	@Column(nullable = false)
	private String nombre;

	private String apellidos;

	private String telefono;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Rol rol;

	private LocalDate fechaAlta;

	@OneToMany(mappedBy = "responsable")
	private List<Animal> animalesACargo = new LinkedList<>();

	@OneToMany(mappedBy = "voluntario")
	private List<SolicitudProducto> solicitudesProducto = new LinkedList<>();

	public Usuario() {
	}

	public Usuario(String email, String password, String nombre, String apellidos, String telefono, Rol rol) {
		this.email = email;
		this.password = password;
		this.nombre = nombre;
		this.apellidos = apellidos;
		this.telefono = telefono;
		this.rol = rol;
		this.fechaAlta = LocalDate.now();
	}

	// --- Getters y Setters ---

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
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

	public Rol getRol() {
		return rol;
	}

	public void setRol(Rol rol) {
		this.rol = rol;
	}

	public LocalDate getFechaAlta() {
		return fechaAlta;
	}

	public void setFechaAlta(LocalDate fechaAlta) {
		this.fechaAlta = fechaAlta;
	}

	public List<Animal> getAnimalesACargo() {
		return animalesACargo;
	}

	public void setAnimalesACargo(List<Animal> animalesACargo) {
		this.animalesACargo = animalesACargo;
	}

	public List<SolicitudProducto> getSolicitudesProducto() {
		return solicitudesProducto;
	}

	public void setSolicitudesProducto(List<SolicitudProducto> solicitudesProducto) {
		this.solicitudesProducto = solicitudesProducto;
	}
}