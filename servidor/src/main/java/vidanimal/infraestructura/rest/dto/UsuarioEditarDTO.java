package vidanimal.infraestructura.rest.dto;

import vidanimal.dominio.modelo.Rol;
import vidanimal.dominio.modelo.Usuario;

public class UsuarioEditarDTO {

    private String nombre;
    private String apellidos;
    private String telefono;
    private String rol;


    public Usuario toDominio() {
        Usuario u = new Usuario();
        u.setNombre(this.nombre);
        u.setApellidos(this.apellidos);
        u.setTelefono(this.telefono);

        if (this.rol != null && !this.rol.isBlank()) {
            u.setRol(parseRol(this.rol));
        }

        return u;
    }

    private Rol parseRol(String rol) {
        try {
            return Rol.valueOf(rol.trim().toUpperCase());
        } catch (Exception e) {
            throw new RuntimeException("Rol inválido: " + rol + ". Valores válidos: ADMIN, ENCARGADO, VOLUNTARIO");
        }
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