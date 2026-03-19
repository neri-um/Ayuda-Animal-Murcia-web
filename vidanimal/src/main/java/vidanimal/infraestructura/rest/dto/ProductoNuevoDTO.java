package vidanimal.infraestructura.rest.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ProductoNuevoDTO {

	@NotBlank(message = "El nombre es obligatorio")
	private String nombre;

	private String descripcion;

	@NotNull(message = "La categoría es obligatoria")
	private String categoria;

	@Min(value = 0, message = "El stock no puede ser negativo")
	private int stock;

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

	public String getCategoria() {
		return categoria;
	}

	public void setCategoria(String categoria) {
		this.categoria = categoria;
	}

	public int getStock() {
		return stock;
	}

	public void setStock(int stock) {
		this.stock = stock;
	}
}