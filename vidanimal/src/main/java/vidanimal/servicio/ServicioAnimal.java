package vidanimal.servicio;

import java.time.LocalDate;
import java.util.List;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vidanimal.factory.AnimalFactory;
import vidanimal.modelo.*;
import vidanimal.repositorio.AnimalRepository;

@Service
public class ServicioAnimal implements IServicioAnimal {

    @Autowired
    private AnimalRepository repositorio;

    @Override
    public List<Animal> getAnimales(Especie especie, Estado estado, String nombre,
                                    Tamanyo tamanyo, Sexo sexo) {
        // Filtro simple: prioridad al primer filtro no nulo
        if (especie != null && estado != null)
            return repositorio.findByEspecieAndEstadoOrderByNombre(especie, estado);
        if (especie != null)
            return repositorio.findByEspecieOrderByNombre(especie);
        if (estado != null)
            return repositorio.findByEstadoOrderByNombre(estado);
        if (nombre != null && !nombre.isBlank())
            return repositorio.findByNombreContainingIgnoreCaseOrderByNombre(nombre);
        if (tamanyo != null)
            return repositorio.findByTamanyoOrderByNombre(tamanyo);
        if (sexo != null)
            return repositorio.findBySexoOrderByNombre(sexo);

        return repositorio.findAllByOrderByNombre();
    }

    @Override
    public Animal getAnimal(Long id) {
        return repositorio.findById(id)
            .orElseThrow(() -> new EntityNotFoundException(
                "No existe animal con id: " + id));
    }

    @Override
    public Animal nuevoAnimal(Especie especie, String nombre,
                              LocalDate fechaNacimiento, LocalDate fechaIngreso) {
        if (especie == null)
            throw new IllegalArgumentException("La especie no puede ser nula");
        if (nombre == null || nombre.isBlank())
            throw new IllegalArgumentException("El nombre no puede ser vacío");
        if (fechaNacimiento == null)
            throw new IllegalArgumentException("La fecha de nacimiento no puede ser nula");
        if (fechaIngreso == null)
            throw new IllegalArgumentException("La fecha de ingreso no puede ser nula");
        if (fechaNacimiento.isAfter(LocalDate.now()))
            throw new IllegalArgumentException("La fecha de nacimiento no puede ser futura");
        if (fechaIngreso.isAfter(LocalDate.now()))
            throw new IllegalArgumentException("La fecha de ingreso no puede ser futura");
        if (fechaIngreso.isBefore(fechaNacimiento))
            throw new IllegalArgumentException("La fecha de ingreso no puede ser anterior al nacimiento");

        Animal animal = AnimalFactory.crear(especie, nombre, fechaNacimiento, fechaIngreso);
        return repositorio.save(animal);
    }

    @Override
    public Animal editarAnimal(Long id, String nombre, LocalDate fechaNacimiento,
                               Especie especie, LocalDate fechaIngreso, String descripcion,
                               Sexo sexo, Tamanyo tamanyo, String fotoUrl,
                               boolean esterilizado) {
        Animal animal = getAnimal(id);

        if (nombre != null && !nombre.isBlank()) animal.setNombre(nombre);
        if (fechaNacimiento != null) animal.setFechaNacimiento(fechaNacimiento);
        if (especie != null) animal.setEspecie(especie);
        if (fechaIngreso != null) animal.setFechaIngreso(fechaIngreso);
        if (descripcion != null) animal.setDescripcion(descripcion);
        if (sexo != null) animal.setSexo(sexo);
        if (tamanyo != null) animal.setTamanyo(tamanyo);
        if (fotoUrl != null) animal.setFotoUrl(fotoUrl);
        animal.setEsterilizado(esterilizado);

        return repositorio.save(animal);
    }

    @Override
    public void eliminarAnimal(Long id) {
        Animal animal = getAnimal(id);
        repositorio.delete(animal);
    }

    @Override
    public Animal cambiarEstado(Long id, Estado nuevoEstado) {
        if (nuevoEstado == null)
            throw new IllegalArgumentException("El nuevo estado no puede ser nulo");

        Animal animal = getAnimal(id);

        if (animal.getEstado() == nuevoEstado)
            throw new IllegalArgumentException("El animal ya tiene el estado: " + nuevoEstado);

        animal.setEstado(nuevoEstado);
        return repositorio.save(animal);
    }

    @Override
    public CitaVeterinaria nuevaCita(Long animalId, Tratamiento tipo,
                                     String descripcion, LocalDate fecha,
                                     String veterinario) {
        if (tipo == null)
            throw new IllegalArgumentException("El tipo de tratamiento no puede ser nulo");
        if (descripcion == null || descripcion.isBlank())
            throw new IllegalArgumentException("La descripción no puede ser vacía");
        if (fecha == null)
            throw new IllegalArgumentException("La fecha no puede ser nula");
        if (veterinario == null || veterinario.isBlank())
            throw new IllegalArgumentException("El veterinario no puede ser vacío");
        if (fecha.isAfter(LocalDate.now()))
            throw new IllegalArgumentException("La fecha de la cita no puede ser futura");

        Animal animal = getAnimal(animalId);

        CitaVeterinaria cita = new CitaVeterinaria(animal, fecha, tipo, descripcion, veterinario);
        animal.getCitas().add(cita);

        if (animal.getProtocolo().contains(tipo)) {
            animal.getProtocolo().remove(tipo);
        }

        repositorio.save(animal);
        return cita;
    }

    @Override
    public List<CitaVeterinaria> verCitasVeterinarias(Long animalId) {
        Animal animal = getAnimal(animalId);
        return animal.getCitas();
    }

    @Override
    public List<Tratamiento> protocoloPendiente(Long animalId) {
        Animal animal = getAnimal(animalId);
        return animal.getProtocolo();
    }
}