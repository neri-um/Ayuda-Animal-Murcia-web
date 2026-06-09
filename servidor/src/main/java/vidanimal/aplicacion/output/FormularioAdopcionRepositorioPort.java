package vidanimal.aplicacion.output;

import java.util.List;
import java.util.Optional;

import vidanimal.dominio.modelo.Especie;
import vidanimal.dominio.modelo.FormularioAdopcion;

public interface FormularioAdopcionRepositorioPort {
	Optional<FormularioAdopcion> buscarPorEspecieYCachorro(Especie especie, Boolean cachorro);

	Optional<FormularioAdopcion> buscarPorEspecieSinEdad(Especie especie);

	Optional<FormularioAdopcion> buscarGenerico();

	List<FormularioAdopcion> buscarTodos();

	FormularioAdopcion guardar(FormularioAdopcion formulario);

	void eliminar(Long id);

	boolean existePorId(Long id);
}