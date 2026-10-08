package vidanimal.infraestructura.rest.dto;

import java.util.Map;

/**
 * Créditos CRAU asignados a la persona (voluntariado universitario UMU):
 * total acumulado más el desglose por categoría (clave → unidades).
 */
public class CrauDTO {

    private Integer crau;

    private Map<String, Integer> crauDetalle;

    public Integer getCrau() {
        return crau;
    }

    public void setCrau(Integer crau) {
        this.crau = crau;
    }

    public Map<String, Integer> getCrauDetalle() {
        return crauDetalle;
    }

    public void setCrauDetalle(Map<String, Integer> crauDetalle) {
        this.crauDetalle = crauDetalle;
    }
}