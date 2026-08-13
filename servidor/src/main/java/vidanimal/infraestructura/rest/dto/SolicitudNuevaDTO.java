package vidanimal.infraestructura.rest.dto;

public class SolicitudNuevaDTO {
	private Long voluntarioId;
	private Long productoId;
	private int cantidad;
	private String motivo;

	public CrearSolicitudCommand toCommand() {
		return new CrearSolicitudCommand(voluntarioId, productoId, cantidad, motivo);
	}

	public static class CrearSolicitudCommand {
		private final Long voluntarioId;
		private final Long productoId;
		private final int cantidad;
		private final String motivo;

		public CrearSolicitudCommand(Long voluntarioId, Long productoId, int cantidad, String motivo) {
			this.voluntarioId = voluntarioId;
			this.productoId = productoId;
			this.cantidad = cantidad;
			this.motivo = motivo;
		}

		public Long getVoluntarioId() {
			return voluntarioId;
		}

		public Long getProductoId() {
			return productoId;
		}

		public int getCantidad() {
			return cantidad;
		}

		public String getMotivo() {
			return motivo;
		}
	}

	public Long getVoluntarioId() {
		return voluntarioId;
	}

	public void setVoluntarioId(Long voluntarioId) {
		this.voluntarioId = voluntarioId;
	}

	public Long getProductoId() {
		return productoId;
	}

	public void setProductoId(Long productoId) {
		this.productoId = productoId;
	}

	public int getCantidad() {
		return cantidad;
	}

	public void setCantidad(int cantidad) {
		this.cantidad = cantidad;
	}

	public String getMotivo() {
		return motivo;
	}

	public void setMotivo(String motivo) {
		this.motivo = motivo;
	}
}