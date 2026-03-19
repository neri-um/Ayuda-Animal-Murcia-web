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

    // Clave secreta para firmar los tokens (en producción usar variable de entorno)
    private static final String SECRET_KEY = "vidanimal_secret_key_2026_tfg";

    /**
     * Genera un token JWT con los claims proporcionados.
     * Equivalente a lo que se hace en clase con JAX-RS:
     *
     *   Jwts.builder()
     *       .setClaims(claims)
     *       .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
     *       .setExpiration(caducidad)
     *       .compact();
     */
    public static String generarToken(Map<String, Object> claims) {
        Date caducidad = Date.from(Instant.now().plusSeconds(3600)); // 1 hora

        return Jwts.builder()
                .setClaims(claims)              // cuerpo: sub, roles, nombre...
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY) // firma con HS256
                .setExpiration(caducidad)        // cuándo caduca
                .compact();                      // genera el string del token
    }

    /**
     * Valida un token y devuelve los claims.
     * Si el token es inválido o ha caducado, lanza excepción.
     *
     * Equivalente a lo de clase:
     *   Jwts.parser()
     *       .setSigningKey(SECRET_KEY)
     *       .parseClaimsJws(token)
     *       .getBody();
     */
    public static Claims validarToken(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)       // misma clave que al firmar
                .parseClaimsJws(token)           // verifica firma + caducidad
                .getBody();                      // devuelve el cuerpo (claims)
    }
}