package vidanimal.aplicacion.input;

import vidanimal.dominio.modelo.Usuario;

public interface AuthUseCase {

    Usuario login(String email, String password);

    void logout();
}
