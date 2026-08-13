package vidanimal.infraestructura.rest.dto;

import vidanimal.dominio.modelo.Estado;

public class CambioEstadoDTO {

    private String estado;

    public Estado getEstado() {
        return DtoParsers.parseEnum(Estado.class, estado, "estado");
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}