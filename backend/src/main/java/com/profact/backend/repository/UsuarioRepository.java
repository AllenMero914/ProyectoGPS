package com.profact.backend.repository;

import com.profact.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositorio JPA para la entidad Usuario.
 * Proporciona operaciones CRUD y consultas personalizadas.
 */
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    /**
     * Busca un usuario por su nombre de usuario.
     *
     * @param usuario el nombre de usuario a buscar
     * @return un Optional con el usuario encontrado, o vacío si no existe
     */
    Optional<Usuario> findByUsuario(String usuario);

    /**
     * Verifica si existe un usuario con el nombre de usuario dado.
     *
     * @param usuario el nombre de usuario a verificar
     * @return true si el usuario existe, false en caso contrario
     */
    boolean existsByUsuario(String usuario);
}
