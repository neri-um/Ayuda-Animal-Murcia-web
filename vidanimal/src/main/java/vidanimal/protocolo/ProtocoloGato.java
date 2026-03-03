package vidanimal.protocolo;

import java.util.List;
import vidanimal.modelo.Tratamiento;

public class ProtocoloGato implements IProtocoloVeterinario {

    @Override
    public List<Tratamiento> getProtocolo() {
        return List.of(
	            Tratamiento.DESPARASITACION_INTERNA,
	            Tratamiento.DESPARASITACION_EXTERNA,
	            Tratamiento.TRIVALENTE_FELINA,
	            Tratamiento.TRIVALENTE_FELINA,
	            Tratamiento.TEST_FELV_FIV,
	            Tratamiento.CASTRACION

        );
    }
}
