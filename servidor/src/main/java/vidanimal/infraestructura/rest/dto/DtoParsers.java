package vidanimal.infraestructura.rest.dto;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;

public final class DtoParsers {

    private DtoParsers() {}

    public static <E extends Enum<E>> E parseEnum(Class<E> enumClass, String raw, String fieldName) {
        if (raw == null || raw.isBlank()) return null;
        try {
            return Enum.valueOf(enumClass, raw.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new RuntimeException("Valor inválido para '" + fieldName + "': " + raw);
        }
    }

    /** Espera ISO: YYYY-MM-DD */
    public static LocalDate parseLocalDate(String raw, String fieldName) {
        if (raw == null || raw.isBlank()) return null;
        try {
            return LocalDate.parse(raw.trim());
        } catch (DateTimeParseException ex) {
            throw new RuntimeException(
                "Fecha inválida para '" + fieldName + "': " + raw + ". Formato esperado: YYYY-MM-DD"
            );
        }
    }
}