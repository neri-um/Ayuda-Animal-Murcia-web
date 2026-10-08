package vidanimal.infraestructura.rest.dto;

public class FormularioVoluntariadoDTO {
    private Long id;
    private String nombre;
    private String tipo;
    private Object preguntas;

    public FormularioVoluntariadoDTO() {
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

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Object getPreguntas() {
        return preguntas;
    }

    public void setPreguntas(Object preguntas) {
        this.preguntas = preguntas;
    }
}