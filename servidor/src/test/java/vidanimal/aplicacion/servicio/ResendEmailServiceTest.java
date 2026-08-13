package vidanimal.aplicacion.servicio;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.jsonPath;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withServerError;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

class ResendEmailServiceTest {

    private static final String RESEND_URL = "https://api.resend.com/emails";

    @Test
    void enviar_llamaALaApiDeResendConLosDatosCorrectos() {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        ResendEmailService service = new ResendEmailService(builder, "re_test_key", "origen@example.com");

        server.expect(requestTo(RESEND_URL))
                .andExpect(method(HttpMethod.POST))
                .andExpect(header("Authorization", "Bearer re_test_key"))
                .andExpect(jsonPath("$.from").value("origen@example.com"))
                .andExpect(jsonPath("$.to").value("destino@example.com"))
                .andExpect(jsonPath("$.subject").value("Asunto de prueba"))
                .andExpect(jsonPath("$.text").value("Contenido de prueba"))
                .andRespond(withSuccess());

        boolean enviado = service.enviar("destino@example.com", "Asunto de prueba", "Contenido de prueba");

        assertTrue(enviado);
        server.verify();
    }

    @Test
    void enviar_devuelveFalseSiFallaLaApi() {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        ResendEmailService service = new ResendEmailService(builder, "re_test_key", "origen@example.com");

        server.expect(requestTo(RESEND_URL))
                .andExpect(method(HttpMethod.POST))
                .andRespond(withServerError());

        boolean enviado = service.enviar("destino@example.com", "Asunto", "Contenido");

        assertFalse(enviado);
        server.verify();
    }

    @Test
    void enviar_devuelveFalseSiFaltaDestino() {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        ResendEmailService service = new ResendEmailService(builder, "re_test_key", "origen@example.com");

        boolean enviado = service.enviar(" ", "Asunto", "Contenido");

        assertFalse(enviado);
        server.verify();
    }

    @Test
    void enviar_devuelveFalseSiNoHayRemitente() {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        ResendEmailService service = new ResendEmailService(builder, "re_test_key", " ");

        boolean enviado = service.enviar("destino@example.com", "Asunto", "Contenido");

        assertFalse(enviado);
        server.verify();
    }
}
