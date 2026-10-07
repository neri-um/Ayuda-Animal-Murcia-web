package vidanimal.dominio.modelo;

/** Tipo de colaboración recibida desde la página pública "Colaborar". */
public enum TipoColaboracion {
    VOLUNTARIADO,
    VOLUNTARIADO_UMU,
    ACOGIDA;

    /** Convierte el texto recibido del formulario (tolerante a mayúsculas/espacios). */
    public static TipoColaboracion desde(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("El tipo de colaboración es obligatorio.");
        }
        String normalizado = valor.trim().toUpperCase();
        for (TipoColaboracion tipo : values()) {
            if (tipo.name().equals(normalizado)) {
                return tipo;
            }
        }
        throw new IllegalArgumentException("Tipo de colaboración no válido: " + valor);
    }
}