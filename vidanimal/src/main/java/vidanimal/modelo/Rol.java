package vidanimal.modelo;

public enum Rol {
    VOLUNTARIO,   // CU-06 a CU-16
    ENCARGADO,    // CU-17 a CU-22 (hereda voluntario)
    ADMIN         // CU-23 a CU-25 (hereda todo)
}