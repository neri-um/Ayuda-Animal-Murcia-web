package vidanimal.aplicacion.input;

import java.util.List;

import vidanimal.dominio.modelo.Animal;
import vidanimal.dominio.modelo.CitaVeterinaria;
import vidanimal.dominio.modelo.Especie;
import vidanimal.dominio.modelo.Estado;
import vidanimal.dominio.modelo.Sexo;
import vidanimal.dominio.modelo.Tamanyo;

public interface AnimalesUseCase {

    // CU-01 + CU-02
    List<Animal> listar(Especie especie, Estado estado, String nombre, Tamanyo tamanyo, Sexo sexo);

    // CU-03
    Animal obtenerPorId(Long id);

    // CU-07
    Animal crear(Animal animal);

    // CU-08
    Animal editar(Long id, Animal datosNuevos);

    // CU-09
    void eliminar(Long id);

    // CU-10
    Animal cambiarEstado(Long id, Estado nuevoEstado);

    // CU-11
    CitaVeterinaria agregarCita(Long animalId, CitaVeterinaria cita);

    // CU-12
    List<CitaVeterinaria> listarCitas(Long animalId);
}