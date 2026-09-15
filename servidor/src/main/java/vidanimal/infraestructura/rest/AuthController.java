package vidanimal.infraestructura.rest;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import vidanimal.aplicacion.input.AuthUseCase;
import vidanimal.dominio.modelo.Usuario;
import vidanimal.infraestructura.rest.dto.LoginDTO;
import vidanimal.infraestructura.seguridad.JwtUtil;

@RestController
@RequestMapping("/vidanimal/auth")
public class AuthController {

    private final AuthUseCase servicio;

    public AuthController(AuthUseCase servicio) {
        this.servicio = servicio;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO dto) {

        Usuario usuario = servicio.login(dto.getUsuario(), dto.getPassword());

        Map<String, Object> claims = new HashMap<>();
        claims.put("sub", usuario.getId().toString());
        claims.put("nombre", usuario.getNombre());
        claims.put("usuario", usuario.getUsuario());
        claims.put("roles", usuario.getRol().name());

        String token = JwtUtil.generarToken(claims);

        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("token", token);
        respuesta.put("usuario", usuario);

        return ResponseEntity.ok(respuesta);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        servicio.logout();
        return ResponseEntity.noContent().build();
    }
}