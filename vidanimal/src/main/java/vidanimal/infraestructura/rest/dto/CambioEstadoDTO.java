package vidanimal.infraestructura.rest.dto;

import vidanimal.dominio.modelo.Estado;

public class CambioEstadoDTO {
	private Estado estado;

	public Estado getEstado() {
		return estado;
	}

	public void setEstado(Estado estado) {
		this.estado = estado;
	}
}