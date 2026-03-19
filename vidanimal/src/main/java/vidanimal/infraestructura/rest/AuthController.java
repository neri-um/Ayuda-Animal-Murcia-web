package vidanimal.infraestructura.rest;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import vidanimal.dominio.modelo.Usuario;
import vidanimal.dominio.puerto.entrada.UsuarioServicioPuerto;
import vidanimal.infraestructura.rest.dto.LoginDTO;
import vidanimal.infraestructura.seguridad.JwtUtil;

/**
 * Controlador de autenticación.
 *
 * Equivalente a lo de clase:
 *   @POST @Path("/login")
 *   public Response login(@FormParam("username") String username,
 *                          @FormParam("password") String password) {
 *       Map<String, Object> claims = verificarCredenciales(username, password);
 *       String token = generarToken(claims);
 *       return Response.ok(token).build();
 *   }
 */
@RestController
@RequestMapping("/vidanimal/auth")
public class AuthController {

    private final UsuarioServicioPuerto servicio;

    public AuthController(UsuarioServicioPuerto servicio) {
        this.servicio = servicio;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO dto) {

        // 1. Verificar credenciales
        Usuario usuario = servicio.login(dto.getEmail(), dto.getPassword());

        // 2. Crear claims (como en clase)
        // En los claims se incluye "sub" con el id del usuario
        // y cualquier otra información que necesitemos
        Map<String, Object> claims = new HashMap<>();
        claims.put("sub", usuario.getId().toString());   // obligatorio
        claims.put("nombre", usuario.getNombre());
        claims.put("email", usuario.getEmail());
        claims.put("roles", usuario.getRol().name());    // ADMIN, ENCARGADO, VOLUNTARIO

        // 3. Generar token
        String token = JwtUtil.generarToken(claims);

        // 4. Devolver token + datos del usuario
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("token", token);
        respuesta.put("usuario", usuario);

        return ResponseEntity.ok(respuesta);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        // Con JWT el logout es del lado del cliente
        // (el frontend borra el token)
        return ResponseEntity.noContent().build();
    }
}