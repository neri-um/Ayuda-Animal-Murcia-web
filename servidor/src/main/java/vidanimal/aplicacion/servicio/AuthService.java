package vidanimal.aplicacion.servicio;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import vidanimal.aplicacion.input.AuthUseCase;
import vidanimal.aplicacion.output.UsuarioRepositorioPort;
import vidanimal.dominio.excepcion.RecursoNoEncontradoException;
import vidanimal.dominio.modelo.Usuario;

@Service
public class AuthService implements AuthUseCase {

    private final UsuarioRepositorioPort usuarioRepo;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UsuarioRepositorioPort usuarioRepo, PasswordEncoder passwordEncoder) {
        this.usuarioRepo = usuarioRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Usuario login(String email, String password) {
        Usuario usuario = usuarioRepo.buscarPorEmail(email)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "Usuario con email " + email + " no encontrado"));

        if (!usuario.isActivo()) {
            throw new RuntimeException("La cuenta está desactivada");
        }

        if (!passwordEncoder.matches(password, usuario.getPassword())) {
            throw new RuntimeException("Credenciales inválidas");
        }

        return usuario;
    }

    @Override
    public void logout() {
        // JWT stateless: logout lo gestiona el cliente eliminando el token
    }
}