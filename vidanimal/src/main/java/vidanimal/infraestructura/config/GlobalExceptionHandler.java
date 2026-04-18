package vidanimal.infraestructura.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import vidanimal.dominio.excepcion.RecursoNoEncontradoException;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RecursoNoEncontradoException.class)
    public ResponseEntity<Map<String, Object>> recursoNoEncontrado(
            RecursoNoEncontradoException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                Map.of("codigo", 404, "mensaje", e.getMessage()));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> accesoDenegado(AccessDeniedException e) {
        throw e; // Deja que Spring Security lo maneje correctamente
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> errorGeneral(RuntimeException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                Map.of("codigo", 400, "mensaje", e.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> errorInterno(Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                Map.of("codigo", 500, "mensaje", "Error interno del servidor"));
    }
}
