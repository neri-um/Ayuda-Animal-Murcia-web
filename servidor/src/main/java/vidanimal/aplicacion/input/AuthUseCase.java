package vidanimal.aplicacion.input;

import vidanimal.dominio.modelo.Usuario;

public interface AuthUseCase {

    // CU-05
    Usuario login(String email, String password);

    // CU-06
    void logout();
}