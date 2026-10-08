package vidanimal.aplicacion.servicio;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.LinkedHashMap;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import vidanimal.infraestructura.rest.dto.ColaboracionDTO;

@ExtendWith(MockitoExtension.class)
class ColaboracionServiceTest {

    @Mock
    private ResendEmailService resendEmailService;

    private ColaboracionDTO umu() {
        ColaboracionDTO dto = new ColaboracionDTO();
        dto.setTipo("VOLUNTARIADO_UMU");
        dto.setEmail("ana@example.com");
        Map<String, String> respuestas = new LinkedHashMap<>();
        respuestas.put("Nombre", "Ana");
        respuestas.put("Email", "ana@example.com");
        respuestas.put("Correo universitario", "ana@um.es");
        respuestas.put("Teléfono de contacto", "600000000");
        respuestas.put("Edad", "21");
        respuestas.put("Localidad de residencia", "Murcia");
        respuestas.put("¿Dispone de vehículo propio?", "No");
        respuestas.put("Tareas de interés", "Acogida temporal");
        respuestas.put("Comentario adicional", "—");
        dto.setRespuestas(respuestas);
        return dto;
    }

    @Test
    void enviarSolicitud_UMU_ordenaLasEtiquetasYMarcaElTipo() {
        when(resendEmailService.enviar(eq("destino@example.com"), org.mockito.ArgumentMatchers.anyString(),
                org.mockito.ArgumentMatchers.anyString())).thenReturn(true);
        ColaboracionService service = new ColaboracionService(resendEmailService, "destino@example.com",
                "https://www.ayudaanimalmurcia.org/dashboard");

        boolean enviado = service.enviarSolicitud(umu());

        assertTrue(enviado);
        ArgumentCaptor<String> subjectCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> textCaptor = ArgumentCaptor.forClass(String.class);
        verify(resendEmailService).enviar(eq("destino@example.com"), subjectCaptor.capture(), textCaptor.capture());

        org.assertj.core.api.Assertions.assertThat(subjectCaptor.getValue())
                .isEqualTo("Nueva solicitud de voluntariado (UMU)");

        String cuerpo = textCaptor.getValue();
        org.assertj.core.api.Assertions.assertThat(cuerpo).contains("Tipo: UMU");
        int nombre = cuerpo.indexOf("Nombre: Ana");
        int correoUmu = cuerpo.indexOf("Correo universitario: ana@um.es");
        int telefono = cuerpo.indexOf("Teléfono de contacto: 600000000");
        int tareas = cuerpo.indexOf("Tareas de interés: Acogida temporal");
        assertTrue(nombre < correoUmu && correoUmu < telefono && telefono < tareas,
                "Las etiquetas no salen en el orden esperado:\n" + cuerpo);
    }

    @Test
    void enviarSolicitud_noUniversitario_noMuestraElCorreoUniversitario() {
        when(resendEmailService.enviar(eq("destino@example.com"), org.mockito.ArgumentMatchers.anyString(),
                org.mockito.ArgumentMatchers.anyString())).thenReturn(true);
        ColaboracionService service = new ColaboracionService(resendEmailService, "destino@example.com",
                "https://www.ayudaanimalmurcia.org/dashboard");

        ColaboracionDTO dto = umu();
        dto.setTipo("VOLUNTARIADO");

        boolean enviado = service.enviarSolicitud(dto);

        assertTrue(enviado);
        ArgumentCaptor<String> textCaptor = ArgumentCaptor.forClass(String.class);
        verify(resendEmailService).enviar(eq("destino@example.com"), org.mockito.ArgumentMatchers.anyString(),
                textCaptor.capture());
        org.assertj.core.api.Assertions.assertThat(textCaptor.getValue())
                .contains("Se ha recibido una nueva solicitud de voluntariado.")
                .contains("Tipo: No universitario")
                .doesNotContain("Correo universitario");
    }

    @Test
    void enviarSolicitud_sinDestinoNoEnvia() {
        ColaboracionService service = new ColaboracionService(resendEmailService, " ",
                "https://www.ayudaanimalmurcia.org/dashboard");

        assertFalse(service.enviarSolicitud(umu()));
    }

    @Test
    void enviarSolicitud_todosLosTiposCierranConElMismoDashboard() {
        when(resendEmailService.enviar(eq("destino@example.com"), org.mockito.ArgumentMatchers.anyString(),
                org.mockito.ArgumentMatchers.anyString())).thenReturn(true);
        ColaboracionService service = new ColaboracionService(resendEmailService, "destino@example.com",
                "https://www.ayudaanimalmurcia.org/dashboard");

        ColaboracionDTO noUniversitario = umu();
        noUniversitario.setTipo("VOLUNTARIADO");

        ColaboracionDTO acogida = new ColaboracionDTO();
        acogida.setTipo("ACOGIDA");
        acogida.setEmail("acogida@example.com");
        Map<String, String> respuestasAcogida = new LinkedHashMap<>();
        respuestasAcogida.put("Nombre", "Casa de acogida test");
        acogida.setRespuestas(respuestasAcogida);

        service.enviarSolicitud(umu());
        service.enviarSolicitud(noUniversitario);
        service.enviarSolicitud(acogida);

        ArgumentCaptor<String> textCaptor = ArgumentCaptor.forClass(String.class);
        verify(resendEmailService, org.mockito.Mockito.times(3))
                .enviar(eq("destino@example.com"), org.mockito.ArgumentMatchers.anyString(), textCaptor.capture());

        String cierre = "Entra al Dashboard para leer el formulario completo y descargarlo:\n"
                + "https://www.ayudaanimalmurcia.org/dashboard\n";
        for (String texto : textCaptor.getAllValues()) {
            org.assertj.core.api.Assertions.assertThat(texto).endsWith(cierre);
        }
    }
}
