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
    public Usuario login(String usuario, String password) {
        Usuario u = usuarioRepo.buscarPorUsuario(usuario)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "Usuario con nombre" + usuario + " no encontrado"));

        if (!u.isActivo()) {
            throw new RuntimeException("La cuenta está desactivada");
        }

        if (!passwordEncoder.matches(password, u.getPassword())) {
            throw new RuntimeException("Credenciales inválidas");
        }

        return u;
    }

    @Override
    public void logout() {
        // JWT stateless: logout lo gestiona el cliente eliminando el token
    }
}