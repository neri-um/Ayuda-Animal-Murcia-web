package vidanimal.infraestructura.rest.dto;

import vidanimal.dominio.modelo.Animal;
import vidanimal.dominio.modelo.Caracter;
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
	private boolean compatibleGatos;
	private boolean compatiblePerros;
	private boolean compatiblePerrosGrandes;
	private boolean compatiblePerrosPequenos;
	private boolean necesitaMedicacion;
	private boolean necesitaCuidadosEspeciales;
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
		a.setCompatibleGatos(compatibleGatos);
		a.setCompatiblePerros(compatiblePerros);
		a.setCompatiblePerrosGrandes(compatiblePerrosGrandes);
		a.setCompatiblePerrosPequenos(compatiblePerrosPequenos);
		a.setNecesitaMedicacion(necesitaMedicacion);
		a.setNecesitaCuidadosEspeciales(necesitaCuidadosEspeciales);
		a.setPositivoLeucemia(positivoLeucemia);
		a.setPositivoInmunodeficiencia(positivoInmunodeficiencia);
		a.setCompatibleNinos(compatibleNinos);
		a.setPuedeVivirPiso(puedeVivirPiso);
		a.setPuedeVivirExterior(puedeVivirExterior);
		a.setAptoGatoUnico(aptoGatoUnico);
		a.setNecesitaCompaneroFelino(necesitaCompaneroFelino);
		a.setFlexibleConvivenciaFelina(flexibleConvivenciaFelina);
		a.setAdopcionConjunta(adopcionConjunta);
		a.setCaracter(caracter);
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

	public boolean isCompatibleGatos() { return compatibleGatos; }
	public void setCompatibleGatos(boolean compatibleGatos) { this.compatibleGatos = compatibleGatos; }

	public boolean isCompatiblePerros() { return compatiblePerros; }
	public void setCompatiblePerros(boolean compatiblePerros) { this.compatiblePerros = compatiblePerros; }

	public boolean isCompatiblePerrosGrandes() { return compatiblePerrosGrandes; }
	public void setCompatiblePerrosGrandes(boolean compatiblePerrosGrandes) { this.compatiblePerrosGrandes = compatiblePerrosGrandes; }

	public boolean isCompatiblePerrosPequenos() { return compatiblePerrosPequenos; }
	public void setCompatiblePerrosPequenos(boolean compatiblePerrosPequenos) { this.compatiblePerrosPequenos = compatiblePerrosPequenos; }

	public boolean isNecesitaMedicacion() { return necesitaMedicacion; }
	public void setNecesitaMedicacion(boolean necesitaMedicacion) { this.necesitaMedicacion = necesitaMedicacion; }

	public boolean isNecesitaCuidadosEspeciales() { return necesitaCuidadosEspeciales; }
	public void setNecesitaCuidadosEspeciales(boolean necesitaCuidadosEspeciales) { this.necesitaCuidadosEspeciales = necesitaCuidadosEspeciales; }

	public boolean isPositivoLeucemia() { return positivoLeucemia; }
	public void setPositivoLeucemia(boolean positivoLeucemia) { this.positivoLeucemia = positivoLeucemia; }

	public boolean isPositivoInmunodeficiencia() { return positivoInmunodeficiencia; }
	public void setPositivoInmunodeficiencia(boolean positivoInmunodeficiencia) { this.positivoInmunodeficiencia = positivoInmunodeficiencia; }

	public boolean isCompatibleNinos() { return compatibleNinos; }
	public void setCompatibleNinos(boolean compatibleNinos) { this.compatibleNinos = compatibleNinos; }

	public boolean isPuedeVivirPiso() { return puedeVivirPiso; }
	public void setPuedeVivirPiso(boolean puedeVivirPiso) { this.puedeVivirPiso = puedeVivirPiso; }

	public boolean isPuedeVivirExterior() { return puedeVivirExterior; }
	public void setPuedeVivirExterior(boolean puedeVivirExterior) { this.puedeVivirExterior = puedeVivirExterior; }

	public boolean isAptoGatoUnico() { return aptoGatoUnico; }
	public void setAptoGatoUnico(boolean aptoGatoUnico) { this.aptoGatoUnico = aptoGatoUnico; }

	public boolean isNecesitaCompaneroFelino() { return necesitaCompaneroFelino; }
	public void setNecesitaCompaneroFelino(boolean necesitaCompaneroFelino) { this.necesitaCompaneroFelino = necesitaCompaneroFelino; }

	public boolean isFlexibleConvivenciaFelina() { return flexibleConvivenciaFelina; }
	public void setFlexibleConvivenciaFelina(boolean flexibleConvivenciaFelina) { this.flexibleConvivenciaFelina = flexibleConvivenciaFelina; }

	public boolean isAdopcionConjunta() { return adopcionConjunta; }
	public void setAdopcionConjunta(boolean adopcionConjunta) { this.adopcionConjunta = adopcionConjunta; }

	public List<Caracter> getCaracter() { return caracter; }
	public void setCaracter(List<Caracter> caracter) { this.caracter = caracter; }
}
