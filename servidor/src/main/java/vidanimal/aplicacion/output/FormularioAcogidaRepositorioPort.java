package vidanimal.aplicacion.output;

import java.util.List;
import java.util.Optional;

import vidanimal.dominio.modelo.FormularioAcogida;

public interface FormularioAcogidaRepositorioPort {
	Optional<FormularioAcogida> buscarGenerico();

	List<FormularioAcogida> buscarTodos();

	FormularioAcogida guardar(FormularioAcogida formulario);

	void eliminar(Long id);

	boolean existePorId(Long id);
}
