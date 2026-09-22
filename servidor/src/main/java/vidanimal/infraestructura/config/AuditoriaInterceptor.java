package vidanimal.infraestructura.config;

import java.util.Set;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import vidanimal.aplicacion.servicio.AuditoriaService;

/**
 * Registra en la tabla de auditoría toda operación de escritura autenticada
 * (POST/PUT/PATCH/DELETE) que termine en 2xx. Lee el usuario de los claims
 * que deja {@code JwtTokenFilter} en el atributo de petición "claims".
 */
@Component
public class AuditoriaInterceptor implements HandlerInterceptor {

    private static final Set<String> METODOS_ESCRITURA =
            Set.of("POST", "PUT", "PATCH", "DELETE");

    private static final Set<String> RUTAS_PUBLICAS_ESCRITURA =
            Set.of("/vidanimal/adopciones", "/vidanimal/contacto",
                   "/vidanimal/colaboracion", "/vidanimal/acogidas",
                   "/vidanimal/acogidas/solicitudes",
                   "/vidanimal/auth/login", "/vidanimal/auth/logout");

    private final AuditoriaService auditoriaService;

    public AuditoriaInterceptor(AuditoriaService auditoriaService) {
        this.auditoriaService = auditoriaService;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        request.setAttribute("__auditoria_inicio", System.currentTimeMillis());
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response,
                                Object handler, Exception ex) {
        if (!METODOS_ESCRITURA.contains(request.getMethod().toUpperCase())) return;
        if (response.getStatus() < 200 || response.getStatus() >= 300) return;

        Claims claims = (Claims) request.getAttribute("claims");
        if (claims == null) return;

        String path = request.getRequestURI();
        for (String publica : RUTAS_PUBLICAS_ESCRITURA) {
            if (publica.equals(path)) return;
        }

        Long usuarioId = parseLong(claims.getSubject());
        String usuarioLogin = claims.get("usuario", String.class);
        String usuarioNombre = claims.get("nombre", String.class);

        Seccion seccionInfo = mapearSeccion(path);
        String accion = traducirAccion(request.getMethod(), seccionInfo.sufijo);

        Long entidadId = extraerEntidadId(path);
        String detalle = request.getMethod().toUpperCase() + " " + path;

        auditoriaService.registrar(
                usuarioId, usuarioLogin, usuarioNombre,
                seccionInfo.seccion, accion,
                entidadId != null ? entidadId.toString() : null,
                detalle);
    }

    private Long parseLong(String valor) {
        if (valor == null) return null;
        try {
            return Long.parseLong(valor);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private Long extraerEntidadId(String path) {
        for (String parte : path.split("/")) {
            if (parte.matches("\\d+")) {
                return parseLong(parte);
            }
        }
        return null;
    }

    private Seccion mapearSeccion(String path) {
        String resto = path.startsWith("/vidanimal/")
                ? path.substring("/vidanimal/".length())
                : path;
        String primer = resto.split("/")[0];
        String sufijo = resto.substring(primer.length());

        String seccion;
        switch (primer) {
            case "animales":       seccion = "Animales";      break;
            case "almacen":        seccion = "Almacén";       break;
            case "configuracion":  seccion = "Configuración"; break;
            case "adopciones":     seccion = "Adopciones";    break;
            case "acogidas":       seccion = "Acogidas";      break;
            case "blog":           seccion = "Blog";          break;
            case "usuarios":       seccion = "Usuarios";      break;
            case "formularios":    seccion = "Formularios";   break;
            default:               seccion = "Otros";         break;
        }
        return new Seccion(seccion, sufijo);
    }

    private String traducirAccion(String metodo, String sufijo) {
        switch (metodo.toUpperCase()) {
            case "POST":   return sufijo.contains("solicitudes") ? "Crear solicitud" : "Crear";
            case "PUT":    return sufijo.endsWith("/completar") ? "Completar" : "Editar";
            case "PATCH":  return "Cambiar estado";
            case "DELETE": return "Eliminar";
            default:       return metodo.toUpperCase();
        }
    }

    private static final class Seccion {
        final String seccion;
        final String sufijo;
        Seccion(String seccion, String sufijo) {
            this.seccion = seccion;
            this.sufijo = sufijo;
        }
    }
}