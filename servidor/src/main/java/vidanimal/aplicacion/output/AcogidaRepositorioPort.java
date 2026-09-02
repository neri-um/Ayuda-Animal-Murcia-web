package vidanimal.aplicacion.output;

import java.util.List;
import java.util.Optional;

import vidanimal.dominio.modelo.Acogida;

public interface AcogidaRepositorioPort {
	Acogida guardar(Acogida acogida);

	Optional<Acogida> buscarPorId(Long id);

	List<Acogida> buscarTodas();

	void eliminar(Long id);
}