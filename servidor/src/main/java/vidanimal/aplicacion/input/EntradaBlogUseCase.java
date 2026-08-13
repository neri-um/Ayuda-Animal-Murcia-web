package vidanimal.aplicacion.input;

import java.util.List;

import vidanimal.dominio.modelo.Animal;
import vidanimal.dominio.modelo.EntradaBlog;

public interface EntradaBlogUseCase {

	// Entradas generales (sin animal vinculado), opcionalmente filtradas por etiqueta
	List<EntradaBlog> listarGenerales(String etiqueta);

	// Entrada concreta por id (página pública de detalle)
	EntradaBlog obtenerPorId(Long id);

	// Entradas vinculadas a un animal
	List<EntradaBlog> listarPorAnimal(Long animalId);

	EntradaBlog crear(EntradaBlog entrada, Animal animal);

	EntradaBlog editar(Long id, EntradaBlog datosNuevos, Animal animal);

	void eliminar(Long id);
}
