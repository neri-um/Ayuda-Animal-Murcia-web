package vidanimal.aplicacion.servicio;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import vidanimal.aplicacion.input.AcogidaUseCase;
import vidanimal.aplicacion.output.AcogidaRepositorioPort;
import vidanimal.aplicacion.output.AnimalRepositorioPort;
import vidanimal.aplicacion.output.SolicitudAcogidaRepositorioPort;
import vidanimal.dominio.excepcion.RecursoNoEncontradoException;
import vidanimal.dominio.modelo.Acogida;
import vidanimal.dominio.modelo.Animal;
import vidanimal.dominio.modelo.Especie;
import vidanimal.dominio.modelo.EstadoAcogida;
import vidanimal.dominio.modelo.EstadoSolicitudCuestionario;
import vidanimal.dominio.modelo.SolicitudAcogida;
import vidanimal.dominio.modelo.TipoCuestionario;

@Service
public class AcogidaService implements AcogidaUseCase {

    private final AnimalRepositorioPort animalRepo;
    private final AcogidaRepositorioPort acogidaRepo;
    private final SolicitudAcogidaRepositorioPort solicitudRepo;
    private final NotificacionService notificacionService;

    public AcogidaService(AnimalRepositorioPort animalRepo,
                          AcogidaRepositorioPort acogidaRepo,
                          SolicitudAcogidaRepositorioPort solicitudRepo,
                          NotificacionService notificacionService) {
        this.animalRepo = animalRepo;
        this.acogidaRepo = acogidaRepo;
        this.solicitudRepo = solicitudRepo;
        this.notificacionService = notificacionService;
    }

    @Override
    public SolicitudAcogida crearSolicitudSolo(SolicitudAcogida solicitud, Long animalId, String respuestasJson) {
        Animal animal = animalRepo.buscarPorId(animalId)
            .orElseThrow(() -> new RecursoNoEncontradoException("Animal no encontrado: " + animalId));
        solicitud.setAnimal(animal);
        solicitud.setFechaSolicitud(LocalDate.now());
        solicitud.setEstado(EstadoSolicitudCuestionario.PENDIENTE);
        solicitud.setRespuestas(respuestasJson);
        SolicitudAcogida solicitudGuardada = solicitudRepo.guardar(solicitud);

        notificacionService.enviarNuevaSolicitud(TipoCuestionario.ACOGIDA, animal.getNombre(),
                solicitud.getNombreAcogida(), solicitud.getEmail(), solicitud.getTelefono(), solicitud.getDni());

        return solicitudGuardada;
    }

    @Override
    public List<SolicitudAcogida> listarSolicitudes() {
        return solicitudRepo.buscarTodasOrdenadas();
    }

    @Override
    public SolicitudAcogida cambiarEstadoSolicitud(Long id, EstadoSolicitudCuestionario nuevoEstado) {
        SolicitudAcogida s = solicitudRepo.buscarPorId(id)
            .orElseThrow(() -> new RecursoNoEncontradoException("Solicitud no encontrada: " + id));
        s.setEstado(nuevoEstado);
        return solicitudRepo.guardar(s);
    }

    @Override
    public void eliminarSolicitud(Long id) {
        if (solicitudRepo.buscarPorId(id).isEmpty()) {
            throw new RecursoNoEncontradoException("Solicitud no encontrada: " + id);
        }
        solicitudRepo.eliminar(id);
    }

    @Override
    public Acogida crearAcogedorConSolicitud(String nombre, String apellidos, String telefono, String email,
            String direccion, Especie especie, String respuestasJson) {
        Acogida acogida = new Acogida(nombre, apellidos, telefono, email, direccion, especie);
        acogida.setEstado(EstadoAcogida.PENDIENTE);

        SolicitudAcogida solicitud = new SolicitudAcogida();
        solicitud.setNombreAcogida(nombre + (apellidos != null ? " " + apellidos : ""));
        solicitud.setEmail(email);
        solicitud.setTelefono(telefono);
        solicitud.setFechaSolicitud(LocalDate.now());
        solicitud.setEstado(EstadoSolicitudCuestionario.PENDIENTE);
        solicitud.setRespuestas(respuestasJson);
        solicitud.setAcogida(acogida);

        acogida.setSolicitud(solicitud);
        Acogida guardada = acogidaRepo.guardar(acogida);

        notificacionService.enviarNuevaSolicitud(TipoCuestionario.ACOGIDA, "casa de acogida",
                solicitud.getNombreAcogida(), email, telefono, solicitud.getDni());

        return guardada;
    }

    @Override
    public List<Acogida> listarAcogedores() {
        return acogidaRepo.buscarTodas();
    }

    @Override
    public Acogida cambiarEstadoAcogida(Long id, EstadoAcogida nuevoEstado) {
        Acogida a = acogidaRepo.buscarPorId(id)
            .orElseThrow(() -> new RecursoNoEncontradoException("Acogida no encontrada: " + id));
        a.setEstado(nuevoEstado);
        return acogidaRepo.guardar(a);
    }

    @Override
    public void eliminarAcogedor(Long id) {
        if (acogidaRepo.buscarPorId(id).isEmpty()) {
            throw new RecursoNoEncontradoException("Acogida no encontrada: " + id);
        }
        acogidaRepo.eliminar(id);
    }

}