package com.profact.backend.dto;

/**
 * DTO que representa la solicitud de inicio de sesión.
 * Contiene las credenciales del usuario: nombre de usuario y contraseña.
 */
public class LoginRequest {

    private String usuario;
    private String contrasenia;

    /**
     * Constructor por defecto.
     */
    public LoginRequest() {
    }

    // --- Getters y Setters ---

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public String getContrasenia() {
        return contrasenia;
    }

    public void setContrasenia(String contrasenia) {
        this.contrasenia = contrasenia;
    }

}
