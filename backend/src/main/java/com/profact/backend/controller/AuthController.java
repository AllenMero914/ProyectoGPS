package com.profact.backend.controller;

import com.profact.backend.dto.LoginRequest;
import com.profact.backend.dto.LoginResponse;
import com.profact.backend.model.Usuario;
import com.profact.backend.repository.UsuarioRepository;
import com.profact.backend.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

/**
 * Controlador REST para la autenticación de usuarios.
 * Valida las credenciales contra la base de datos H2 mediante JPA.
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final JwtUtil jwtUtil;

    public AuthController(UsuarioRepository usuarioRepository, JwtUtil jwtUtil) {
        this.usuarioRepository = usuarioRepository;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Endpoint para iniciar sesión.
     * Busca al usuario en la base de datos H2 y valida la contraseña.
     *
     * @param request objeto con las credenciales del usuario
     * @return respuesta con el resultado de la autenticación
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {

        // Buscar usuario en la base de datos
        Optional<Usuario> usuarioOpt = usuarioRepository.findByUsuario(request.getUsuario());

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();

            // Validar contraseña
            if (usuario.getContrasenia().equals(request.getContrasenia())) {
                // Credenciales correctas: generar JWT y responder 200 OK
                String token = jwtUtil.generateToken(usuario.getUsuario(), usuario.getRol());
                LoginResponse response = new LoginResponse(
                        true,
                        "Inicio de sesión exitoso",
                        usuario.getNombre(),
                        usuario.getRol(),
                        token
                );
                return ResponseEntity.ok(response);
            }
        }

        // Credenciales incorrectas: 401 Unauthorized
        LoginResponse response = new LoginResponse(
                false,
                "Credenciales incorrectas",
                null,
                null
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

}
