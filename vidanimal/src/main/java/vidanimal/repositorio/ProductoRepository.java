package vidanimal.repositorio;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import vidanimal.modelo.CategoriaProducto;
import vidanimal.modelo.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

    List<Producto> findByCategoriaOrderByNombre(CategoriaProducto categoria);

    List<Producto> findAllByOrderByNombre();
}