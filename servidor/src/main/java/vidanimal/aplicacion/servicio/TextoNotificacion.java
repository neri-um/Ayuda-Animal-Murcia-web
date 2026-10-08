package vidanimal.aplicacion.servicio;

/**
 * Textos comunes de las notificaciones que la aplicación envía a la propia
 * protectora. Todas las solicitudes (adopción, acogida, voluntariado y
 * voluntariado UMU) terminan con el mismo cierre, sin distinciones por tipo.
 */
public final class TextoNotificacion {

    private TextoNotificacion() {
    }

    /** Cierre común que se añade al final de todas las notificaciones. */
    public static String cierreDashboard(String dashboardUrl) {
        if (dashboardUrl == null || dashboardUrl.isBlank()) {
            return "";
        }
        return "\nEntra al Dashboard para leer el formulario completo y descargarlo:\n"
                + dashboardUrl.trim() + "\n";
    }
}
