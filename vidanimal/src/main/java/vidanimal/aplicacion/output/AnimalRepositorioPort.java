package vidanimal.aplicacion.output;

import java.util.List;
import java.util.Optional;

import vidanimal.dominio.modelo.Animal;
import vidanimal.dominio.modelo.Especie;
import vidanimal.dominio.modelo.Estado;
import vidanimal.dominio.modelo.Sexo;
import vidanimal.dominio.modelo.Tamanyo;

public interface AnimalRepositorioPort {
	Animal guardar(Animal animal);

	Optional<Animal> buscarPorId(Long id);

	List<Animal> buscarTodos();

	void eliminar(Animal animal);

	List<Animal> buscarPorEspecieYEstado(Especie especie, Estado estado);

	List<Animal> buscarPorEspecie(Especie especie);

	List<Animal> buscarPorEstado(Estado estado);

	List<Animal> buscarPorNombre(String nombre);

	List<Animal> buscarPorTamanyo(Tamanyo tamanyo);

	List<Animal> buscarPorSexo(Sexo sexo);
}