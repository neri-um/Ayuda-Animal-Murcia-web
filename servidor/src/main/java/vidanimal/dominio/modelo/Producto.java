package vidanimal.dominio.modelo;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDate;
import jakarta.persistence.*;

@Entity
public class Producto {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String nombre;

	private String descripcion;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private CategoriaProducto categoria;

	@Column(nullable = false)
	private int stockTotal;

	@Column(nullable = false)
	private int stockDisponible;

	@Column(name = "para_perro", nullable = false, columnDefinition = "boolean default false")
	private boolean paraPerro;

	@Column(name = "para_gato", nullable = false, columnDefinition = "boolean default false")
	private boolean paraGato;

	@Column(name = "stock_minimo", nullable = false, columnDefinition = "int default 0")
	private int stockMinimo;

	@Column(name = "fecha_caducidad")
	private LocalDate fechaCaducidad;

	@Column(name = "reservado_cer", nullable = false, columnDefinition = "boolean default false")
	private boolean reservadoCer;

	/** Solo para ALIMENTACION: SECO (sólido) o HUMEDO. */
	@Column(name = "tipo_alimento")
	private String tipoAlimento;

	/** Solo para ALIMENTACION: ADULTO o CACHORRO (para gatos se muestra como Kitten). */
	@Column(name = "etapa_alimento")
	private String etapaAlimento;

	/** Solo para ALIMENTACION: alimento de dieta (gastrointestinal, etc.). */
	@Column(name = "es_dieta", nullable = false, columnDefinition = "boolean default false")
	private boolean esDieta;

	@Column(name = "abierto", nullable = false, columnDefinition = "boolean default false")
	private boolean abierto;

	public Producto() {
	}

	public Producto(String nombre, String descripcion, CategoriaProducto categoria, int stockTotal) {
		this.nombre = nombre;
		this.descripcion = descripcion;
		this.categoria = categoria;
		this.stockTotal = stockTotal;
		this.stockDisponible = stockTotal;
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

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public CategoriaProducto getCategoria() {
		return categoria;
	}

	public void setCategoria(CategoriaProducto categoria) {
		this.categoria = categoria;
	}

	public int getStockTotal() {
		return stockTotal;
	}

	public void setStockTotal(int stockTotal) {
		this.stockTotal = stockTotal;
	}

	public int getStockDisponible() {
		return stockDisponible;
	}

	public void setStockDisponible(int stockDisponible) {
		this.stockDisponible = stockDisponible;
	}

	@JsonProperty("paraPerro")
	public boolean isParaPerro() { return paraPerro; }
	public void setParaPerro(boolean paraPerro) { this.paraPerro = paraPerro; }

	@JsonProperty("paraGato")
	public boolean isParaGato() { return paraGato; }
	public void setParaGato(boolean paraGato) { this.paraGato = paraGato; }

	@JsonProperty("stockMinimo")
	public int getStockMinimo() { return stockMinimo; }
	public void setStockMinimo(int stockMinimo) { this.stockMinimo = stockMinimo; }

	@JsonProperty("fechaCaducidad")
	public LocalDate getFechaCaducidad() { return fechaCaducidad; }
	public void setFechaCaducidad(LocalDate fechaCaducidad) { this.fechaCaducidad = fechaCaducidad; }

	@JsonProperty("reservadoCer")
	public boolean isReservadoCer() { return reservadoCer; }
	public void setReservadoCer(boolean reservadoCer) { this.reservadoCer = reservadoCer; }

	@JsonProperty("tipoAlimento")
	public String getTipoAlimento() { return tipoAlimento; }
	public void setTipoAlimento(String tipoAlimento) { this.tipoAlimento = tipoAlimento; }

	@JsonProperty("etapaAlimento")
	public String getEtapaAlimento() { return etapaAlimento; }
	public void setEtapaAlimento(String etapaAlimento) { this.etapaAlimento = etapaAlimento; }

	@JsonProperty("esDieta")
	public boolean isEsDieta() { return esDieta; }
	public void setEsDieta(boolean esDieta) { this.esDieta = esDieta; }

	@JsonProperty("abierto")
	public boolean isAbierto() { return abierto; }
	public void setAbierto(boolean abierto) { this.abierto = abierto; }

	@JsonProperty("caducado")
	public boolean isCaducado() {
		return fechaCaducidad != null && fechaCaducidad.isBefore(java.time.LocalDate.now());
	}
}