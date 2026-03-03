package vidanimal.servicio;

import java.time.LocalDate;
import java.util.List;

import vidanimal.modelo.*;

public interface IServicioAnimal {

    // CU-01, CU-02
    List<Animal> getAnimales(Especie especie, Estado estado, String nombre,
                             Tamanyo tamanyo, Sexo sexo);

    // CU-03
    Animal getAnimal(Long id);

    // CU-07
    Animal nuevoAnimal(Especie especie, String nombre, LocalDate fechaNacimiento,
                       LocalDate fechaIngreso);

    // CU-08
    Animal editarAnimal(Long id, String nombre, LocalDate fechaNacimiento,
                        Especie especie, LocalDate fechaIngreso, String descripcion,
                        Sexo sexo, Tamanyo tamanyo, String fotoUrl, boolean esterilizado);

    // CU-09
    void eliminarAnimal(Long id);

    // CU-10
    Animal cambiarEstado(Long id, Estado nuevoEstado);

    // CU-11
    CitaVeterinaria nuevaCita(Long animalId, Tratamiento tipo, String descripcion,
                              LocalDate fecha, String veterinario);

    // CU-12
    List<CitaVeterinaria> verCitasVeterinarias(Long animalId);

    // Protocolo pendiente
    List<Tratamiento> protocoloPendiente(Long animalId);
}