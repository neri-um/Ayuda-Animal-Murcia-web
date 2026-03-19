package vidanimal.infraestructura.rest.dto;

public class ConfirmacionDevolucionDTO {

	private Long encargadoId;

	public ConfirmarDevolucionCommand toCommand() {
		return new ConfirmarDevolucionCommand(encargadoId);
	}

	public static class ConfirmarDevolucionCommand {
		private final Long encargadoId;

		public ConfirmarDevolucionCommand(Long encargadoId) {
			this.encargadoId = encargadoId;
		}

		public Long getEncargadoId() {
			return encargadoId;
		}
	}

	public Long getEncargadoId() {
		return encargadoId;
	}

	public void setEncargadoId(Long encargadoId) {
		this.encargadoId = encargadoId;
	}
}