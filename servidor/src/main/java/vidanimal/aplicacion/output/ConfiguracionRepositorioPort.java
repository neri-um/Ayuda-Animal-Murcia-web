package vidanimal.aplicacion.output;

import java.util.Optional;

public interface ConfiguracionRepositorioPort {
    Optional<String> obtenerValor(String clave);
    void guardarValor(String clave, String valor);
    void eliminarClave(String clave);
}
