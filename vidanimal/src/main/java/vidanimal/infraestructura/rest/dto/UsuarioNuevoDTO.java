package vidanimal.infraestructura.rest.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class UsuarioNuevoDTO {

	@NotBlank(message = "El email es obligatorio")
	private String email;

	@NotBlank(message = "La contraseña es obligatoria")
	private String password;

	@NotBlank(message = "El nombre es obligatorio")
	private String nombre;

	private String apellidos;
	private String telefono;

	@NotNull(message = "El rol es obligatorio")
	private String rol;

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getApellidos() {
		return apellidos;
	}

	public void setApellidos(String apellidos) {
		this.apellidos = apellidos;
	}

	public String getTelefono() {
		return telefono;
	}

	public void setTelefono(String telefono) {
		this.telefono = telefono;
	}

	public String getRol() {
		return rol;
	}

	public void setRol(String rol) {
		this.rol = rol;
	}
}