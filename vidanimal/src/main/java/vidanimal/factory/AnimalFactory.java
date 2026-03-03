package vidanimal.factory;

import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;

import vidanimal.modelo.Animal;
import vidanimal.modelo.Especie;
import vidanimal.modelo.Estado;
import vidanimal.protocolo.IProtocoloVeterinario;
import vidanimal.protocolo.ProtocoloGato;
import vidanimal.protocolo.ProtocoloPerroAdulto;
import vidanimal.protocolo.ProtocoloPerroCachorro;

public class AnimalFactory {

    public static Animal crear(Especie especie, String nombre,
                               LocalDate fechaNacimiento, LocalDate fechaIngreso) {
        Animal animal = new Animal(especie, nombre, fechaNacimiento, fechaIngreso);
        animal.setEstado(Estado.EN_ADOPCION);
        animal.setProtocolo(new ArrayList<>());

        IProtocoloVeterinario estrategia = getProtocolo(especie, fechaNacimiento);
        if (estrategia != null) {
            animal.setProtocolo(estrategia.getProtocolo());
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
                // ROEDOR y CONEJO: sin protocolo definido por ahora
                return null;
        }
    }
}