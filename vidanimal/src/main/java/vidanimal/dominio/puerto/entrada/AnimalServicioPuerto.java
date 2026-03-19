package vidanimal.dominio.puerto.entrada;

import vidanimal.dominio.modelo.Animal;
import vidanimal.dominio.modelo.CitaVeterinaria;
import vidanimal.dominio.modelo.Estado;
import java.util.List;

public interface AnimalServicioPuerto {

    // CU-07: Registrar animal
    Animal crearAnimal(Animal animal);

    // CU-01: Consultar animales
    List<Animal> obtenerTodos();

    // CU-02: Consultar ficha animal
    Animal obtenerPorId(Long id);

    // CU-08: Editar animal
    Animal editarAnimal(Long id, Animal datosNuevos);

    // CU-09: Eliminar animal
    void eliminarAnimal(Long id);

    // CU-10: Cambiar estado animal
    Animal cambiarEstado(Long id, Estado nuevoEstado);

    // CU-11: Añadir cita veterinaria
    CitaVeterinaria agregarCita(Long animalId, CitaVeterinaria cita);

    // CU-12: Consultar protocolo
    List<CitaVeterinaria> obtenerProtocolo(Long animalId);

    // Consultar citas del animal
    List<CitaVeterinaria> obtenerCitas(Long animalId);
}