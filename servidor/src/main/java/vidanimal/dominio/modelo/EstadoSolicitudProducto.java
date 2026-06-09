package vidanimal.dominio.modelo;

public enum EstadoSolicitudProducto {
    PENDIENTE,              // CU-15: estado inicial
    ACEPTADA,               // CU-20: encargado acepta
    RECHAZADA,              // CU-20: encargado rechaza
    DEVOLUCION_NOTIFICADA,  // CU-16: voluntario avisa
    DEVUELTA                // CU-22: encargado confirma
}