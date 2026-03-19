package vidanimal.infraestructura.rest.dto;

import vidanimal.dominio.modelo.CategoriaProducto;
import vidanimal.dominio.modelo.Producto;

public class ProductoEditarDTO {

    private String nombre;
    private String descripcion;
    private String categoria;
    private Integer stock;

    public Producto toDominio() {
        Producto p = new Producto();
        p.setNombre(nombre);
        p.setDescripcion(descripcion);

        if (categoria != null && !categoria.isBlank()) {
            p.setCategoria(parseCategoria(categoria));
        }

        if (stock != null) {
            p.setStockTotal(stock);
        }

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