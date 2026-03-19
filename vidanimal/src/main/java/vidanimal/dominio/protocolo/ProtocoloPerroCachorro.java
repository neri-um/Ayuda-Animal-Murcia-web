package vidanimal.dominio.protocolo;

import vidanimal.dominio.modelo.CitaVeterinaria;
import vidanimal.dominio.modelo.Tratamiento;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class ProtocoloPerroCachorro implements IProtocoloVeterinario {

    @Override
    public List<CitaVeterinaria> getProtocolo() {
        List<CitaVeterinaria> citas = new ArrayList<>();

        CitaVeterinaria revision = new CitaVeterinaria();
        revision.setTratamiento(Tratamiento.REVISION);
        revision.setDescripcion("Revisión inicial cachorro");
        revision.setFecha(LocalDate.now());
        citas.add(revision);

        CitaVeterinaria vacuna1 = new CitaVeterinaria();
        vacuna1.setTratamiento(Tratamiento.POLIVALENTE);
        vacuna1.setDescripcion("Primera vacuna polivalente");
        vacuna1.setFecha(LocalDate.now().plusWeeks(1));
        citas.add(vacuna1);

        CitaVeterinaria vacuna2 = new CitaVeterinaria();
        vacuna2.setTratamiento(Tratamiento.POLIVALENTE);
        vacuna2.setDescripcion("Refuerzo vacuna polivalente");
        vacuna2.setFecha(LocalDate.now().plusWeeks(4));
        citas.add(vacuna2);

        CitaVeterinaria desparasitacion = new CitaVeterinaria();
        desparasitacion.setTratamiento(Tratamiento.DESPARASITACION_INTERNA);
        desparasitacion.setDescripcion("Desparasitación interna y externa");
        desparasitacion.setFecha(LocalDate.now().plusWeeks(1));
        citas.add(desparasitacion);

        CitaVeterinaria microchip = new CitaVeterinaria();
        microchip.setTratamiento(Tratamiento.MICROCHIP);
        microchip.setDescripcion("Implantación de microchip");
        microchip.setFecha(LocalDate.now().plusWeeks(2));
        citas.add(microchip);

        CitaVeterinaria castracion = new CitaVeterinaria();
        castracion.setTratamiento(Tratamiento.CASTRACION);
        castracion.setDescripcion("Esterilización (cuando tenga edad)");
        castracion.setFecha(LocalDate.now().plusMonths(6));
        citas.add(castracion);

        return citas;
    }
}