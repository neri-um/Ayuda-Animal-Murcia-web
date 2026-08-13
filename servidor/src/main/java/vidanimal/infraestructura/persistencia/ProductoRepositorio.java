package vidanimal.infraestructura.persistencia;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import vidanimal.dominio.modelo.CategoriaProducto;
import vidanimal.dominio.modelo.Producto;

public interface ProductoRepositorio extends JpaRepository<Producto, Long> {

    List<Producto> findAllByOrderByNombre();

    List<Producto> findByCategoriaOrderByNombre(CategoriaProducto categoria);

    List<Producto> findByNombreContainingIgnoreCaseOrderByNombre(String nombre);

    List<Producto> findByStockDisponibleLessThanOrderByStockDisponibleAsc(int stockDisponible);
}
