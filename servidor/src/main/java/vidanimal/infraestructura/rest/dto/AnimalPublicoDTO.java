package vidanimal.infraestructura.rest.dto;

import java.time.LocalDate;
import java.util.List;

import vidanimal.dominio.modelo.Animal;
import vidanimal.dominio.modelo.Caracter;
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
	private boolean compatibleGatos;
	private boolean compatiblePerros;
	private boolean compatiblePerrosGrandes;
	private boolean compatiblePerrosPequenos;
	private boolean necesitaMedicacion;
	private boolean necesitaCuidadosEspeciales;
	private boolean necesitaAcogida;
	private boolean positivoLeucemia;
	private boolean positivoInmunodeficiencia;
	private boolean compatibleNinos;
	private boolean puedeVivirPiso;
	private boolean puedeVivirExterior;
	private boolean aptoGatoUnico;
	private boolean necesitaCompaneroFelino;
	private boolean flexibleConvivenciaFelina;
	private boolean adopcionConjunta;
	private List<Caracter> caracter;
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
		dto.compatibleGatos = a.isCompatibleGatos();
		dto.compatiblePerros = a.isCompatiblePerros();
		dto.compatiblePerrosGrandes = a.isCompatiblePerrosGrandes();
		dto.compatiblePerrosPequenos = a.isCompatiblePerrosPequenos();
		dto.necesitaMedicacion = a.isNecesitaMedicacion();
		dto.necesitaCuidadosEspeciales = a.isNecesitaCuidadosEspeciales();
		dto.necesitaAcogida = a.isNecesitaAcogida();
		dto.positivoLeucemia = a.isPositivoLeucemia();
		dto.positivoInmunodeficiencia = a.isPositivoInmunodeficiencia();
		dto.compatibleNinos = a.isCompatibleNinos();
		dto.puedeVivirPiso = a.isPuedeVivirPiso();
		dto.puedeVivirExterior = a.isPuedeVivirExterior();
		dto.aptoGatoUnico = a.isAptoGatoUnico();
		dto.necesitaCompaneroFelino = a.isNecesitaCompaneroFelino();
		dto.flexibleConvivenciaFelina = a.isFlexibleConvivenciaFelina();
		dto.adopcionConjunta = a.isAdopcionConjunta();
		dto.caracter = a.getCaracter();
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

	public boolean isCompatibleGatos() {
		return compatibleGatos;
	}

	public boolean isCompatiblePerros() {
		return compatiblePerros;
	}

	public boolean isCompatiblePerrosGrandes() {
		return compatiblePerrosGrandes;
	}

	public boolean isCompatiblePerrosPequenos() {
		return compatiblePerrosPequenos;
	}

	public boolean isNecesitaMedicacion() {
		return necesitaMedicacion;
	}

	public boolean isNecesitaCuidadosEspeciales() {
		return necesitaCuidadosEspeciales;
	}

	public boolean isNecesitaAcogida() {
		return necesitaAcogida;
	}

	public boolean isPositivoLeucemia() {
		return positivoLeucemia;
	}

	public boolean isPositivoInmunodeficiencia() {
		return positivoInmunodeficiencia;
	}

	public boolean isCompatibleNinos() {
		return compatibleNinos;
	}

	public boolean isPuedeVivirPiso() {
		return puedeVivirPiso;
	}

	public boolean isPuedeVivirExterior() {
		return puedeVivirExterior;
	}

	public boolean isAptoGatoUnico() {
		return aptoGatoUnico;
	}

	public boolean isNecesitaCompaneroFelino() {
		return necesitaCompaneroFelino;
	}

	public boolean isFlexibleConvivenciaFelina() {
		return flexibleConvivenciaFelina;
	}

	public boolean isAdopcionConjunta() {
		return adopcionConjunta;
	}

	public List<Caracter> getCaracter() {
		return caracter;
	}

	public Long getResponsable() {
		return responsable;
	}
}
