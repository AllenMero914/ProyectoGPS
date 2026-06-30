package com.profact.backend.dto;

/**
 * DTO de respuesta para el endpoint de autenticación.
 * Incluye el estado de la operación y datos del usuario autenticado.
 */
public class LoginResponse {

    private boolean success;
    private String message;
    private String nombre;
    private String rol;
    private String token;

    // Constructor vacío requerido por Jackson
    public LoginResponse() {
    }

    // Constructor completo
    public LoginResponse(boolean success, String message, String nombre, String rol) {
        this.success = success;
        this.message = message;
        this.nombre = nombre;
        this.rol = rol;
    }

    public LoginResponse(boolean success, String message, String nombre, String rol, String token) {
        this.success = success;
        this.message = message;
        this.nombre = nombre;
        this.rol = rol;
        this.token = token;
    }

    // Getters y Setters

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
