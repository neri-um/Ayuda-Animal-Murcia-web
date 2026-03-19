package vidanimal.aplicacion.servicio;

import java.util.List;

import org.springframework.stereotype.Service;

import vidanimal.dominio.excepcion.RecursoNoEncontradoException;
import vidanimal.dominio.factory.AnimalFactory;
import vidanimal.dominio.modelo.Animal;
import vidanimal.dominio.modelo.CitaVeterinaria;
import vidanimal.dominio.modelo.Estado;
import vidanimal.dominio.modelo.Tratamiento;
import vidanimal.dominio.puerto.entrada.AnimalServicioPuerto;
import vidanimal.infraestructura.persistencia.AnimalRepositorio;
import vidanimal.infraestructura.persistencia.CitaVeterinariaRepositorio;

@Service
public class AnimalServicio implements AnimalServicioPuerto {

    private final AnimalRepositorio animalRepo;
    private final CitaVeterinariaRepositorio citaRepo;

    public AnimalServicio(AnimalRepositorio animalRepo,
                          CitaVeterinariaRepositorio citaRepo) {
        this.animalRepo = animalRepo;
        this.citaRepo = citaRepo;
    }

    @Override
    public Animal crearAnimal(Animal animal) {
        Animal animalConProtocolo = AnimalFactory.crear(
                animal.getEspecie(),
                animal.getNombre(),
                animal.getFechaNacimiento(),
                animal.getFechaIngreso()
        );

        if (animal.getDescripcion() != null) animalConProtocolo.setDescripcion(animal.getDescripcion());
        if (animal.getSexo() != null) animalConProtocolo.setSexo(animal.getSexo());
        if (animal.getTamanyo() != null) animalConProtocolo.setTamanyo(animal.getTamanyo());
        if (animal.getFotoUrl() != null) animalConProtocolo.setFotoUrl(animal.getFotoUrl());

        return animalRepo.save(animalConProtocolo);
    }

    @Override
    public List<Animal> obtenerTodos() {
        return animalRepo.findAll();
    }

    @Override
    public Animal obtenerPorId(Long id) {
        return animalRepo.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "Animal con id " + id + " no encontrado"));
    }

    @Override
    public Animal editarAnimal(Long id, Animal datosNuevos) {
        Animal animal = obtenerPorId(id);

        if (datosNuevos.getNombre() != null) animal.setNombre(datosNuevos.getNombre());
        if (datosNuevos.getDescripcion() != null) animal.setDescripcion(datosNuevos.getDescripcion());
        if (datosNuevos.getEspecie() != null) animal.setEspecie(datosNuevos.getEspecie());
        if (datosNuevos.getSexo() != null) animal.setSexo(datosNuevos.getSexo());
        if (datosNuevos.getTamanyo() != null) animal.setTamanyo(datosNuevos.getTamanyo());
        if (datosNuevos.getFechaNacimiento() != null) animal.setFechaNacimiento(datosNuevos.getFechaNacimiento());
        if (datosNuevos.getFechaIngreso() != null) animal.setFechaIngreso(datosNuevos.getFechaIngreso());
        if (datosNuevos.getFotoUrl() != null) animal.setFotoUrl(datosNuevos.getFotoUrl());

        return animalRepo.save(animal);
    }

    @Override
    public void eliminarAnimal(Long id) {
        Animal animal = obtenerPorId(id);
        animalRepo.delete(animal);
    }

    @Override
    public Animal cambiarEstado(Long id, Estado nuevoEstado) {
        Animal animal = obtenerPorId(id);
        animal.setEstado(nuevoEstado);
        return animalRepo.save(animal);
    }

    @Override
    public CitaVeterinaria agregarCita(Long animalId, CitaVeterinaria cita) {
        Animal animal = obtenerPorId(animalId);
        cita.setAnimal(animal);
        return citaRepo.save(cita);
    }

    @Override
    public List<CitaVeterinaria> obtenerCitas(Long animalId) {
        obtenerPorId(animalId);
        return citaRepo.findByAnimalIdOrderByFechaDesc(animalId);
    }

    @Override
    public List<CitaVeterinaria> obtenerProtocolo(Long animalId) {
        obtenerPorId(animalId);
        List<CitaVeterinaria> citas = citaRepo.findByAnimalIdOrderByFechaDesc(animalId);

        return citas.stream()
                .filter(c -> c.getTratamiento() == Tratamiento.TRIVALENTE_FELINA
                        || c.getTratamiento() == Tratamiento.DESPARASITACION_EXTERNA
                        || c.getTratamiento() == Tratamiento.MICROCHIP
                        || c.getTratamiento() == Tratamiento.CASTRACION
                        || c.getTratamiento() == Tratamiento.REVISION)
                .toList();
    }
}