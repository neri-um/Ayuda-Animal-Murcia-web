package vidanimal.infraestructura.rest.dto;

import vidanimal.dominio.modelo.Animal;
import vidanimal.dominio.modelo.Especie;
import vidanimal.dominio.modelo.Sexo;
import vidanimal.dominio.modelo.Tamanyo;

public class AnimalNuevoDTO {

	private String especie;
	private String nombre;
	private String descripcion;
	private String sexo;
	private String tamanyo;
	private String fechaNacimiento; // "YYYY-MM-DD"
	private String fechaIngreso; // "YYYY-MM-DD"
	private String fotoUrl;

	public Animal toDominio() {
		Animal animal = new Animal();
		animal.setEspecie(DtoParsers.parseEnum(Especie.class, especie, "especie"));
		animal.setNombre(nombre);
		animal.setDescripcion(descripcion);
		animal.setSexo(DtoParsers.parseEnum(Sexo.class, sexo, "sexo"));
		animal.setTamanyo(DtoParsers.parseEnum(Tamanyo.class, tamanyo, "tamanyo"));
		animal.setFechaNacimiento(DtoParsers.parseLocalDate(fechaNacimiento, "fechaNacimiento"));
		animal.setFechaIngreso(DtoParsers.parseLocalDate(fechaIngreso, "fechaIngreso"));
		animal.setFotoUrl(fotoUrl);
		return animal;
	}

	public String getEspecie() {
		return especie;
	}

	public void setEspecie(String especie) {
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

	public String getSexo() {
		return sexo;
	}

	public void setSexo(String sexo) {
		this.sexo = sexo;
	}

	public String getTamanyo() {
		return tamanyo;
	}

	public void setTamanyo(String tamanyo) {
		this.tamanyo = tamanyo;
	}

	public String getFechaNacimiento() {
		return fechaNacimiento;
	}

	public void setFechaNacimiento(String fechaNacimiento) {
		this.fechaNacimiento = fechaNacimiento;
	}

	public String getFechaIngreso() {
		return fechaIngreso;
	}

	public void setFechaIngreso(String fechaIngreso) {
		this.fechaIngreso = fechaIngreso;
	}

	public String getFotoUrl() {
		return fotoUrl;
	}

	public void setFotoUrl(String fotoUrl) {
		this.fotoUrl = fotoUrl;
	}
}