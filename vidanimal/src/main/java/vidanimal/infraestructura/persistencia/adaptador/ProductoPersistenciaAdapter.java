package vidanimal.infraestructura.persistencia.adaptador;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import vidanimal.aplicacion.output.ProductoRepositorioPort;
import vidanimal.dominio.modelo.CategoriaProducto;
import vidanimal.dominio.modelo.Producto;
import vidanimal.infraestructura.persistencia.ProductoRepositorio;

@Repository
public class ProductoPersistenciaAdapter implements ProductoRepositorioPort {

    private final ProductoRepositorio jpa;

    public ProductoPersistenciaAdapter(ProductoRepositorio jpa) {
        this.jpa = jpa;
    }

    @Override
    public Producto guardar(Producto producto) {
        return jpa.save(producto);
    }

    @Override
    public Optional<Producto> buscarPorId(Long id) {
        return jpa.findById(id);
    }

    @Override
    public void eliminar(Producto producto) {
        jpa.delete(producto);
    }

    @Override
    public List<Producto> buscarTodosOrdenados() {
        return jpa.findAllByOrderByNombre();
    }

    @Override
    public List<Producto> buscarPorCategoria(CategoriaProducto categoria) {
        return jpa.findByCategoriaOrderByNombre(categoria);
    }

    @Override
    public List<Producto> buscarPorNombre(String nombre) {
        return jpa.findByNombreContainingIgnoreCaseOrderByNombre(nombre);
    }

    @Override
    public List<Producto> buscarConStockMenorQue(int cantidad) {
        return jpa.findByStockLessThanOrderByStockTotalAsc(cantidad);
    }

    @Override
    public List<Producto> buscarConStockMayorQue(int cantidad) {
        return jpa.findByStockTotalGreaterThanOrderByNombre(cantidad);
    }
}
