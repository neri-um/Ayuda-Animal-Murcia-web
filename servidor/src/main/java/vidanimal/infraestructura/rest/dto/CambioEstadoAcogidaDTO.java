package vidanimal.infraestructura.rest.dto;

import vidanimal.dominio.modelo.EstadoSolicitudCuestionario;

public class CambioEstadoAcogidaDTO {
	private EstadoSolicitudCuestionario estado;

	public CambioEstadoAcogidaDTO() {
	}

	public EstadoSolicitudCuestionario getEstado() {
		return estado;
	}

	public void setEstado(EstadoSolicitudCuestionario estado) {
		this.estado = estado;
	}
}