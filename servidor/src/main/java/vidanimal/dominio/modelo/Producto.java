package vidanimal.dominio.modelo;

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
}