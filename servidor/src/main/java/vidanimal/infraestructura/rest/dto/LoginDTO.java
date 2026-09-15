package vidanimal.infraestructura.rest.dto;

public class LoginDTO {
	private String usuario;
	private String password;
    public String getUsuario;

	public String getUsuario() {
		return usuario;
	}

	public void setUsuario(String usuario) {
		this.usuario = usuario;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
}