package vidanimal.infraestructura.rest.dto;

import java.time.LocalDate;
import java.util.List;

import vidanimal.dominio.modelo.Animal;
import vidanimal.dominio.modelo.Especie;
import vidanimal.dominio.modelo.Estado;
import vidanimal.dominio.modelo.Sexo;
import vidanimal.dominio.modelo.Tamanyo;

public class AnimalPublicoDTO {

	private Long id;
	private Especie especie;
	private String nombre;
	private String raza;
	private String descripcion;
	private Sexo sexo;
	private Tamanyo tamanyo;
	private Estado estado;
	private String fotoUrl;
	private List<String> galeria;
	private LocalDate fechaNacimiento;
	private LocalDate fechaIngreso;
	private boolean vacunado;
	private boolean esterilizado;
	private boolean microchip;
	private boolean compatibleGatos;
	private boolean compatiblePerros;
	private Long responsable;

	public static AnimalPublicoDTO fromDominio(Animal a) {
		AnimalPublicoDTO dto = new AnimalPublicoDTO();
		dto.id = a.getId();
		dto.especie = a.getEspecie();
		dto.nombre = a.getNombre();
		dto.raza = a.getRaza();
		dto.descripcion = a.getDescripcion();
		dto.sexo = a.getSexo();
		dto.tamanyo = a.getTamanyo();
		dto.estado = a.getEstado();
		dto.fotoUrl = a.getFotoUrl();
		dto.galeria = a.getGaleria();
		dto.fechaNacimiento = a.getFechaNacimiento();
		dto.fechaIngreso = a.getFechaIngreso();
		dto.vacunado = a.isVacunado();
		dto.esterilizado = a.isEsterilizado();
		dto.microchip = a.isMicrochip();
		dto.compatibleGatos = a.isCompatibleGatos();
		dto.compatiblePerros = a.isCompatiblePerros();
		if (a.getResponsable() != null) {
			dto.responsable = a.getResponsable().getId();
		}
		return dto;
	}

	public Long getId() {
		return id;
	}

	public Especie getEspecie() {
		return especie;
	}

	public String getNombre() {
		return nombre;
	}

	public String getRaza() {
		return raza;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public Sexo getSexo() {
		return sexo;
	}

	public Tamanyo getTamanyo() {
		return tamanyo;
	}

	public Estado getEstado() {
		return estado;
	}

	public String getFotoUrl() {
		return fotoUrl;
	}

	public List<String> getGaleria() {
		return galeria;
	}

	public LocalDate getFechaNacimiento() {
		return fechaNacimiento;
	}

	public LocalDate getFechaIngreso() {
		return fechaIngreso;
	}

	public boolean isVacunado() {
		return vacunado;
	}

	public boolean isEsterilizado() {
		return esterilizado;
	}

	public boolean isMicrochip() {
		return microchip;
	}

	public boolean isCompatibleGatos() {
		return compatibleGatos;
	}

	public boolean isCompatiblePerros() {
		return compatiblePerros;
	}

	public Long getResponsable() {
		return responsable;
	}
}
