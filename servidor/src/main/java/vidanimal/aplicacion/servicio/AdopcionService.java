package vidanimal.aplicacion.servicio;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.stereotype.Service;

import vidanimal.aplicacion.input.AdopcionUseCase;
import vidanimal.aplicacion.output.AnimalRepositorioPort;
import vidanimal.aplicacion.output.FormularioAdopcionRepositorioPort;
import vidanimal.aplicacion.output.SolicitudAdopcionRepositorioPort;
import vidanimal.dominio.excepcion.RecursoNoEncontradoException;
import vidanimal.dominio.modelo.Animal;
import vidanimal.dominio.modelo.Especie;
import vidanimal.dominio.modelo.EstadoSolicitudAdopcion;
import vidanimal.dominio.modelo.FormularioAdopcion;
import vidanimal.dominio.modelo.SolicitudAdopcion;

@Service
public class AdopcionService implements AdopcionUseCase {

    private final AnimalRepositorioPort animalRepo;
    private final FormularioAdopcionRepositorioPort formularioRepo;
    private final SolicitudAdopcionRepositorioPort solicitudRepo;

    public AdopcionService(AnimalRepositorioPort animalRepo,
                           FormularioAdopcionRepositorioPort formularioRepo,
                           SolicitudAdopcionRepositorioPort solicitudRepo) {
        this.animalRepo = animalRepo;
        this.formularioRepo = formularioRepo;
        this.solicitudRepo = solicitudRepo;
    }

    @Override
    public FormularioAdopcion obtenerFormularioPorAnimal(Long animalId) {
        Animal animal = animalRepo.buscarPorId(animalId)
            .orElseThrow(() -> new RecursoNoEncontradoException("Animal no encontrado: " + animalId));

        Especie especie = animal.getEspecie();
        boolean esCria = animal.getFechaNacimiento() != null
            && ChronoUnit.MONTHS.between(animal.getFechaNacimiento(), LocalDate.now()) < 12;

        return formularioRepo.buscarPorEspecieYCachorro(especie, esCria)
            .or(() -> formularioRepo.buscarPorEspecieSinEdad(especie))
            .or(() -> formularioRepo.buscarGenerico())
            .orElseThrow(() -> new RecursoNoEncontradoException("No hay formulario configurado para este animal"));
    }

    @Override
    public SolicitudAdopcion crearSolicitud(SolicitudAdopcion solicitud, Long animalId, String respuestasJson) {
        Animal animal = animalRepo.buscarPorId(animalId)
            .orElseThrow(() -> new RecursoNoEncontradoException("Animal no encontrado: " + animalId));
        solicitud.setAnimal(animal);
        solicitud.setFechaSolicitud(LocalDate.now());
        solicitud.setEstado(EstadoSolicitudAdopcion.PENDIENTE);
        solicitud.setRespuestas(respuestasJson);
        return solicitudRepo.guardar(solicitud);
    }

    @Override
    public List<SolicitudAdopcion> listarSolicitudes() {
        return solicitudRepo.buscarTodasOrdenadas();
    }

    @Override
    public SolicitudAdopcion cambiarEstado(Long id, EstadoSolicitudAdopcion nuevoEstado) {
        SolicitudAdopcion s = solicitudRepo.buscarPorId(id)
            .orElseThrow(() -> new RecursoNoEncontradoException("Solicitud no encontrada: " + id));
        s.setEstado(nuevoEstado);
        return solicitudRepo.guardar(s);
    }

    @Override
    public List<FormularioAdopcion> listarFormularios() {
        return formularioRepo.buscarTodos();
    }

    @Override
    public FormularioAdopcion crearFormulario(FormularioAdopcion formulario, String preguntasJson) {
        formulario.setPreguntas(preguntasJson);
        return formularioRepo.guardar(formulario);
    }

    @Override
    public void eliminarFormulario(Long id) {
        formularioRepo.eliminar(id);
    }
}
