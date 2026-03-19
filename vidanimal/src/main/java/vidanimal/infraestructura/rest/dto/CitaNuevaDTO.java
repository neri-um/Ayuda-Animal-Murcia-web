package vidanimal.infraestructura.rest.dto;

import vidanimal.dominio.modelo.CitaVeterinaria;
import vidanimal.dominio.modelo.Tratamiento;
import java.time.LocalDate;

public class CitaNuevaDTO {
	private Tratamiento tratamiento;
	private String descripcion;
	private LocalDate fecha;
	private String veterinario;

	public CitaVeterinaria toDominio() {
		CitaVeterinaria cita = new CitaVeterinaria();
		cita.setTratamiento(this.tratamiento);
		cita.setDescripcion(this.descripcion);
		cita.setFecha(this.fecha);
		cita.setVeterinario(this.veterinario);
		return cita;
	}

	public Tratamiento getTratamiento() {
		return tratamiento;
	}

	public void setTratamiento(Tratamiento tratamiento) {
		this.tratamiento = tratamiento;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public LocalDate getFecha() {
		return fecha;
	}

	public void setFecha(LocalDate fecha) {
		this.fecha = fecha;
	}

	public String getVeterinario() {
		return veterinario;
	}

	public void setVeterinario(String veterinario) {
		this.veterinario = veterinario;
	}
}