package vidanimal.aplicacion.input;

import java.util.List;

import vidanimal.dominio.modelo.Animal;
import vidanimal.dominio.modelo.CitaVeterinaria;
import vidanimal.dominio.modelo.Especie;
import vidanimal.dominio.modelo.Estado;
import vidanimal.dominio.modelo.Sexo;
import vidanimal.dominio.modelo.Tamanyo;

public interface AnimalesUseCase {

    List<Animal> listar(Especie especie, Estado estado, String nombre, Tamanyo tamanyo, Sexo sexo);

    Animal obtenerPorId(Long id);

    Animal crear(Animal animal);

    Animal editar(Long id, Animal datosNuevos);

    void eliminar(Long id);

    Animal cambiarEstado(Long id, Estado nuevoEstado);

    CitaVeterinaria agregarCita(Long animalId, CitaVeterinaria cita);

    List<CitaVeterinaria> listarCitas(Long animalId);

    CitaVeterinaria completarCita(Long animalId, Long citaId);

    List<Animal> listarPorResponsable(Long responsableId);
}
