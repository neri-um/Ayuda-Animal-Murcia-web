package vidanimal.infraestructura.rest.dto;

import vidanimal.dominio.modelo.EstadoSolicitudAdopcion;

public class CambioEstadoAdopcionDTO {
	private EstadoSolicitudAdopcion estado;

	public CambioEstadoAdopcionDTO() {
	}

	public EstadoSolicitudAdopcion getEstado() {
		return estado;
	}

	public void setEstado(EstadoSolicitudAdopcion estado) {
		this.estado = estado;
	}
}