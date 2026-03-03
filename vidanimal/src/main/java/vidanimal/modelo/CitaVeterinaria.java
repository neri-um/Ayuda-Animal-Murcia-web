package vidanimal.modelo;

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

@Entity
public class CitaVeterinaria {

    public static final String VETERINARIO_ASOCIADO = "Veterinario Mimos - Zarandona";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "animal_id", nullable = false)
    private Animal animal;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Tratamiento tratamiento;

    @Column(nullable = false)
    private String descripcion;

    @Column(nullable = false)
    private LocalDate fecha;

    private String veterinario;


    public CitaVeterinaria() {
    }

    public CitaVeterinaria(Animal animal, LocalDate fecha, Tratamiento tratamiento, String descripcion) {
        this.animal = animal;
        this.fecha = fecha;
        this.tratamiento = tratamiento;
        this.descripcion = descripcion;
        this.veterinario = VETERINARIO_ASOCIADO;
    }

    public CitaVeterinaria(Animal animal, LocalDate fecha, Tratamiento tratamiento, 
                            String descripcion, String veterinario) {
        this.animal = animal;
        this.fecha = fecha;
        this.tratamiento = tratamiento;
        this.descripcion = descripcion;
        this.veterinario = veterinario;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Animal getAnimal() { return animal; }
    public void setAnimal(Animal animal) { this.animal = animal; }

    public Tratamiento getTratamiento() { return tratamiento; }
    public void setTratamiento(Tratamiento tratamiento) { this.tratamiento = tratamiento; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }

    public String getVeterinario() { return veterinario; }
    public void setVeterinario(String veterinario) { this.veterinario = veterinario; }

    @Override
    public String toString() {
        return "CitaVeterinaria [id=" + id + 
               ", animalId=" + (animal != null ? animal.getId() : null) + 
               ", tratamiento=" + tratamiento + 
               ", descripcion=" + descripcion + 
               ", fecha=" + fecha + 
               ", veterinario=" + veterinario + "]";
    }
}
