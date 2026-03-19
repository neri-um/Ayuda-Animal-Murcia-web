package vidanimal.dominio.protocolo;

import vidanimal.dominio.modelo.CitaVeterinaria;
import vidanimal.dominio.modelo.Tratamiento;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class ProtocoloPerroAdulto implements IProtocoloVeterinario {

    @Override
    public List<CitaVeterinaria> getProtocolo() {
        List<CitaVeterinaria> citas = new ArrayList<>();

        CitaVeterinaria revision = new CitaVeterinaria();
        revision.setTratamiento(Tratamiento.REVISION);
        revision.setDescripcion("Revisión general adulto");
        revision.setFecha(LocalDate.now());
        citas.add(revision);

        CitaVeterinaria vacuna = new CitaVeterinaria();
        vacuna.setTratamiento(Tratamiento.POLIVALENTE);
        vacuna.setDescripcion("Vacuna polivalente anual");
        vacuna.setFecha(LocalDate.now().plusWeeks(1));
        citas.add(vacuna);

        CitaVeterinaria desparasitacion = new CitaVeterinaria();
        desparasitacion.setTratamiento(Tratamiento.DESPARASITACION_INTERNA);
        desparasitacion.setDescripcion("Desparasitación interna y externa");
        desparasitacion.setFecha(LocalDate.now().plusWeeks(1));
        citas.add(desparasitacion);

        CitaVeterinaria microchip = new CitaVeterinaria();
        microchip.setTratamiento(Tratamiento.MICROCHIP);
        microchip.setDescripcion("Verificación/implantación de microchip");
        microchip.setFecha(LocalDate.now().plusWeeks(2));
        citas.add(microchip);

        CitaVeterinaria castracion = new CitaVeterinaria();
        castracion.setTratamiento(Tratamiento.CASTRACION);
        castracion.setDescripcion("Esterilización");
        castracion.setFecha(LocalDate.now().plusMonths(1));
        citas.add(castracion);

        return citas;
    }
}