package vidanimal.dominio.protocolo;

import vidanimal.dominio.modelo.CitaVeterinaria;
import vidanimal.dominio.modelo.Tratamiento;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class ProtocoloGato implements IProtocoloVeterinario {

    @Override
    public List<CitaVeterinaria> getProtocolo() {
        List<CitaVeterinaria> citas = new ArrayList<>();

        // Desparasitación interna
        CitaVeterinaria desparasitacionInterna = new CitaVeterinaria();
        desparasitacionInterna.setTratamiento(Tratamiento.DESPARASITACION_INTERNA);
        desparasitacionInterna.setDescripcion("Desparasitación interna");
        desparasitacionInterna.setFecha(LocalDate.now().plusWeeks(1));
        citas.add(desparasitacionInterna);

        // Desparasitación externa
        CitaVeterinaria desparasitacionExterna = new CitaVeterinaria();
        desparasitacionExterna.setTratamiento(Tratamiento.DESPARASITACION_EXTERNA);
        desparasitacionExterna.setDescripcion("Desparasitación externa");
        desparasitacionExterna.setFecha(LocalDate.now().plusWeeks(1));
        citas.add(desparasitacionExterna);

        // Trivalente felina — dosis 1
        CitaVeterinaria trivalente1 = new CitaVeterinaria();
        trivalente1.setTratamiento(Tratamiento.TRIVALENTE_FELINA);
        trivalente1.setDescripcion("Vacuna trivalente felina \u2014 dosis 1");
        trivalente1.setFecha(LocalDate.now().plusWeeks(1));
        citas.add(trivalente1);

        // Test FeLV/FIV
        CitaVeterinaria testFelvFiv = new CitaVeterinaria();
        testFelvFiv.setTratamiento(Tratamiento.TEST_FELV_FIV);
        testFelvFiv.setDescripcion("Test de leucemia felina y virus de inmunodeficiencia felina");
        testFelvFiv.setFecha(LocalDate.now().plusWeeks(2));
        citas.add(testFelvFiv);

        // Microchip
        CitaVeterinaria microchip = new CitaVeterinaria();
        microchip.setTratamiento(Tratamiento.MICROCHIP);
        microchip.setDescripcion("Implantaci\u00f3n de microchip");
        microchip.setFecha(LocalDate.now().plusWeeks(2));
        citas.add(microchip);

        // Trivalente felina — dosis 2
        CitaVeterinaria trivalente2 = new CitaVeterinaria();
        trivalente2.setTratamiento(Tratamiento.TRIVALENTE_FELINA);
        trivalente2.setDescripcion("Vacuna trivalente felina \u2014 dosis 2");
        trivalente2.setFecha(LocalDate.now().plusWeeks(5));
        citas.add(trivalente2);

        // Castración
        CitaVeterinaria castracion = new CitaVeterinaria();
        castracion.setTratamiento(Tratamiento.CASTRACION);
        castracion.setDescripcion("Esterilizaci\u00f3n felina");
        castracion.setFecha(LocalDate.now().plusMonths(2));
        citas.add(castracion);

        return citas;
    }
}
