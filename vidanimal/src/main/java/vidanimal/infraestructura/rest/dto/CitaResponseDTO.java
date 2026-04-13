package vidanimal.infraestructura.rest.dto;

import vidanimal.dominio.modelo.CitaVeterinaria;

public class CitaResponseDTO {

    private Long id;
    private Long animalId;
    private String tratamiento;
    private String descripcion;
    private String fecha;       // ISO string "2026-06-13"
    private String veterinario;
    private boolean completada;

    public CitaResponseDTO() {}

    public static CitaResponseDTO from(CitaVeterinaria c) {
        CitaResponseDTO dto = new CitaResponseDTO();
        dto.id          = c.getId();
        dto.animalId    = c.getAnimal() != null ? c.getAnimal().getId() : null;
        dto.tratamiento = c.getTratamiento() != null ? c.getTratamiento().name() : null;
        dto.descripcion = c.getDescripcion();
        dto.fecha       = c.getFecha() != null ? c.getFecha().toString() : null;
        dto.veterinario = c.getVeterinario();
        dto.completada  = c.isCompletada();
        return dto;
    }

    public Long getId()            { return id; }
    public Long getAnimalId()      { return animalId; }
    public String getTratamiento() { return tratamiento; }
    public String getDescripcion() { return descripcion; }
    public String getFecha()       { return fecha; }
    public String getVeterinario() { return veterinario; }
    public boolean isCompletada()  { return completada; }
}
