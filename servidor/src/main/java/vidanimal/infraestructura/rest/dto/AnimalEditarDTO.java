package vidanimal.infraestructura.rest.dto;

import vidanimal.dominio.modelo.Animal;
import vidanimal.dominio.modelo.Especie;
import vidanimal.dominio.modelo.Sexo;
import vidanimal.dominio.modelo.Tamanyo;

import java.util.List;

public class AnimalEditarDTO {

	private String nombre;
	private String raza;
	private String fechaNacimiento;
	private String especie;
	private String fechaIngreso;
	private String descripcion;
	private String sexo;
	private String tamanyo;
	private String fotoUrl;
	private List<String> galeria;
	private boolean vacunado;
	private boolean esterilizado;
	private boolean microchip;
	private boolean compatibleGatos;
	private boolean compatiblePerros;

	public Animal toDominio() {
		Animal a = new Animal();
		a.setNombre(nombre);
		a.setRaza(raza);
		a.setDescripcion(descripcion);
		a.setFotoUrl(fotoUrl);
		a.setGaleria(galeria);
		a.setEspecie(DtoParsers.parseEnum(Especie.class, especie, "especie"));
		a.setSexo(DtoParsers.parseEnum(Sexo.class, sexo, "sexo"));
		a.setTamanyo(DtoParsers.parseEnum(Tamanyo.class, tamanyo, "tamanyo"));
		a.setFechaNacimiento(DtoParsers.parseLocalDate(fechaNacimiento, "fechaNacimiento"));
		a.setFechaIngreso(DtoParsers.parseLocalDate(fechaIngreso, "fechaIngreso"));
		a.setVacunado(vacunado);
		a.setEsterilizado(esterilizado);
		a.setMicrochip(microchip);
		a.setCompatibleGatos(compatibleGatos);
		a.setCompatiblePerros(compatiblePerros);
		return a;
	}

	public String getNombre() { return nombre; }
	public void setNombre(String nombre) { this.nombre = nombre; }

	public String getRaza() { return raza; }
	public void setRaza(String raza) { this.raza = raza; }

	public String getFechaNacimiento() { return fechaNacimiento; }
	public void setFechaNacimiento(String fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }

	public String getEspecie() { return especie; }
	public void setEspecie(String especie) { this.especie = especie; }

	public String getFechaIngreso() { return fechaIngreso; }
	public void setFechaIngreso(String fechaIngreso) { this.fechaIngreso = fechaIngreso; }

	public String getDescripcion() { return descripcion; }
	public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

	public String getSexo() { return sexo; }
	public void setSexo(String sexo) { this.sexo = sexo; }

	public String getTamanyo() { return tamanyo; }
	public void setTamanyo(String tamanyo) { this.tamanyo = tamanyo; }

	public String getFotoUrl() { return fotoUrl; }
	public void setFotoUrl(String fotoUrl) { this.fotoUrl = fotoUrl; }

	public List<String> getGaleria() { return galeria; }
	public void setGaleria(List<String> galeria) { this.galeria = galeria; }

	public boolean isVacunado() { return vacunado; }
	public void setVacunado(boolean vacunado) { this.vacunado = vacunado; }

	public boolean isEsterilizado() { return esterilizado; }
	public void setEsterilizado(boolean esterilizado) { this.esterilizado = esterilizado; }

	public boolean isMicrochip() { return microchip; }
	public void setMicrochip(boolean microchip) { this.microchip = microchip; }

	public boolean isCompatibleGatos() { return compatibleGatos; }
	public void setCompatibleGatos(boolean compatibleGatos) { this.compatibleGatos = compatibleGatos; }

	public boolean isCompatiblePerros() { return compatiblePerros; }
	public void setCompatiblePerros(boolean compatiblePerros) { this.compatiblePerros = compatiblePerros; }
}
