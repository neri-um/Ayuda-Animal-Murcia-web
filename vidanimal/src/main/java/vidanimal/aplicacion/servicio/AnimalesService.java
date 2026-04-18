package vidanimal.aplicacion.servicio;

import java.util.List;

import org.springframework.stereotype.Service;

import vidanimal.aplicacion.input.AnimalesUseCase;
import vidanimal.aplicacion.output.AnimalRepositorioPort;
import vidanimal.aplicacion.output.CitaVeterinariaRepositorioPort;
import vidanimal.dominio.excepcion.RecursoNoEncontradoException;
import vidanimal.dominio.factory.AnimalFactory;
import vidanimal.dominio.modelo.Animal;
import vidanimal.dominio.modelo.CitaVeterinaria;
import vidanimal.dominio.modelo.Especie;
import vidanimal.dominio.modelo.Estado;
import vidanimal.dominio.modelo.Sexo;
import vidanimal.dominio.modelo.Tamanyo;

@Service
public class AnimalesService implements AnimalesUseCase {

    private final AnimalRepositorioPort animalRepo;
    private final CitaVeterinariaRepositorioPort citaRepo;

    public AnimalesService(AnimalRepositorioPort animalRepo,
                           CitaVeterinariaRepositorioPort citaRepo) {
        this.animalRepo = animalRepo;
        this.citaRepo = citaRepo;
    }

    // CU-01 + CU-02
    @Override
    public List<Animal> listar(Especie especie, Estado estado, String nombre, Tamanyo tamanyo, Sexo sexo) {
        if (especie != null && estado != null) return animalRepo.buscarPorEspecieYEstado(especie, estado);
        if (especie != null) return animalRepo.buscarPorEspecie(especie);
        if (estado != null) return animalRepo.buscarPorEstado(estado);
        if (nombre != null && !nombre.isBlank()) return animalRepo.buscarPorNombre(nombre);
        if (tamanyo != null) return animalRepo.buscarPorTamanyo(tamanyo);
        if (sexo != null) return animalRepo.buscarPorSexo(sexo);

        return animalRepo.buscarTodos();
    }

    // CU-03
    @Override
    public Animal obtenerPorId(Long id) {
        return animalRepo.buscarPorId(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Animal con id " + id + " no encontrado"));
    }

    // CU-07
    @Override
    public Animal crear(Animal animal) {
        Animal animalConProtocolo = AnimalFactory.crear(
                animal.getEspecie(),
                animal.getNombre(),
                animal.getFechaNacimiento(),
                animal.getFechaIngreso()
        );

        if (animal.getDescripcion() != null) animalConProtocolo.setDescripcion(animal.getDescripcion());
        if (animal.getRaza() != null) animalConProtocolo.setRaza(animal.getRaza());
        if (animal.getSexo() != null) animalConProtocolo.setSexo(animal.getSexo());
        if (animal.getTamanyo() != null) animalConProtocolo.setTamanyo(animal.getTamanyo());
        if (animal.getFotoUrl() != null) animalConProtocolo.setFotoUrl(animal.getFotoUrl());
        if (animal.getGaleria() != null) animalConProtocolo.setGaleria(animal.getGaleria());
        animalConProtocolo.setVacunado(animal.isVacunado());
        animalConProtocolo.setEsterilizado(animal.isEsterilizado());
        animalConProtocolo.setMicrochip(animal.isMicrochip());
        animalConProtocolo.setCompatibleGatos(animal.isCompatibleGatos());
        animalConProtocolo.setCompatiblePerros(animal.isCompatiblePerros());
        animalConProtocolo.setResponsable(animal.getResponsable());

        return animalRepo.guardar(animalConProtocolo);
    }

    // CU-08
    @Override
    public Animal editar(Long id, Animal datosNuevos) {
        Animal animal = obtenerPorId(id);

        if (datosNuevos.getNombre() != null) animal.setNombre(datosNuevos.getNombre());
        if (datosNuevos.getRaza() != null) animal.setRaza(datosNuevos.getRaza());
        if (datosNuevos.getDescripcion() != null) animal.setDescripcion(datosNuevos.getDescripcion());
        if (datosNuevos.getEspecie() != null) animal.setEspecie(datosNuevos.getEspecie());
        if (datosNuevos.getSexo() != null) animal.setSexo(datosNuevos.getSexo());
        if (datosNuevos.getTamanyo() != null) animal.setTamanyo(datosNuevos.getTamanyo());
        if (datosNuevos.getFechaNacimiento() != null) animal.setFechaNacimiento(datosNuevos.getFechaNacimiento());
        if (datosNuevos.getFechaIngreso() != null) animal.setFechaIngreso(datosNuevos.getFechaIngreso());
        if (datosNuevos.getFotoUrl() != null) animal.setFotoUrl(datosNuevos.getFotoUrl());
        if (datosNuevos.getGaleria() != null) animal.setGaleria(datosNuevos.getGaleria());
        // booleans siempre se actualizan (false es un valor válido)
        animal.setVacunado(datosNuevos.isVacunado());
        animal.setEsterilizado(datosNuevos.isEsterilizado());
        animal.setMicrochip(datosNuevos.isMicrochip());
        animal.setCompatibleGatos(datosNuevos.isCompatibleGatos());
        animal.setCompatiblePerros(datosNuevos.isCompatiblePerros());

        return animalRepo.guardar(animal);
    }

    // CU-09
    @Override
    public void eliminar(Long id) {
        Animal animal = obtenerPorId(id);
        animalRepo.eliminar(animal);
    }

    // CU-10
    @Override
    public Animal cambiarEstado(Long id, Estado nuevoEstado) {
        Animal animal = obtenerPorId(id);
        animal.setEstado(nuevoEstado);
        return animalRepo.guardar(animal);
    }

    // CU-11
    @Override
    public CitaVeterinaria agregarCita(Long animalId, CitaVeterinaria cita) {
        Animal animal = obtenerPorId(animalId);
        cita.setAnimal(animal);
        return citaRepo.guardar(cita);
    }

    // CU-12
    @Override
    public List<CitaVeterinaria> listarCitas(Long animalId) {
        obtenerPorId(animalId);
        return citaRepo.buscarPorAnimalId(animalId);
    }

    // CU-13
    @Override
    public CitaVeterinaria completarCita(Long animalId, Long citaId) {
        obtenerPorId(animalId);
        CitaVeterinaria cita = citaRepo.buscarPorId(citaId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Cita con id " + citaId + " no encontrada"));
        cita.setCompletada(true);
        return citaRepo.guardar(cita);
    }

    @Override
    public List<Animal> listarPorResponsable(Long responsableId) {
        return animalRepo.buscarPorResponsableId(responsableId);
    }
}
