package vidanimal.protocolo;

import java.util.List;
import vidanimal.modelo.Tratamiento;

public class ProtocoloPerroAdulto implements IProtocoloVeterinario {

    @Override
    public List<Tratamiento> getProtocolo() {
        return List.of(
                Tratamiento.DESPARASITACION_INTERNA,
                Tratamiento.DESPARASITACION_EXTERNA,
                Tratamiento.POLIVALENTE,
                Tratamiento.POLIVALENTE,
                Tratamiento.RABIA,
                Tratamiento.TEST_LEISHMANIA,
                Tratamiento.CASTRACION
            );
    }
}
