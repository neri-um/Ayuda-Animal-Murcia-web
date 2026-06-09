package vidanimal.aplicacion.output;

import java.util.List;
import java.util.Optional;

import vidanimal.dominio.modelo.CategoriaProducto;
import vidanimal.dominio.modelo.Producto;

public interface ProductoRepositorioPort {
	Producto guardar(Producto producto);

	Optional<Producto> buscarPorId(Long id);

	void eliminar(Producto producto);

	List<Producto> buscarTodosOrdenados();

	List<Producto> buscarPorCategoria(CategoriaProducto categoria);

	List<Producto> buscarPorNombre(String nombre);

	List<Producto> buscarConStockMenorQue(int cantidad);

	List<Producto> buscarConStockMayorQue(int cantidad);
}