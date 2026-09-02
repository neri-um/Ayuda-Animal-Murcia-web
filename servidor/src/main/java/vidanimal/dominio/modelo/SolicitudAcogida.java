package vidanimal.dominio.modelo;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "solicitudes_acogida")
public class SolicitudAcogida {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "acogida_id")
    private Acogida acogida;

    @ManyToOne
    @JoinColumn(name = "animal_id")
    private Animal animal;

    private String nombreAcogida;
    private String email;
    private String telefono;
    private String dni;
    private LocalDate fechaSolicitud;

    @Enumerated(EnumType.STRING)
    private EstadoSolicitudCuestionario estado = EstadoSolicitudCuestionario.PENDIENTE;

    @Column(columnDefinition = "TEXT")
    private String respuestas;

    public SolicitudAcogida() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Animal getAnimal() { return animal; }
    public void setAnimal(Animal animal) { this.animal = animal; }

    public Long getAnimalId() { return animal != null ? animal.getId() : null; }

    public Acogida getAcogida() { return acogida; }
    public void setAcogida(Acogida acogida) { this.acogida = acogida; }

    public String getNombreAcogida() { return nombreAcogida; }
    public void setNombreAcogida(String nombreAcogida) { this.nombreAcogida = nombreAcogida; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getDni() { return dni; }
    public void setDni(String dni) { this.dni = dni; }

    public LocalDate getFechaSolicitud() { return fechaSolicitud; }
    public void setFechaSolicitud(LocalDate fechaSolicitud) { this.fechaSolicitud = fechaSolicitud; }

    public EstadoSolicitudCuestionario getEstado() { return estado; }
    public void setEstado(EstadoSolicitudCuestionario estado) { this.estado = estado; }

    public String getRespuestas() { return respuestas; }
    public void setRespuestas(String respuestas) { this.respuestas = respuestas; }
}
