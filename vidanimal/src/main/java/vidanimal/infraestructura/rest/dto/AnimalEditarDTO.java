package vidanimal.infraestructura.rest.dto;

import vidanimal.dominio.modelo.Animal;
import vidanimal.dominio.modelo.Especie;
import vidanimal.dominio.modelo.Sexo;
import vidanimal.dominio.modelo.Tamanyo;

public class AnimalEditarDTO {

	private String nombre;
	private String fechaNacimiento;
	private String especie;
	private String fechaIngreso;
	private String descripcion;
	private String sexo;
	private String tamanyo;
	private String fotoUrl;

	public Animal toDominio() {
		Animal a = new Animal();
		a.setNombre(nombre);
		a.setDescripcion(descripcion);
		a.setFotoUrl(fotoUrl);

		a.setEspecie(DtoParsers.parseEnum(Especie.class, especie, "especie"));
		a.setSexo(DtoParsers.parseEnum(Sexo.class, sexo, "sexo"));
		a.setTamanyo(DtoParsers.parseEnum(Tamanyo.class, tamanyo, "tamanyo"));

		a.setFechaNacimiento(DtoParsers.parseLocalDate(fechaNacimiento, "fechaNacimiento"));
		a.setFechaIngreso(DtoParsers.parseLocalDate(fechaIngreso, "fechaIngreso"));

		return a;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getFechaNacimiento() {
		return fechaNacimiento;
	}

	public void setFechaNacimiento(String fechaNacimiento) {
		this.fechaNacimiento = fechaNacimiento;
	}

	public String getEspecie() {
		return especie;
	}

	public void setEspecie(String especie) {
		this.especie = especie;
	}

	public String getFechaIngreso() {
		return fechaIngreso;
	}

	public void setFechaIngreso(String fechaIngreso) {
		this.fechaIngreso = fechaIngreso;
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

	public String getFotoUrl() {
		return fotoUrl;
	}

	public void setFotoUrl(String fotoUrl) {
		this.fotoUrl = fotoUrl;
	}
}