package vidanimal.dominio.modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Cuestionario de voluntariado (normal o UMU) gestionado desde el dashboard.
 * El contenido de las preguntas se guarda como JSON en {@link #preguntas}.
 */
@Entity
@Table(name = "formularios_voluntariado")
public class FormularioVoluntariado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoColaboracion tipo;

    @Column(columnDefinition = "TEXT")
    private String preguntas;

    public FormularioVoluntariado() {
    }

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

    public TipoColaboracion getTipo() {
        return tipo;
    }

    public void setTipo(TipoColaboracion tipo) {
        this.tipo = tipo;
    }

    public String getPreguntas() {
        return preguntas;
    }

    public void setPreguntas(String preguntas) {
        this.preguntas = preguntas;
    }
}