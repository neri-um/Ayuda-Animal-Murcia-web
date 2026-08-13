package vidanimal.infraestructura.persistencia.adaptador;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import vidanimal.aplicacion.output.AnimalRepositorioPort;
import vidanimal.dominio.modelo.Animal;
import vidanimal.dominio.modelo.Especie;
import vidanimal.dominio.modelo.Estado;
import vidanimal.dominio.modelo.Sexo;
import vidanimal.dominio.modelo.Tamanyo;
import vidanimal.infraestructura.persistencia.AnimalRepositorio;

@Repository
public class AnimalPersistenciaAdapter implements AnimalRepositorioPort {

    private final AnimalRepositorio repo;

    public AnimalPersistenciaAdapter(AnimalRepositorio repo) {
        this.repo = repo;
    }

    @Override
    public Animal guardar(Animal animal) {
        return repo.save(animal);
    }

    @Override
    public Optional<Animal> buscarPorId(Long id) {
        return repo.findById(id);
    }

    @Override
    public List<Animal> buscarTodos() {
        return repo.findAllByOrderByFechaIngresoDescIdDesc();
    }

    @Override
    public void eliminar(Animal animal) {
        repo.delete(animal);
    }

    @Override
    public List<Animal> buscarPorEspecieYEstado(Especie especie, Estado estado) {
        return repo.findByEspecieAndEstadoOrderByNombre(especie, estado);
    }

    @Override
    public List<Animal> buscarPorEspecie(Especie especie) {
        return repo.findByEspecieOrderByNombre(especie);
    }

    @Override
    public List<Animal> buscarPorEstado(Estado estado) {
        return repo.findByEstadoOrderByNombre(estado);
    }

    @Override
    public List<Animal> buscarPorNombre(String nombre) {
        return repo.findByNombreContainingIgnoreCaseOrderByNombre(nombre);
    }

    @Override
    public List<Animal> buscarPorTamanyo(Tamanyo tamanyo) {
        return repo.findByTamanyoOrderByNombre(tamanyo);
    }

    @Override
    public List<Animal> buscarPorSexo(Sexo sexo) {
        return repo.findBySexoOrderByNombre(sexo);
    }

    @Override
    public List<Animal> buscarPorResponsableId(Long responsableId) {
        return repo.findByResponsableIdOrderByNombre(responsableId);
    }
}