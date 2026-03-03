package vidanimal.protocolo;

import java.util.List;

import vidanimal.modelo.Tratamiento;

public class ProtocoloPerroCachorro implements IProtocoloVeterinario{
    @Override
    public List<Tratamiento> getProtocolo() {
        return List.of(
                Tratamiento.DESPARASITACION_INTERNA,
                Tratamiento.DESPARASITACION_EXTERNA,
                Tratamiento.POLIVALENTE,
                Tratamiento.POLIVALENTE,
                Tratamiento.POLIVALENTE,
                Tratamiento.TEST_LEISHMANIA,
                Tratamiento.CASTRACION
            );
    }
}
