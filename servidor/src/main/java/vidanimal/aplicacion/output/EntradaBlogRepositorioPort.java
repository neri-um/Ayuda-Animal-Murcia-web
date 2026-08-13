package vidanimal.aplicacion.output;

import java.util.List;
import java.util.Optional;

import vidanimal.dominio.modelo.EntradaBlog;

public interface EntradaBlogRepositorioPort {

	EntradaBlog guardar(EntradaBlog entrada);

	Optional<EntradaBlog> buscarPorId(Long id);

	List<EntradaBlog> buscarGenerales();

	List<EntradaBlog> buscarPorAnimal(Long animalId);

	void eliminar(EntradaBlog entrada);
}
