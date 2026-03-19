package vidanimal.aplicacion.servicio;

import org.springframework.stereotype.Service;

import vidanimal.aplicacion.input.AuthUseCase;
import vidanimal.aplicacion.output.UsuarioRepositorioPort;
import vidanimal.dominio.excepcion.RecursoNoEncontradoException;
import vidanimal.dominio.modelo.Usuario;

@Service
public class AuthService implements AuthUseCase {

    private final UsuarioRepositorioPort usuarioRepo;

    public AuthService(UsuarioRepositorioPort usuarioRepo) {
        this.usuarioRepo = usuarioRepo;
    }

    @Override
    public Usuario login(String email, String password) {
        Usuario usuario = usuarioRepo.buscarPorEmail(email)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "Usuario con email " + email + " no encontrado"));

        if (usuario.getPassword() == null || !usuario.getPassword().equals(password)) {
            throw new RuntimeException("Credenciales inválidas");
        }

        return usuario;
    }

    @Override
    public void logout() {
        // JWT stateless: logout lo gestiona el cliente
    }
}