package vidanimal.dominio.modelo;

import java.util.LinkedList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;

@Entity
public class Acogida {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String nombre;

    @Column(nullable = false)
	private String apellidos;

    @Column(nullable = false)
	private String telefono;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
	private String direccion;

    @Enumerated(EnumType.STRING)
	private Especie especie;

	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	private EstadoAcogida estado = EstadoAcogida.PENDIENTE;

	@OneToMany(mappedBy = "acogida")
	@JsonIgnore
	private List<Animal> animalesEnAcogida = new LinkedList<>();

    @OneToOne(mappedBy = "acogida", cascade = CascadeType.ALL)
    private SolicitudAcogida solicitud;

    public Acogida() {
    }

    public Acogida(String nombre, String apellidos, String telefono, String email, String direccion, Especie especie) {
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.telefono = telefono;
        this.email = email;
        this.direccion = direccion;
        this.especie = especie;
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getApellidos() {
        return apellidos;
    }

    public String getTelefono() {
        return telefono;
    }

    public String getDireccion() {
        return direccion;
    }

    public Especie getEspecie() {
        return especie;
    }

    public EstadoAcogida getEstado() {
        return estado;
    }

    public List<Animal> getAnimalesEnAcogida() {
        return animalesEnAcogida;
    }

    public String getEmail() {
        return email;
    }

    public SolicitudAcogida getSolicitud() {
        return solicitud;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public void setEspecie(Especie especie) {
        this.especie = especie;
    }

    public void setEstado(EstadoAcogida estado) {
        this.estado = estado;
    }

    public void setAnimalesEnAcogida(List<Animal> animalesEnAcogida) {
        this.animalesEnAcogida = animalesEnAcogida;
    }

    public void setSolicitud(SolicitudAcogida solicitud) {
        this.solicitud = solicitud;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    
}