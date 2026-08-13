package vidanimal.infraestructura.config;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * Migraciones puntuales de esquema que ddl-auto=update no hace
 * (Hibernate crea tablas/columnas nuevas pero nunca altera columnas ni
 * constraints existentes).
 * Idempotente: cada migración comprueba antes de actuar.
 */
@Component
public class MigracionesEsquema {

    private static final Logger LOGGER = LoggerFactory.getLogger(MigracionesEsquema.class);
    private final JdbcTemplate jdbc;

    public MigracionesEsquema(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void ejecutar() {
        ampliarDescripcionAnimal();
        quitarChecksEnumAnimal();
        crearColumnasBooleanas();
    }

    // PostgreSQL NO permite añadir una columna boolean NOT NULL a una tabla con
    // filas a menos que lleve un DEFAULT: si Hibernate (ddl-auto=update) intenta
    // crear una columna nueva de un campo boolean sin default, falla con
    // 'column ... contains null values' y la columna no llega a crearse.
    // Aquí las creamos a mano con DEFAULT false (idempotente).
    private void crearColumnasBooleanas() {
        for (String columna : List.of("positivo_leucemia", "positivo_inmunodeficiencia",
                "compatible_perros_grandes", "compatible_perros_pequenos",
                "apto_gato_unico", "necesita_companero_felino", "flexible_convivencia_felina",
                "adopcion_conjunta")) {
            try {
                Integer existe = jdbc.queryForObject(
                        "SELECT COUNT(*) FROM information_schema.columns " +
                        "WHERE table_name = 'animal' AND column_name = ?",
                        Integer.class, columna);
                if (existe == null || existe == 0) {
                    jdbc.execute("ALTER TABLE animal ADD COLUMN " + columna + " boolean NOT NULL DEFAULT false");
                    LOGGER.info("Columna animal.{} creada con DEFAULT false", columna);
                }
            } catch (Exception e) {
                LOGGER.warn("No se pudo crear la columna {}: {}", columna, e.getMessage());
            }
        }
    }

    // La descripción de un animal puede superar los 255 caracteres
    // (antes causaba el error SQL: value too long for character varying(255)).
    private void ampliarDescripcionAnimal() {
        try {
            String tipo = jdbc.queryForObject(
                    "SELECT data_type FROM information_schema.columns " +
                    "WHERE table_name = 'animal' AND column_name = 'descripcion'",
                    String.class);
            if (!"text".equalsIgnoreCase(tipo)) {
                jdbc.execute("ALTER TABLE animal ALTER COLUMN descripcion TYPE TEXT");
                LOGGER.info("Columna animal.descripcion ampliada a TEXT");
            }
        } catch (Exception e) {
            LOGGER.warn("No se pudo ampliar animal.descripcion: {}", e.getMessage());
        }
    }

    // Cuando Hibernate creó la tabla 'animal' por primera vez, añadió un CHECK
    // por cada columna enum con los valores de entonces. Si luego se añaden
    // valores al enum (p. ej. Tamanyo.ESTANDAR), ddl-auto=update NO actualiza
    // esos CHECK y la base de datos rechaza los valores nuevos con un error 400
    // (violates check constraint animal_tamanyo_check). El enum de Java ya valida
    // los valores, así que estos CHECK son redundantes: se eliminan.
    private void quitarChecksEnumAnimal() {
        for (String columna : List.of("tamanyo", "especie", "sexo", "estado")) {
            String constraint = "animal_" + columna + "_check";
            try {
                Integer existe = jdbc.queryForObject(
                        "SELECT COUNT(*) FROM pg_constraint " +
                        "WHERE conname = ? AND conrelid = 'animal'::regclass",
                        Integer.class, constraint);
                if (existe != null && existe > 0) {
                    jdbc.execute("ALTER TABLE animal DROP CONSTRAINT " + constraint);
                    LOGGER.info("Constraint {} eliminada", constraint);
                }
            } catch (Exception e) {
                LOGGER.warn("No se pudo eliminar la constraint {}: {}", constraint, e.getMessage());
            }
        }
    }
}
