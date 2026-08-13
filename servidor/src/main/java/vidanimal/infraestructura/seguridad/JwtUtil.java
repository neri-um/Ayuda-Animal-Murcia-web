package vidanimal.infraestructura.seguridad;

import java.time.Instant;
import java.util.Date;
import java.util.Map;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

/**
 * Clase utilitaria para generar y validar tokens JWT.
 *
 * Un token JWT tiene 3 partes:
 * 1. ENCABEZADO: algoritmo (HS256) y tipo (JWT)
 * 2. CUERPO (claims): sub (id usuario), roles, nombre, email, exp (caducidad)
 * 3. FIRMA: se calcula con encabezado + cuerpo + clave secreta
 *
 * El token resultante es: base64(encabezado).base64(cuerpo).firma
 */
public class JwtUtil {

    // Clave secreta leída desde la variable de entorno JWT_SECRET.
    // Si no está definida en producción, la aplicación lanza error en arranque (fail-fast).
    private static final String SECRET_KEY = resolverClave();

    private static String resolverClave() {
        String clave = System.getenv("JWT_SECRET");
        if (clave != null && !clave.isBlank()) {
            return clave;
        }
        // En desarrollo local se usa un valor por defecto; en producción JWT_SECRET es obligatoria.
        String claveDesarrollo = "vidanimal_secret_key_dev_only_not_for_production";
        System.out.println("[JwtUtil] AVISO: JWT_SECRET no definida; usando clave de desarrollo.");
        return claveDesarrollo;
    }

    public static String generarToken(Map<String, Object> claims) {
        Date caducidad = Date.from(Instant.now().plusSeconds(3600)); // 1 hora

        return Jwts.builder()
                .setClaims(claims)
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .setExpiration(caducidad)
                .compact();
    }

    /**
     * Valida un token y devuelve los claims.
     * Si el token es inválido o ha caducado, lanza excepción.
     */
    public static Claims validarToken(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
    }
}