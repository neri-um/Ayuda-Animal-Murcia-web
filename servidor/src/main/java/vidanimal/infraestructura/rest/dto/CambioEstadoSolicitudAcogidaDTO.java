package vidanimal.infraestructura.rest.dto;

import vidanimal.dominio.modelo.EstadoSolicitudCuestionario;

public class CambioEstadoSolicitudAcogidaDTO {
	private EstadoSolicitudCuestionario estado;

	public CambioEstadoSolicitudAcogidaDTO() {
	}

	public EstadoSolicitudCuestionario getEstado() {
		return estado;
	}

	public void setEstado(EstadoSolicitudCuestionario estado) {
		this.estado = estado;
	}
}