package vidanimal.aplicacion.servicio;

import java.util.List;

import org.springframework.stereotype.Service;

import vidanimal.aplicacion.input.EntradaBlogUseCase;
import vidanimal.aplicacion.output.EntradaBlogRepositorioPort;
import vidanimal.dominio.excepcion.RecursoNoEncontradoException;
import vidanimal.dominio.modelo.Animal;
import vidanimal.dominio.modelo.EntradaBlog;

@Service
public class EntradaBlogService implements EntradaBlogUseCase {

    private final EntradaBlogRepositorioPort entradaRepo;

    public EntradaBlogService(EntradaBlogRepositorioPort entradaRepo) {
        this.entradaRepo = entradaRepo;
    }

    @Override
    public List<EntradaBlog> listarGenerales(String etiqueta) {
        List<EntradaBlog> entradas = entradaRepo.buscarGenerales();
        if (etiqueta == null || etiqueta.isBlank()) {
            return entradas;
        }
        String etiquetaFiltro = etiqueta.trim();
        return entradas.stream()
                .filter(e -> e.getEtiquetas() != null && e.getEtiquetas().contains(etiquetaFiltro))
                .toList();
    }

    @Override
    public EntradaBlog obtenerPorId(Long id) {
        return entradaRepo.buscarPorId(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Entrada de blog con id " + id + " no encontrada"));
    }

    @Override
    public List<EntradaBlog> listarPorAnimal(Long animalId) {
        return entradaRepo.buscarPorAnimal(animalId);
    }

    @Override
    public EntradaBlog crear(EntradaBlog entrada, Animal animal) {
        entrada.setAnimal(animal);
        return entradaRepo.guardar(entrada);
    }

    @Override
    public EntradaBlog editar(Long id, EntradaBlog datosNuevos, Animal animal) {
        EntradaBlog entrada = entradaRepo.buscarPorId(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Entrada de blog con id " + id + " no encontrada"));

        if (datosNuevos.getTitulo() != null) entrada.setTitulo(datosNuevos.getTitulo());
        if (datosNuevos.getContenido() != null) entrada.setContenido(datosNuevos.getContenido());
        if (datosNuevos.getFecha() != null) entrada.setFecha(datosNuevos.getFecha());
        if (datosNuevos.getImagenUrl() != null) entrada.setImagenUrl(datosNuevos.getImagenUrl());
        if (datosNuevos.getGaleria() != null) entrada.setGaleria(datosNuevos.getGaleria());
        if (datosNuevos.getEtiquetas() != null) entrada.setEtiquetas(datosNuevos.getEtiquetas());
        if (datosNuevos.getAutor() != null) entrada.setAutor(datosNuevos.getAutor());
        if (animal != null) entrada.setAnimal(animal);

        return entradaRepo.guardar(entrada);
    }

    @Override
    public void eliminar(Long id) {
        EntradaBlog entrada = entradaRepo.buscarPorId(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Entrada de blog con id " + id + " no encontrada"));
        entradaRepo.eliminar(entrada);
    }
}
