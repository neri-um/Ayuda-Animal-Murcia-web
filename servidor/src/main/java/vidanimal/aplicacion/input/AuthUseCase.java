package vidanimal.aplicacion.input;

import vidanimal.dominio.modelo.Usuario;

public interface AuthUseCase {

    // CU-06
    Usuario login(String email, String password);

    // CU-07
    void logout();
}