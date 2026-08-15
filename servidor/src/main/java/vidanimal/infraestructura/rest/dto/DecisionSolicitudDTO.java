package vidanimal.infraestructura.rest.dto;

public class DecisionSolicitudDTO {

	private String decision; // "ACEPTADA" o "RECHAZADA"
	private Long encargadoId;
	private String notaEncargado;
	private String detalleEntregado;

	public DecisionCommand toCommand() {
		return new DecisionCommand(decision, encargadoId, notaEncargado, detalleEntregado);
	}

	public static class DecisionCommand {
		private final String decision;
		private final Long encargadoId;
		private final String notaEncargado;
		private final String detalleEntregado;

		public DecisionCommand(String decision, Long encargadoId, String notaEncargado, String detalleEntregado) {
			this.decision = decision;
			this.encargadoId = encargadoId;
			this.notaEncargado = notaEncargado;
			this.detalleEntregado = detalleEntregado;
		}

		public String getDecision() {
			return decision;
		}

		public Long getEncargadoId() {
			return encargadoId;
		}

		public String getNotaEncargado() {
			return notaEncargado;
		}

		public String getDetalleEntregado() {
			return detalleEntregado;
		}
	}

	public String getDecision() {
		return decision;
	}

	public void setDecision(String decision) {
		this.decision = decision;
	}

	public Long getEncargadoId() {
		return encargadoId;
	}

	public void setEncargadoId(Long encargadoId) {
		this.encargadoId = encargadoId;
	}

	public String getNotaEncargado() {
		return notaEncargado;
	}

	public void setNotaEncargado(String notaEncargado) {
		this.notaEncargado = notaEncargado;
	}

	public String getDetalleEntregado() {
		return detalleEntregado;
	}

	public void setDetalleEntregado(String detalleEntregado) {
		this.detalleEntregado = detalleEntregado;
	}
}