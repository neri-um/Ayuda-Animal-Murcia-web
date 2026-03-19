package vidanimal.infraestructura.rest.dto;

import vidanimal.dominio.modelo.*;
import java.time.LocalDate;

public class AnimalNuevoDTO {
    private Especie especie;
    private String nombre;
    private String descripcion;
    private Sexo sexo;
    private Tamanyo tamanyo;
    private LocalDate fechaNacimiento;
    private LocalDate fechaIngreso;
    private String fotoUrl;

    public Animal toDominio() {
        Animal animal = new Animal();
        animal.setEspecie(this.especie);
        animal.setNombre(this.nombre);
        animal.setDescripcion(this.descripcion);
        animal.setSexo(this.sexo);
        animal.setTamanyo(this.tamanyo);
        animal.setFechaNacimiento(this.fechaNacimiento);
        animal.setFechaIngreso(this.fechaIngreso);
        animal.setFotoUrl(this.fotoUrl);
        return animal;
    }

    public Especie getEspecie() { return especie; }
    public void setEspecie(Especie especie) { this.especie = especie; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public Sexo getSexo() { return sexo; }
    public void setSexo(Sexo sexo) { this.sexo = sexo; }
    public Tamanyo getTamanyo() { return tamanyo; }
    public void setTamanyo(Tamanyo tamanyo) { this.tamanyo = tamanyo; }
    public LocalDate getFechaNacimiento() { return fechaNacimiento; }
    public void setFechaNacimiento(LocalDate fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }
    public LocalDate getFechaIngreso() { return fechaIngreso; }
    public void setFechaIngreso(LocalDate fechaIngreso) { this.fechaIngreso = fechaIngreso; }
    public String getFotoUrl() { return fotoUrl; }
    public void setFotoUrl(String fotoUrl) { this.fotoUrl = fotoUrl; }
}