package vidanimal.aplicacion.servicio;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import java.time.LocalDate;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import vidanimal.dominio.modelo.Animal;
import vidanimal.dominio.modelo.SolicitudAdopcion;

@ExtendWith(MockitoExtension.class)
class NotificacionSolicitudAdopcionServiceTest {

    @Mock
    private ResendEmailService resendEmailService;

    private NotificacionSolicitudAdopcionService service;
    private SolicitudAdopcion solicitud;

    @BeforeEach
    void setUp() {
        service = new NotificacionSolicitudAdopcionService(
                resendEmailService, "destino@example.com", "https://www.ayudaanimalmurcia.org/dashboard/adopciones");

        Animal animal = new Animal();
        animal.setId(5L);
        animal.setNombre("Nala");

        solicitud = new SolicitudAdopcion();
        solicitud.setId(11L);
        solicitud.setAnimal(animal);
        solicitud.setNombreAdoptante("Ana");
        solicitud.setEmail("ana@example.com");
        solicitud.setTelefono("600123123");
        solicitud.setDni("12345678A");
        solicitud.setFechaSolicitud(LocalDate.of(2026, 8, 8));
        solicitud.setRespuestas("{\"vivienda\":\"piso\"}");
    }

    @Test
    void enviarNuevaSolicitud_enviaCorreoSinIdNiRespuestasNiFecha() {
        service.enviarNuevaSolicitud(solicitud);

        ArgumentCaptor<String> textCaptor = ArgumentCaptor.forClass(String.class);
        verify(resendEmailService).enviar(eq("destino@example.com"),
                eq("Nueva solicitud de adopción: Nala"), textCaptor.capture());

        String text = textCaptor.getValue();
        org.assertj.core.api.Assertions.assertThat(text)
                .contains("Animal: Nala")
                .contains("Nombre: Ana")
                .contains("Email: ana@example.com")
                .contains("Teléfono: 600123123")
                .contains("DNI/NIE: 12345678A")
                .contains("https://www.ayudaanimalmurcia.org/dashboard/adopciones")
                .doesNotContain("(ID 5)")
                .doesNotContain("Respuestas")
                .doesNotContain("Fecha")
                .doesNotContain("2026-08-08");
    }

    @Test
    void enviarNuevaSolicitud_sinAnimal_usaLosDatosBasicos() {
        solicitud.setAnimal(null);

        service.enviarNuevaSolicitud(solicitud);

        verify(resendEmailService).enviar(eq("destino@example.com"),
                eq("Nueva solicitud de adopción: Animal"), anyString());
    }

    @Test
    void enviarNuevaSolicitud_sinDashboardUrl_noIncluyeEnlace() {
        NotificacionSolicitudAdopcionService sinEnlace =
                new NotificacionSolicitudAdopcionService(resendEmailService, "destino@example.com", " ");

        sinEnlace.enviarNuevaSolicitud(solicitud);

        ArgumentCaptor<String> textCaptor = ArgumentCaptor.forClass(String.class);
        verify(resendEmailService).enviar(eq("destino@example.com"),
                eq("Nueva solicitud de adopción: Nala"), textCaptor.capture());

        String text = textCaptor.getValue();
        org.assertj.core.api.Assertions.assertThat(text)
                .doesNotContain("Dashboard")
                .doesNotContain("http");
    }

    @Test
    void enviarNuevaSolicitud_sinDestinoNoEnvia() {
        NotificacionSolicitudAdopcionService sinDestino =
                new NotificacionSolicitudAdopcionService(resendEmailService, " ", "https://www.ayudaanimalmurcia.org/dashboard/adopciones");

        sinDestino.enviarNuevaSolicitud(solicitud);

        verify(resendEmailService, never()).enviar(anyString(), anyString(), anyString());
    }
}
