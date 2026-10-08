package vidanimal.infraestructura.rest.dto;

import java.time.LocalDate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import vidanimal.dominio.modelo.CategoriaProducto;
import vidanimal.dominio.modelo.Producto;

public class ProductoNuevoDTO {

    @NotBlank
    private String nombre;

    private String descripcion;

    @NotNull
    private String categoria;

    @NotNull
    private Integer stock;

    private boolean paraPerro;
    private boolean paraGato;
    private Integer stockMinimo;
    private String fechaCaducidad;
    private boolean reservadoCer;

    public Producto toDominio() {
        int cantidad = stock != null ? stock : 0;
        Producto p = new Producto();
        p.setNombre(nombre);
        p.setDescripcion(descripcion);
        p.setCategoria(parseCategoria(categoria));
        p.setStockTotal(cantidad);
        p.setStockDisponible(cantidad);
        p.setParaPerro(paraPerro);
        p.setParaGato(paraGato);
        p.setStockMinimo(stockMinimo != null ? stockMinimo : 0);
        if (fechaCaducidad != null && !fechaCaducidad.isBlank()) {
            p.setFechaCaducidad(LocalDate.parse(fechaCaducidad));
        }
        p.setReservadoCer(reservadoCer);
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

    public boolean isParaPerro() { return paraPerro; }
    public void setParaPerro(boolean paraPerro) { this.paraPerro = paraPerro; }

    public boolean isParaGato() { return paraGato; }
    public void setParaGato(boolean paraGato) { this.paraGato = paraGato; }

    public Integer getStockMinimo() { return stockMinimo; }
    public void setStockMinimo(Integer stockMinimo) { this.stockMinimo = stockMinimo; }

    public String getFechaCaducidad() { return fechaCaducidad; }
    public void setFechaCaducidad(String fechaCaducidad) { this.fechaCaducidad = fechaCaducidad; }

    public boolean isReservadoCer() { return reservadoCer; }
    public void setReservadoCer(boolean reservadoCer) { this.reservadoCer = reservadoCer; }
}
