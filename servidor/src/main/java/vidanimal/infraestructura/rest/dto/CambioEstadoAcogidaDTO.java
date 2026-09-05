package vidanimal.infraestructura.rest.dto;

import vidanimal.dominio.modelo.EstadoAcogida;

public class CambioEstadoAcogidaDTO {
	private EstadoAcogida estado;

	public CambioEstadoAcogidaDTO() {
	}

	public EstadoAcogida getEstado() {
		return estado;
	}

	public void setEstado(EstadoAcogida estado) {
		this.estado = estado;
	}
}