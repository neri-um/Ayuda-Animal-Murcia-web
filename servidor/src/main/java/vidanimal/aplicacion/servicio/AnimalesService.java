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

    @Override
    public Animal obtenerPorId(Long id) {
        return animalRepo.buscarPorId(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Animal con id " + id + " no encontrado"));
    }

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
        animalConProtocolo.setCompatibleGatos(animal.isCompatibleGatos());
        animalConProtocolo.setCompatiblePerros(animal.isCompatiblePerros());
        animalConProtocolo.setCompatiblePerrosGrandes(animal.isCompatiblePerrosGrandes());
        animalConProtocolo.setCompatiblePerrosPequenos(animal.isCompatiblePerrosPequenos());
        animalConProtocolo.setNecesitaMedicacion(animal.isNecesitaMedicacion());
        animalConProtocolo.setNecesitaCuidadosEspeciales(animal.isNecesitaCuidadosEspeciales());
        animalConProtocolo.setNecesitaAcogida(animal.isNecesitaAcogida());
        animalConProtocolo.setPositivoLeucemia(animal.isPositivoLeucemia());
        animalConProtocolo.setPositivoInmunodeficiencia(animal.isPositivoInmunodeficiencia());
        animalConProtocolo.setCompatibleNinos(animal.isCompatibleNinos());
        animalConProtocolo.setPuedeVivirPiso(animal.isPuedeVivirPiso());
        animalConProtocolo.setPuedeVivirExterior(animal.isPuedeVivirExterior());
        animalConProtocolo.setAptoGatoUnico(animal.isAptoGatoUnico());
        animalConProtocolo.setNecesitaCompaneroFelino(animal.isNecesitaCompaneroFelino());
        animalConProtocolo.setFlexibleConvivenciaFelina(animal.isFlexibleConvivenciaFelina());
        animalConProtocolo.setAdopcionConjunta(animal.isAdopcionConjunta());
        animalConProtocolo.setCaracter(animal.getCaracter());
        animalConProtocolo.setResponsable(animal.getResponsable());

        return animalRepo.guardar(animalConProtocolo);
    }

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
        animal.setCompatibleGatos(datosNuevos.isCompatibleGatos());
        animal.setCompatiblePerros(datosNuevos.isCompatiblePerros());
        animal.setCompatiblePerrosGrandes(datosNuevos.isCompatiblePerrosGrandes());
        animal.setCompatiblePerrosPequenos(datosNuevos.isCompatiblePerrosPequenos());
        animal.setNecesitaMedicacion(datosNuevos.isNecesitaMedicacion());
        animal.setNecesitaCuidadosEspeciales(datosNuevos.isNecesitaCuidadosEspeciales());
        animal.setNecesitaAcogida(datosNuevos.isNecesitaAcogida());
        animal.setPositivoLeucemia(datosNuevos.isPositivoLeucemia());
        animal.setPositivoInmunodeficiencia(datosNuevos.isPositivoInmunodeficiencia());
        animal.setCompatibleNinos(datosNuevos.isCompatibleNinos());
        animal.setPuedeVivirPiso(datosNuevos.isPuedeVivirPiso());
        animal.setPuedeVivirExterior(datosNuevos.isPuedeVivirExterior());
        animal.setAptoGatoUnico(datosNuevos.isAptoGatoUnico());
        animal.setNecesitaCompaneroFelino(datosNuevos.isNecesitaCompaneroFelino());
        animal.setFlexibleConvivenciaFelina(datosNuevos.isFlexibleConvivenciaFelina());
        animal.setAdopcionConjunta(datosNuevos.isAdopcionConjunta());
        animal.setCaracter(datosNuevos.getCaracter());

        return animalRepo.guardar(animal);
    }

    @Override
    public void eliminar(Long id) {
        Animal animal = obtenerPorId(id);
        animalRepo.eliminar(animal);
    }

    @Override
    public Animal cambiarEstado(Long id, Estado nuevoEstado) {
        Animal animal = obtenerPorId(id);
        animal.setEstado(nuevoEstado);
        return animalRepo.guardar(animal);
    }

    @Override
    public CitaVeterinaria agregarCita(Long animalId, CitaVeterinaria cita) {
        Animal animal = obtenerPorId(animalId);
        cita.setAnimal(animal);
        return citaRepo.guardar(cita);
    }

    @Override
    public List<CitaVeterinaria> listarCitas(Long animalId) {
        obtenerPorId(animalId);
        return citaRepo.buscarPorAnimalId(animalId);
    }

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
