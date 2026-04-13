package vidanimal.infraestructura.rest.dto;

import vidanimal.dominio.modelo.CitaVeterinaria;
import vidanimal.dominio.modelo.Tratamiento;

public class CitaNuevaDTO {

	private String tratamiento;
	private String descripcion;
	private String fecha; // "YYYY-MM-DD"
	private String veterinario;

	// Las citas añadidas manualmente siempre son completadas (ya realizadas)
	public CitaVeterinaria toDominio() {
		CitaVeterinaria cita = new CitaVeterinaria();
		cita.setTratamiento(DtoParsers.parseEnum(Tratamiento.class, tratamiento, "tratamiento"));
		cita.setDescripcion(descripcion);
		cita.setFecha(DtoParsers.parseLocalDate(fecha, "fecha"));
		cita.setVeterinario(veterinario);
		cita.setCompletada(true);
		return cita;
	}

	public String getTratamiento() { return tratamiento; }
	public void setTratamiento(String tratamiento) { this.tratamiento = tratamiento; }

	public String getDescripcion() { return descripcion; }
	public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

	public String getFecha() { return fecha; }
	public void setFecha(String fecha) { this.fecha = fecha; }

	public String getVeterinario() { return veterinario; }
	public void setVeterinario(String veterinario) { this.veterinario = veterinario; }
}
