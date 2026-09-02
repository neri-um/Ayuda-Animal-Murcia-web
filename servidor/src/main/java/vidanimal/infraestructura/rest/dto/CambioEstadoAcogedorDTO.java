package vidanimal.infraestructura.rest.dto;

import vidanimal.dominio.modelo.EstadoAcogida;

public class CambioEstadoAcogedorDTO {
	private EstadoAcogida estado;

	public CambioEstadoAcogedorDTO() {
	}

	public EstadoAcogida getEstado() {
		return estado;
	}

	public void setEstado(EstadoAcogida estado) {
		this.estado = estado;
	}
}