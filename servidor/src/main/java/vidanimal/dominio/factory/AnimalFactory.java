package vidanimal.dominio.factory;

import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;

import vidanimal.dominio.modelo.Animal;
import vidanimal.dominio.modelo.CitaVeterinaria;
import vidanimal.dominio.modelo.Especie;
import vidanimal.dominio.modelo.Estado;
import vidanimal.dominio.protocolo.IProtocoloVeterinario;
import vidanimal.dominio.protocolo.ProtocoloGato;
import vidanimal.dominio.protocolo.ProtocoloPerroAdulto;
import vidanimal.dominio.protocolo.ProtocoloPerroCachorro;

public class AnimalFactory {

    public static Animal crear(Especie especie, String nombre,
                                LocalDate fechaNacimiento, LocalDate fechaIngreso) {

        Animal animal = new Animal();
        animal.setEspecie(especie);
        animal.setNombre(nombre);
        animal.setFechaNacimiento(fechaNacimiento);
        animal.setFechaIngreso(fechaIngreso);
        animal.setEstado(Estado.EN_ADOPCION);
        animal.setProtocolo(new ArrayList<>());

        // Strategy: elige el protocolo según especie y edad
        IProtocoloVeterinario estrategia = getProtocolo(especie, fechaNacimiento);

        if (estrategia != null) {
            List<CitaVeterinaria> citas = estrategia.getProtocolo();
            // Asociar cada cita al animal
            for (CitaVeterinaria cita : citas) {
                cita.setAnimal(animal);
            }
            animal.setProtocolo(citas);
        }

        return animal;
    }

    private static IProtocoloVeterinario getProtocolo(Especie especie,
                                                       LocalDate fechaNacimiento) {
        switch (especie) {
            case PERRO:
                int anyos = Period.between(fechaNacimiento, LocalDate.now()).getYears();
                return anyos < 1 ? new ProtocoloPerroCachorro()
                                 : new ProtocoloPerroAdulto();
            case GATO:
                return new ProtocoloGato();
            default:
                // ROEDOR, AVE, REPTIL: sin protocolo definido por ahora
                return null;
        }
    }
}