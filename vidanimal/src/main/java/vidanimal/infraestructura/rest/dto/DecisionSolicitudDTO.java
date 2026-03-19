package vidanimal.infraestructura.rest.dto;

public class DecisionSolicitudDTO {
	private String decision;
	private Long encargadoId;

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