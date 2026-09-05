package vidanimal.aplicacion.servicio;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import vidanimal.dominio.modelo.TipoCuestionario;

@ExtendWith(MockitoExtension.class)
class NotificacionServiceTest {

    @Mock
    private ResendEmailService resendEmailService;

    private NotificacionService service;

    @BeforeEach
    void setUp() {
        service = new NotificacionService(
                resendEmailService, "destino@example.com", "https://www.ayudaanimalmurcia.org/dashboard/adopciones",
                "https://www.ayudaanimalmurcia.org/dashboard/acogidas");
    }

    @Test
    void enviarNuevaSolicitud_enviaCorreoSinIdNiRespuestasNiFecha() {
        service.enviarNuevaSolicitud(TipoCuestionario.ADOPCION, "Nala",
                "Ana", "ana@example.com", "600123123", "12345678A");

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
                .doesNotContain("Respuestas")
                .doesNotContain("Fecha")
                .doesNotContain("2026-08-08");
    }

    @Test
    void enviarNuevaSolicitud_sinNombreAnimal_usaLosDatosBasicos() {
        service.enviarNuevaSolicitud(TipoCuestionario.ADOPCION, null,
                "Ana", "ana@example.com", "600123123", "12345678A");

        verify(resendEmailService).enviar(eq("destino@example.com"),
                eq("Nueva solicitud de adopción: Animal"), anyString());
    }

    @Test
    void enviarNuevaSolicitud_acogida_usaLaEtiquetaDeAcogida() {
        service.enviarNuevaSolicitud(TipoCuestionario.ACOGIDA, "Luna",
                "María", "maria@example.com", "600999999", "87654321B");

        verify(resendEmailService).enviar(eq("destino@example.com"),
                eq("Nueva solicitud de acogida: Luna"), anyString());
    }

    @Test
    void enviarNuevaSolicitud_sinDashboardUrl_noIncluyeEnlace() {
        NotificacionService sinEnlace =
                new NotificacionService(resendEmailService, "destino@example.com", " ", " ");

        sinEnlace.enviarNuevaSolicitud(TipoCuestionario.ADOPCION, "Nala",
                "Ana", "ana@example.com", "600123123", "12345678A");

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
        NotificacionService sinDestino =
                new NotificacionService(resendEmailService, " ", "https://www.ayudaanimalmurcia.org/dashboard/adopciones",
                        "https://www.ayudaanimalmurcia.org/dashboard/acogidas");

        sinDestino.enviarNuevaSolicitud(TipoCuestionario.ADOPCION, "Nala",
                "Ana", "ana@example.com", "600123123", "12345678A");

        verify(resendEmailService, never()).enviar(anyString(), anyString(), anyString());
    }
}