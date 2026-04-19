package vidanimal.dominio.modelo;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "solicitudes_adopcion")
public class SolicitudAdopcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "animal_id")
    private Animal animal;

    private String nombreAdoptante;
    private String email;
    private String telefono;
    private String dni;
    private LocalDate fechaSolicitud;

    @Enumerated(EnumType.STRING)
    private EstadoSolicitudAdopcion estado = EstadoSolicitudAdopcion.PENDIENTE;

    @Column(columnDefinition = "TEXT")
    private String respuestas;

    public SolicitudAdopcion() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Animal getAnimal() { return animal; }
    public void setAnimal(Animal animal) { this.animal = animal; }

    public Long getAnimalId() { return animal != null ? animal.getId() : null; }

    public String getNombreAdoptante() { return nombreAdoptante; }
    public void setNombreAdoptante(String nombreAdoptante) { this.nombreAdoptante = nombreAdoptante; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getDni() { return dni; }
    public void setDni(String dni) { this.dni = dni; }

    public LocalDate getFechaSolicitud() { return fechaSolicitud; }
    public void setFechaSolicitud(LocalDate fechaSolicitud) { this.fechaSolicitud = fechaSolicitud; }

    public EstadoSolicitudAdopcion getEstado() { return estado; }
    public void setEstado(EstadoSolicitudAdopcion estado) { this.estado = estado; }

    public String getRespuestas() { return respuestas; }
    public void setRespuestas(String respuestas) { this.respuestas = respuestas; }
}
