package vidanimal.infraestructura.persistencia.adaptador;

import java.util.Optional;
import org.springframework.stereotype.Component;
import vidanimal.aplicacion.output.ConfiguracionRepositorioPort;
import vidanimal.dominio.modelo.Configuracion;
import vidanimal.infraestructura.persistencia.ConfiguracionJpaRepository;

@Component
public class ConfiguracionRepositorioAdaptador implements ConfiguracionRepositorioPort {

    private final ConfiguracionJpaRepository jpa;

    public ConfiguracionRepositorioAdaptador(ConfiguracionJpaRepository jpa) {
        this.jpa = jpa;
    }

    @Override
    public Optional<String> obtenerValor(String clave) {
        return jpa.findById(clave).map(Configuracion::getValor);
    }

    @Override
    public void guardarValor(String clave, String valor) {
        jpa.save(new Configuracion(clave, valor));
    }

    @Override
    public void eliminarClave(String clave) {
        jpa.deleteById(clave);
    }
}
