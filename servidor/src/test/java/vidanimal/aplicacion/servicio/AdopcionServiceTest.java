package vidanimal.aplicacion.servicio;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import vidanimal.aplicacion.output.AnimalRepositorioPort;
import vidanimal.aplicacion.output.FormularioAdopcionRepositorioPort;
import vidanimal.aplicacion.output.SolicitudAdopcionRepositorioPort;
import vidanimal.dominio.modelo.Animal;
import vidanimal.dominio.modelo.EstadoSolicitudAdopcion;
import vidanimal.dominio.modelo.SolicitudAdopcion;

class AdopcionServiceTest {

    private AnimalRepositorioPort animalRepo;
    private FormularioAdopcionRepositorioPort formularioRepo;
    private SolicitudAdopcionRepositorioPort solicitudRepo;
    private NotificacionSolicitudAdopcionService notificacionService;
    private AdopcionService service;

    @BeforeEach
    void setUp() {
        animalRepo = Mockito.mock(AnimalRepositorioPort.class);
        formularioRepo = Mockito.mock(FormularioAdopcionRepositorioPort.class);
        solicitudRepo = Mockito.mock(SolicitudAdopcionRepositorioPort.class);
        notificacionService = Mockito.mock(NotificacionSolicitudAdopcionService.class);
        service = new AdopcionService(
                animalRepo,
                formularioRepo,
                solicitudRepo,
                notificacionService);
    }

    @Test
    void crearSolicitud_guardaYNotifica() {
        Animal animal = new Animal();
        animal.setId(10L);
        animal.setNombre("Luna");
        when(animalRepo.buscarPorId(10L)).thenReturn(Optional.of(animal));
        when(solicitudRepo.guardar(any(SolicitudAdopcion.class))).thenAnswer(invocation -> invocation.getArgument(0));

        SolicitudAdopcion solicitud = new SolicitudAdopcion();
        solicitud.setNombreAdoptante("Ana");
        solicitud.setEmail("ana@example.com");
        solicitud.setTelefono("600123123");
        solicitud.setDni("12345678A");

        SolicitudAdopcion result = service.crearSolicitud(solicitud, 10L, "{\"vivienda\":\"piso\"}");

        assertNotNull(result.getFechaSolicitud());
        assertEquals(EstadoSolicitudAdopcion.PENDIENTE, result.getEstado());
        assertEquals(animal, result.getAnimal());
        verify(notificacionService).enviarNuevaSolicitud(result);
        assertEquals(LocalDate.now(), result.getFechaSolicitud());
    }

    @Test
    void reubicarSolicitud_cambiaElAnimal() {
        Animal animalActual = new Animal();
        animalActual.setId(10L);
        animalActual.setNombre("Luna");
        Animal animalNuevo = new Animal();
        animalNuevo.setId(20L);
        animalNuevo.setNombre("Rocky");

        SolicitudAdopcion solicitud = new SolicitudAdopcion();
        solicitud.setId(1L);
        solicitud.setAnimal(animalActual);

        when(solicitudRepo.buscarPorId(1L)).thenReturn(Optional.of(solicitud));
        when(animalRepo.buscarPorId(20L)).thenReturn(Optional.of(animalNuevo));
        when(solicitudRepo.guardar(any(SolicitudAdopcion.class))).thenAnswer(invocation -> invocation.getArgument(0));

        SolicitudAdopcion result = service.reubicarSolicitud(1L, 20L);

        assertEquals(animalNuevo, result.getAnimal());
        assertEquals(20L, result.getAnimalId());
    }

    @Test
    void eliminarSolicitud_eliminaLaExistente() {
        SolicitudAdopcion solicitud = new SolicitudAdopcion();
        solicitud.setId(1L);
        when(solicitudRepo.buscarPorId(1L)).thenReturn(Optional.of(solicitud));

        service.eliminarSolicitud(1L);

        verify(solicitudRepo).eliminar(1L);
    }
}
