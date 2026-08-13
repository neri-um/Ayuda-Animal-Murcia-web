package vidanimal.infraestructura.rest.dto;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Solicitud de colaboración enviada desde la página pública "Colaborar":
 * voluntariado, voluntariado UMU o casa de acogida. Las respuestas del
 * cuestionario se reciben como un mapa pregunta → respuesta (preserva el
 * orden de inserción para construir el correo).
 */
public class ColaboracionDTO {
    private String tipo;
    private String email;
    private Map<String, String> respuestas = new LinkedHashMap<>();

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Map<String, String> getRespuestas() {
        return respuestas;
    }

    public void setRespuestas(Map<String, String> respuestas) {
        this.respuestas = respuestas != null ? respuestas : new LinkedHashMap<>();
    }
}
