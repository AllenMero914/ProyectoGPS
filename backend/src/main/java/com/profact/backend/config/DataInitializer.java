package com.profact.backend.config;

import com.profact.backend.model.Usuario;
import com.profact.backend.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuración para inicializar datos en la base de datos al arrancar la aplicación.
 * Crea el usuario administrador por defecto si no existe.
 */
@Configuration
public class DataInitializer {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    CommandLineRunner initDatabase(UsuarioRepository usuarioRepository) {
        return args -> {
            // Crear usuario administrador por defecto si no existe
            if (!usuarioRepository.existsByUsuario("root")) {
                Usuario admin = new Usuario(
                        "root",
                        "12345",
                        "Administrador",
                        "ADMIN"
                );
                usuarioRepository.save(admin);
                logger.info("✅ Usuario administrador creado: root / 12345");
            } else {
                logger.info("ℹ️ Usuario administrador 'root' ya existe en la base de datos.");
            }

            // Mostrar todos los usuarios registrados
            logger.info("📋 Usuarios registrados: {}", usuarioRepository.count());
            usuarioRepository.findAll().forEach(u ->
                    logger.info("   → {} ({})", u.getUsuario(), u.getRol())
            );
        };
    }
}
