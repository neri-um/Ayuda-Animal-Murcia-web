package vidanimal.aplicacion.servicio;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import vidanimal.infraestructura.rest.dto.ContactoDTO;

@ExtendWith(MockitoExtension.class)
class ContactoServiceTest {

    @Mock
    private ResendEmailService resendEmailService;

    @Test
    void enviarMensaje_enviaElCorreoConLosDatosDelFormulario() {
        when(resendEmailService.enviar(eq("destino@example.com"), org.mockito.ArgumentMatchers.anyString(),
                org.mockito.ArgumentMatchers.anyString())).thenReturn(true);
        ContactoService service = new ContactoService(resendEmailService, "destino@example.com");

        ContactoDTO dto = new ContactoDTO();
        dto.setNombre("Ana");
        dto.setEmail("ana@example.com");
        dto.setAsunto("adopcion");
        dto.setMensaje("Hola, quería información sobre la adopción de Nala.");

        boolean enviado = service.enviarMensaje(dto);

        assertTrue(enviado);
        ArgumentCaptor<String> subjectCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> textCaptor = ArgumentCaptor.forClass(String.class);
        verify(resendEmailService).enviar(eq("destino@example.com"), subjectCaptor.capture(), textCaptor.capture());

        org.assertj.core.api.Assertions.assertThat(subjectCaptor.getValue())
                .isEqualTo("Mensaje de contacto: adopcion");
        org.assertj.core.api.Assertions.assertThat(textCaptor.getValue())
                .contains("Nombre: Ana")
                .contains("Email: ana@example.com")
                .contains("Asunto: adopcion")
                .contains("Hola, quería información sobre la adopción de Nala.");
    }

    @Test
    void enviarMensaje_conAsuntoVacioUsaSinAsunto() {
        when(resendEmailService.enviar(eq("destino@example.com"), org.mockito.ArgumentMatchers.anyString(),
                org.mockito.ArgumentMatchers.anyString())).thenReturn(true);
        ContactoService service = new ContactoService(resendEmailService, "destino@example.com");

        ContactoDTO dto = new ContactoDTO();
        dto.setNombre("Ana");
        dto.setEmail("ana@example.com");
        dto.setAsunto(" ");
        dto.setMensaje("Mensaje.");

        boolean enviado = service.enviarMensaje(dto);

        assertTrue(enviado);
        ArgumentCaptor<String> subjectCaptor = ArgumentCaptor.forClass(String.class);
        verify(resendEmailService).enviar(eq("destino@example.com"), subjectCaptor.capture(),
                org.mockito.ArgumentMatchers.anyString());
        org.assertj.core.api.Assertions.assertThat(subjectCaptor.getValue())
                .isEqualTo("Mensaje de contacto: Sin asunto");
    }

    @Test
    void enviarMensaje_sinDestinoNoEnvia() {
        ContactoService service = new ContactoService(resendEmailService, " ");

        ContactoDTO dto = new ContactoDTO();
        dto.setNombre("Ana");
        dto.setEmail("ana@example.com");
        dto.setAsunto("adopcion");
        dto.setMensaje("Mensaje.");

        boolean enviado = service.enviarMensaje(dto);

        assertFalse(enviado);
    }

    @Test
    void enviarMensaje_faltanCamposNoEnvia() {
        ContactoService service = new ContactoService(resendEmailService, "destino@example.com");

        ContactoDTO dto = new ContactoDTO();
        dto.setNombre("Ana");
        dto.setEmail("ana@example.com");
        dto.setMensaje(" ");

        boolean enviado = service.enviarMensaje(dto);

        assertFalse(enviado);
    }
}
