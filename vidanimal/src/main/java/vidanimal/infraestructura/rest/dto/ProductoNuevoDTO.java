package vidanimal.infraestructura.rest.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import vidanimal.dominio.modelo.CategoriaProducto;
import vidanimal.dominio.modelo.Producto;

public class ProductoNuevoDTO {

    @NotBlank
    private String nombre;

    private String descripcion;

    @NotNull
    private String categoria; // viene como String para mapear a enum

    @NotNull
    private Integer stock;

    public Producto toDominio() {
        Producto p = new Producto();
        p.setNombre(nombre);
        p.setDescripcion(descripcion);
        p.setCategoria(parseCategoria(categoria));
        p.setStockTotal(stock != null ? stock : 0);
        return p;
    }

    private CategoriaProducto parseCategoria(String categoria) {
        try {
            return CategoriaProducto.valueOf(categoria.trim().toUpperCase());
        } catch (Exception e) {
            throw new RuntimeException("Categoría inválida: " + categoria);
        }
    }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
}