package vidanimal.infraestructura.rest.dto;

public class DecisionSolicitudDTO {

	private String decision; // "ACEPTADA" o "RECHAZADA"
	private Long encargadoId;

	public DecisionCommand toCommand() {
		return new DecisionCommand(decision, encargadoId);
	}

	public static class DecisionCommand {
		private final String decision;
		private final Long encargadoId;

		public DecisionCommand(String decision, Long encargadoId) {
			this.decision = decision;
			this.encargadoId = encargadoId;
		}

		public String getDecision() {
			return decision;
		}

		public Long getEncargadoId() {
			return encargadoId;
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
}