package vidanimal.dominio.modelo;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class Animal {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Especie especie;

	@Column(nullable = false)
	private String nombre;

	private String raza;

	@Column(columnDefinition = "TEXT")
	private String descripcion;

	@Enumerated(EnumType.STRING)
	private Sexo sexo;

	@Enumerated(EnumType.STRING)
	private Tamanyo tamanyo;

	private LocalDate fechaNacimiento;
	private LocalDate fechaIngreso;

	@Enumerated(EnumType.STRING)
	private Estado estado = Estado.EN_ADOPCION;

	private String fotoUrl;

	@ElementCollection
	@CollectionTable(name = "animal_galeria", joinColumns = @JoinColumn(name = "animal_id"))
	@Column(name = "foto_url")
	private List<String> galeria = new ArrayList<>();

	private boolean vacunado;
	private boolean esterilizado;
	private boolean microchip;
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

	@ElementCollection
	@CollectionTable(name = "animal_caracter", joinColumns = @JoinColumn(name = "animal_id"))
	@Enumerated(EnumType.STRING)
	@Column(name = "caracter")
	private List<Caracter> caracter = new ArrayList<>();

	@JsonManagedReference
	@OneToMany(mappedBy = "animal", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<CitaVeterinaria> protocolo = new ArrayList<>();

	@ManyToOne
	@JoinColumn(name = "responsable_id")
	private Usuario responsable;

	public Animal() {
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Especie getEspecie() {
		return especie;
	}

	public void setEspecie(Especie especie) {
		this.especie = especie;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getRaza() {
		return raza;
	}

	public void setRaza(String raza) {
		this.raza = raza;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public Sexo getSexo() {
		return sexo;
	}

	public void setSexo(Sexo sexo) {
		this.sexo = sexo;
	}

	public Tamanyo getTamanyo() {
		return tamanyo;
	}

	public void setTamanyo(Tamanyo tamanyo) {
		this.tamanyo = tamanyo;
	}

	public LocalDate getFechaNacimiento() {
		return fechaNacimiento;
	}

	public void setFechaNacimiento(LocalDate fechaNacimiento) {
		this.fechaNacimiento = fechaNacimiento;
	}

	public LocalDate getFechaIngreso() {
		return fechaIngreso;
	}

	public void setFechaIngreso(LocalDate fechaIngreso) {
		this.fechaIngreso = fechaIngreso;
	}

	public Estado getEstado() {
		return estado;
	}

	public void setEstado(Estado estado) {
		this.estado = estado;
	}

	public String getFotoUrl() {
		return fotoUrl;
	}

	public void setFotoUrl(String fotoUrl) {
		this.fotoUrl = fotoUrl;
	}

	public List<String> getGaleria() {
		return galeria;
	}

	public void setGaleria(List<String> galeria) {
		this.galeria = galeria != null ? galeria : new ArrayList<>();
	}

	public boolean isVacunado() {
		return vacunado;
	}

	public void setVacunado(boolean vacunado) {
		this.vacunado = vacunado;
	}

	public boolean isEsterilizado() {
		return esterilizado;
	}

	public void setEsterilizado(boolean esterilizado) {
		this.esterilizado = esterilizado;
	}

	public boolean isMicrochip() {
		return microchip;
	}

	public void setMicrochip(boolean microchip) {
		this.microchip = microchip;
	}

	public boolean isCompatibleGatos() {
		return compatibleGatos;
	}

	public void setCompatibleGatos(boolean compatibleGatos) {
		this.compatibleGatos = compatibleGatos;
	}

	public boolean isCompatiblePerros() {
		return compatiblePerros;
	}

	public void setCompatiblePerros(boolean compatiblePerros) {
		this.compatiblePerros = compatiblePerros;
	}

	public boolean isCompatiblePerrosGrandes() {
		return compatiblePerrosGrandes;
	}

	public void setCompatiblePerrosGrandes(boolean compatiblePerrosGrandes) {
		this.compatiblePerrosGrandes = compatiblePerrosGrandes;
	}

	public boolean isCompatiblePerrosPequenos() {
		return compatiblePerrosPequenos;
	}

	public void setCompatiblePerrosPequenos(boolean compatiblePerrosPequenos) {
		this.compatiblePerrosPequenos = compatiblePerrosPequenos;
	}

	public boolean isNecesitaMedicacion() {
		return necesitaMedicacion;
	}

	public void setNecesitaMedicacion(boolean necesitaMedicacion) {
		this.necesitaMedicacion = necesitaMedicacion;
	}

	public boolean isNecesitaCuidadosEspeciales() {
		return necesitaCuidadosEspeciales;
	}

	public void setNecesitaCuidadosEspeciales(boolean necesitaCuidadosEspeciales) {
		this.necesitaCuidadosEspeciales = necesitaCuidadosEspeciales;
	}

	public boolean isNecesitaAcogida() {
		return necesitaAcogida;
	}

	public void setNecesitaAcogida(boolean necesitaAcogida) {
		this.necesitaAcogida = necesitaAcogida;
	}

	public boolean isPositivoLeucemia() {
		return positivoLeucemia;
	}

	public void setPositivoLeucemia(boolean positivoLeucemia) {
		this.positivoLeucemia = positivoLeucemia;
	}

	public boolean isPositivoInmunodeficiencia() {
		return positivoInmunodeficiencia;
	}

	public void setPositivoInmunodeficiencia(boolean positivoInmunodeficiencia) {
		this.positivoInmunodeficiencia = positivoInmunodeficiencia;
	}

	public boolean isCompatibleNinos() {
		return compatibleNinos;
	}

	public void setCompatibleNinos(boolean compatibleNinos) {
		this.compatibleNinos = compatibleNinos;
	}

	public boolean isPuedeVivirPiso() {
		return puedeVivirPiso;
	}

	public void setPuedeVivirPiso(boolean puedeVivirPiso) {
		this.puedeVivirPiso = puedeVivirPiso;
	}

	public boolean isPuedeVivirExterior() {
		return puedeVivirExterior;
	}

	public void setPuedeVivirExterior(boolean puedeVivirExterior) {
		this.puedeVivirExterior = puedeVivirExterior;
	}

	public boolean isAptoGatoUnico() {
		return aptoGatoUnico;
	}

	public void setAptoGatoUnico(boolean aptoGatoUnico) {
		this.aptoGatoUnico = aptoGatoUnico;
	}

	public boolean isNecesitaCompaneroFelino() {
		return necesitaCompaneroFelino;
	}

	public void setNecesitaCompaneroFelino(boolean necesitaCompaneroFelino) {
		this.necesitaCompaneroFelino = necesitaCompaneroFelino;
	}

	public boolean isFlexibleConvivenciaFelina() {
		return flexibleConvivenciaFelina;
	}

	public void setFlexibleConvivenciaFelina(boolean flexibleConvivenciaFelina) {
		this.flexibleConvivenciaFelina = flexibleConvivenciaFelina;
	}

	public boolean isAdopcionConjunta() {
		return adopcionConjunta;
	}

	public void setAdopcionConjunta(boolean adopcionConjunta) {
		this.adopcionConjunta = adopcionConjunta;
	}

	public List<Caracter> getCaracter() {
		return caracter;
	}

	public void setCaracter(List<Caracter> caracter) {
		this.caracter = caracter != null ? caracter : new ArrayList<>();
	}

	public List<CitaVeterinaria> getProtocolo() {
		return protocolo;
	}

	public void setProtocolo(List<CitaVeterinaria> protocolo) {
		this.protocolo = protocolo;
	}

	public Usuario getResponsable() {
		return responsable;
	}

	public void setResponsable(Usuario responsable) {
		this.responsable = responsable;
	}


}
