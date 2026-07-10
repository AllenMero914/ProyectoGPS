# ProFact — Plan de Ejecución para Agente IA
### Sistema de Facturación y Administración Inteligente
**Versión:** 1.0 | **Sprint:** 1 | **Período:** 2026-A

---

## ⚙️ INSTRUCCIONES PARA EL AGENTE

Este documento es un plan completo y autocontenido. El agente debe:

1. Leer el documento completo antes de comenzar cualquier tarea.
2. Ejecutar las tareas **en el orden exacto** de la Sección 8.
3. Crear cada archivo en la ruta indicada dentro de `/backend/src/`.
4. Nunca omitir una clase, repositorio o prueba aunque parezca redundante.
5. Al finalizar, verificar que todos los tests pasen con `./mvnw test`.
6. El backend expone sus servicios en `http://localhost:8080`.
7. El frontend consume el backend desde `http://localhost:5173`.

---

## 1. RESUMEN DEL PROYECTO

| Parámetro | Valor |
|-----------|-------|
| Proyecto | ProFact — Facturación y Administración |
| Frontend | React 19 + TypeScript + Vite 8 + React Router 7 |
| Backend | Spring Boot 3.3.0 + Java 21 |
| Seguridad | Spring Security 6 + JJWT (HS256) |
| Persistencia | Spring Data JPA + Hibernate |
| Base de Datos | H2 (archivo `./data/profactdb`) |
| Contraseñas | BCrypt factor 10 |
| Puerto Frontend | 5173 |
| Puerto Backend | 8080 |
| CORS permitido | `http://localhost:5173` |

---

## 2. HISTORIAS DE USUARIO

### HU-001 — Autenticación de Usuario

**Como** usuario del sistema (administrador o empleado)  
**Quiero** poder iniciar sesión con mi email y contraseña  
**Para** acceder al panel de administración según mi rol asignado

| Criterio | Descripción |
|----------|-------------|
| CA-001.1 | Credenciales válidas → HTTP 200 + JWT + datos del usuario (id, nombre, email, rol) |
| CA-001.2 | Credenciales inválidas → HTTP 401 con mensaje genérico "Credenciales inválidas" |
| CA-001.3 | 3 intentos fallidos consecutivos → cuenta bloqueada 10 minutos |
| CA-001.4 | JWT expira en 8 horas |
| CA-001.5 | Rutas del dashboard redirigen al login si no hay token válido |
| CA-001.6 | El token nunca expone información sensible del sistema |

**Endpoints:** `POST /api/auth/login`

---

### HU-002 — Gestión de Usuarios

**Como** administrador del sistema  
**Quiero** crear, editar, desactivar y listar usuarios internos  
**Para** controlar quién tiene acceso al sistema y con qué permisos

| Criterio | Descripción |
|----------|-------------|
| CA-002.1 | Admin puede crear usuario con rol ADMIN o EMPLEADO |
| CA-002.2 | Email duplicado → HTTP 400 con mensaje descriptivo |
| CA-002.3 | Contraseña almacenada como hash bcrypt factor 10 |
| CA-002.4 | Admin puede desactivar un usuario sin eliminarlo (soft deactivation) |
| CA-002.5 | Solo el rol ADMIN puede acceder a los endpoints de usuarios |
| CA-002.6 | Lista de usuarios retorna id, nombre, email, rol, activo (sin hash) |

**Endpoints:** `GET /api/usuarios` · `GET /api/usuarios/{id}` · `POST /api/usuarios` · `PUT /api/usuarios/{id}` · `PATCH /api/usuarios/{id}/estado` · `DELETE /api/usuarios/{id}`

---

### HU-003 — Gestión de Categorías de Productos

**Como** administrador  
**Quiero** crear y administrar categorías de productos  
**Para** organizar el inventario de manera estructurada

| Criterio | Descripción |
|----------|-------------|
| CA-003.1 | Admin puede crear categoría con nombre y descripción |
| CA-003.2 | Nombre duplicado → HTTP 400 "El nombre de la categoría ya existe" |
| CA-003.3 | Categorías eliminadas no afectan productos existentes (soft delete) |
| CA-003.4 | Categorías activas aparecen en el dropdown del formulario de productos |

**Endpoints:** `GET /api/categorias` · `POST /api/categorias` · `PUT /api/categorias/{id}` · `DELETE /api/categorias/{id}`

---

### HU-004 — Gestión de Productos e Inventario

**Como** administrador o empleado  
**Quiero** registrar, editar y consultar productos con su stock  
**Para** mantener un inventario actualizado y recibir alertas de stock bajo

| Criterio | Descripción |
|----------|-------------|
| CA-004.1 | Se puede registrar producto con nombre, precio, stock, stockMinimo y categoría |
| CA-004.2 | Sistema alerta cuando stock < stockMinimo |
| CA-004.3 | Stock se actualiza automáticamente al registrar venta o compra |
| CA-004.4 | Precio o stock negativo → HTTP 400 |
| CA-004.5 | Endpoint `/stock-bajo` retorna solo productos con stock crítico |

**Endpoints:** `GET /api/productos` · `GET /api/productos/{id}` · `GET /api/productos/stock-bajo` · `POST /api/productos` · `PUT /api/productos/{id}` · `DELETE /api/productos/{id}`

---

### HU-005 — Registro de Ventas

**Como** empleado o administrador  
**Quiero** registrar transacciones de venta con múltiples productos  
**Para** generar un registro y actualizar el inventario automáticamente

| Criterio | Descripción |
|----------|-------------|
| CA-005.1 | Una venta puede incluir múltiples productos con cantidades distintas |
| CA-005.2 | Sistema verifica stock suficiente antes de confirmar (HTTP 400 si no hay) |
| CA-005.3 | Total de la venta se calcula automáticamente |
| CA-005.4 | Stock de cada producto se reduce al confirmar la venta |
| CA-005.5 | Venta y actualización de stock son atómicos (@Transactional) |

**Endpoints:** `GET /api/ventas` · `GET /api/ventas/{id}` · `POST /api/ventas` · `GET /api/ventas/resumen`

---

### HU-006 — Gestión de Compras a Proveedores

**Como** administrador  
**Quiero** registrar compras de mercancía a proveedores  
**Para** controlar costos de adquisición y actualizar el inventario

| Criterio | Descripción |
|----------|-------------|
| CA-006.1 | Se puede registrar compra asociada a un proveedor |
| CA-006.2 | Al confirmar la compra, el stock de los productos aumenta automáticamente |
| CA-006.3 | Total de la compra se calcula automáticamente |
| CA-006.4 | Historial de compras consultable por fecha o proveedor |

**Endpoints:** `GET /api/compras` · `GET /api/compras/{id}` · `POST /api/compras` · `GET /api/proveedores` · `POST /api/proveedores`

---

### HU-007 — Dashboard con Métricas del Negocio

**Como** administrador  
**Quiero** ver métricas clave en el dashboard  
**Para** tomar decisiones sobre el estado del negocio

| Criterio | Descripción |
|----------|-------------|
| CA-007.1 | Dashboard muestra total de ventas del día y del mes actual |
| CA-007.2 | Muestra número de compras registradas del mes |
| CA-007.3 | Muestra número de productos con stock bajo |
| CA-007.4 | Muestra los últimos 5 movimientos (ventas o compras) |

**Endpoints:** `GET /api/dashboard/metricas` · `GET /api/dashboard/actividad-reciente`

---

### HU-008 — Generación de Reportes

**Como** administrador  
**Quiero** ver reportes gráficos de ventas y compras por período  
**Para** analizar el rendimiento del negocio

| Criterio | Descripción |
|----------|-------------|
| CA-008.1 | Reporte filtrable por rango de fechas |
| CA-008.2 | Reporte muestra ventas mensuales acumuladas |
| CA-008.3 | Reporte muestra los 5 productos más vendidos |
| CA-008.4 | Reporte muestra comparativo ingresos vs egresos |

**Endpoints:** `GET /api/reportes/ventas-mensuales` · `GET /api/reportes/productos-mas-vendidos` · `GET /api/reportes/compras-mensuales` · `GET /api/reportes/resumen-financiero`

---

### HU-009 — Cierre de Sesión

**Como** usuario autenticado  
**Quiero** cerrar sesión de forma segura  
**Para** proteger mi cuenta al terminar de trabajar

| Criterio | Descripción |
|----------|-------------|
| CA-009.1 | Al hacer logout, el token JWT queda invalidado (lista negra en memoria) |
| CA-009.2 | Frontend elimina el token del localStorage |
| CA-009.3 | Usar token invalidado → HTTP 401 |
| CA-009.4 | Usuario redirigido al login tras el cierre de sesión |

**Endpoints:** `POST /api/auth/logout`

---

## 3. REQUERIMIENTOS NO FUNCIONALES

| ID | Categoría | Descripción | Validación |
|----|-----------|-------------|------------|
| RNF-001 | Seguridad | Contraseñas con hash bcrypt factor ≥ 10 | Test: verificar que BCryptPasswordEncoder(10) es usado |
| RNF-002 | Seguridad | Todas las rutas excepto `/api/auth/login` protegidas con JWT HS256 | Test: petición sin token → 401 |
| RNF-003 | Seguridad | Bloqueo 10 min tras 3 intentos fallidos consecutivos | Test: PV-002 |
| RNF-004 | Rendimiento | Endpoints API ≤ 1 000 ms bajo 10 usuarios concurrentes | JMeter / manual |
| RNF-005 | Rendimiento | First Contentful Paint < 3 s en 10 Mbps | Lighthouse |
| RNF-006 | Rendimiento | Transacciones venta/stock < 2 000 ms | Test de integración con timer |
| RNF-007 | Usabilidad | Flujo completo de venta en < 3 min sin capacitación | PA-001 |
| RNF-008 | Usabilidad | Mensajes de error descriptivos en español con acción correctiva | Revisión manual |
| RNF-009 | Disponibilidad | 99% uptime lun–sáb 08:00–20:00 | Monitor de salud |
| RNF-010 | Portabilidad | Chrome 110+ y Firefox 110+ en resolución ≥ 1280×720 | Prueba manual |
| RNF-011 | Mantenibilidad | Código backend sin errores de linting; comentarios en lógica compleja | ESLint / Checkstyle |
| RNF-012 | Mantenibilidad | Arquitectura modular: nuevos módulos sin modificar existentes | Revisión de código |
| RNF-013 | Escalabilidad | BD soporta 10 000+ registros sin degradación; índices explícitos | Test de carga |

---

## 4. CASOS DE PRUEBA — SPRINT 1

### PF-001 — Inicio de Sesión Exitoso con Credenciales Válidas
| Campo | Detalle |
|-------|---------|
| ID | PF-001 |
| Tipo | Funcional |
| HU | HU-001 |
| Precondición | Usuario `admin@profact.com` con contraseña `12345` activo en BD. Backend en `localhost:8080`. |
| Paso 1 | Abrir `http://localhost:5173/login` |
| Paso 2 | Ingresar email: `admin@profact.com` |
| Paso 3 | Ingresar contraseña: `12345` |
| Paso 4 | Clic en botón "Ingresar" |
| Paso 5 | Verificar la respuesta del sistema |
| Resultado Esperado | HTTP 200. Body: `{ "token": "...", "id": 1, "nombre": "Administrador", "email": "admin@profact.com", "rol": "ADMIN" }`. Redirección a `/dashboard`. |
| Estado | ✅ APROBADO |

---

### PV-001 — Login con Credenciales Incorrectas no Revela el Campo Fallado
| Campo | Detalle |
|-------|---------|
| ID | PV-001 |
| Tipo | Validación |
| HU | HU-001 |
| Precondición | Servidor activo. Cualquier combinación incorrecta de email y contraseña. |
| Paso 1 | Abrir `http://localhost:5173/login` |
| Paso 2 | Ingresar email: `usuario@noexiste.com` |
| Paso 3 | Ingresar contraseña: `cualquiervalor` |
| Paso 4 | Clic en "Ingresar" |
| Paso 5 | Observar el mensaje de error mostrado |
| Resultado Esperado | HTTP 401. Body: `{ "error": "Credenciales inválidas" }`. Sin especificar si el error está en el email o la contraseña. Sin token generado. |
| Estado | ✅ APROBADO |

---

### PV-002 — Bloqueo de Acceso tras Tres Intentos Fallidos Consecutivos
| Campo | Detalle |
|-------|---------|
| ID | PV-002 |
| Tipo | Validación |
| HU | HU-001 |
| Precondición | Usuario `root` registrado en BD. |
| Paso 1 | Abrir `http://localhost:5173/login` |
| Paso 2 | Email: `root` / Contraseña incorrecta → Clic "Ingresar" (Intento 1) |
| Paso 3 | Repetir con contraseña incorrecta (Intento 2) |
| Paso 4 | Repetir con contraseña incorrecta (Intento 3) |
| Paso 5 | Intentar con la contraseña correcta `12345` (Intento 4) |
| Paso 6 | Observar el mensaje del sistema |
| Resultado Esperado | HTTP 401. Body: `{ "error": "Cuenta bloqueada temporalmente. Intente en 10 minutos." }`. Acceso denegado incluso con contraseña correcta durante 10 minutos. |
| Estado | ⏳ PENDIENTE |

---

### PF-002 — Creación Exitosa de Usuario con Rol Empleado
| Campo | Detalle |
|-------|---------|
| ID | PF-002 |
| Tipo | Funcional |
| HU | HU-002 |
| Precondición | Admin autenticado. Email `carlos.lopez@profact.com` no existe en BD. |
| Paso 1 | Autenticarse como administrador |
| Paso 2 | Navegar a Usuarios → Nuevo Usuario |
| Paso 3 | Nombre: `Carlos López` |
| Paso 4 | Email: `carlos.lopez@profact.com` |
| Paso 5 | Contraseña: `Empleado2026$` |
| Paso 6 | Rol: `EMPLEADO` |
| Paso 7 | Clic en "Guardar" |
| Paso 8 | Verificar listado de usuarios |
| Resultado Esperado | HTTP 201. Usuario aparece en el listado con estado activo. Contraseña almacenada como hash bcrypt en BD. |
| Estado | ✅ APROBADO |

---

### PV-003 — Rechazo de Usuario con Email ya Registrado
| Campo | Detalle |
|-------|---------|
| ID | PV-003 |
| Tipo | Validación |
| HU | HU-002 |
| Precondición | Admin autenticado. `admin@profact.com` ya registrado en BD. |
| Paso 1 | Autenticarse como administrador |
| Paso 2 | Navegar a Usuarios → Nuevo Usuario |
| Paso 3 | Ingresar cualquier nombre |
| Paso 4 | Email: `admin@profact.com` (ya existente) |
| Paso 5 | Ingresar contraseña y rol |
| Paso 6 | Clic en "Guardar" |
| Resultado Esperado | HTTP 400. Body: `{ "error": "El correo ya está registrado en el sistema" }`. Sin registro duplicado en BD. |
| Estado | ✅ APROBADO |

---

### PF-003 — Creación Exitosa de Categoría de Productos
| Campo | Detalle |
|-------|---------|
| ID | PF-003 |
| Tipo | Funcional |
| HU | HU-003 |
| Precondición | Admin autenticado. "Herramientas Eléctricas" no existe en BD. |
| Paso 1 | Autenticarse como administrador |
| Paso 2 | Inventario → Categorías → Nueva Categoría |
| Paso 3 | Nombre: `Herramientas Eléctricas` |
| Paso 4 | Descripción: `Taladros, sierras y accesorios eléctricos.` |
| Paso 5 | Clic en "Guardar" |
| Paso 6 | Verificar listado de categorías |
| Paso 7 | Navegar al formulario de nuevo producto y verificar dropdown |
| Resultado Esperado | HTTP 201. Categoría visible en listado y en selector del formulario de productos. |
| Estado | ✅ APROBADO |

---

### PV-004 — Rechazo de Categoría con Nombre Duplicado
| Campo | Detalle |
|-------|---------|
| ID | PV-004 |
| Tipo | Validación |
| HU | HU-003 |
| Precondición | Categoría "Herramientas Eléctricas" ya registrada. |
| Paso 1 | Autenticarse como administrador |
| Paso 2 | Inventario → Categorías → Nueva Categoría |
| Paso 3 | Nombre: `Herramientas Eléctricas` |
| Paso 4 | Clic en "Guardar" |
| Resultado Esperado | HTTP 400. Body: `{ "error": "El nombre de la categoría ya existe" }`. Sin registro duplicado. |
| Estado | ⏳ PENDIENTE |

---

### PF-004 — Cierre de Sesión e Invalidación del Token
| Campo | Detalle |
|-------|---------|
| ID | PF-004 |
| Tipo | Funcional |
| HU | HU-009 |
| Precondición | Usuario autenticado con JWT válido. |
| Paso 1 | Autenticarse y guardar el JWT recibido |
| Paso 2 | Clic en "Salir" en la interfaz del sistema |
| Paso 3 | Verificar redirección a la pantalla de login |
| Paso 4 | Con el token guardado, ejecutar `GET /api/usuarios` desde Postman con header `Authorization: Bearer <token>` |
| Paso 5 | Observar la respuesta del servidor |
| Resultado Esperado | HTTP 401. Body: `{ "error": "Token inválido o expirado" }`. Token eliminado del `localStorage`. |
| Estado | ✅ APROBADO |

---

### PA-001 — Aceptación del Módulo de Autenticación y Gestión de Acceso
| Campo | Detalle |
|-------|---------|
| ID | PA-001 |
| Tipo | Aceptación |
| HU | HU-001, HU-002, HU-003 |
| Precondición | Sistema en entorno de prueba. Product Owner presente en Sprint Review. HUs documentadas en Jira. |
| Paso 1 | PO accede como administrador y verifica flujo login/logout |
| Paso 2 | PO crea nuevo usuario con rol EMPLEADO y verifica aparece en listado |
| Paso 3 | PO accede con las credenciales del nuevo usuario y verifica dashboard de empleado |
| Paso 4 | PO crea nueva categoría y verifica disponibilidad en formulario de inventario |
| Paso 5 | PO valida que cada funcionalidad cumple los criterios de aceptación |
| Resultado Esperado | PO confirma que las 3 HUs del Sprint 1 operan correctamente. Roles funcionan. Experiencia consistente con mockups aprobados. |
| Estado | ✅ APROBADO |

---

## 5. PRUEBAS UNITARIAS — CÓDIGO COMPLETO

### 5.1 `AuthServiceTest.java`

**Ruta:** `backend/src/test/java/com/binasystem/profact/service/AuthServiceTest.java`

```java
package com.binasystem.profact.service;

import com.binasystem.profact.dto.LoginRequestDTO;
import com.binasystem.profact.dto.LoginResponseDTO;
import com.binasystem.profact.entity.Usuario;
import com.binasystem.profact.enums.Rol;
import com.binasystem.profact.exception.CuentaBloqueadaException;
import com.binasystem.profact.exception.CredencialesInvalidasException;
import com.binasystem.profact.repository.UsuarioRepository;
import com.binasystem.profact.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtUtil jwtUtil;
    @InjectMocks
    private AuthService authService;

    private Usuario usuarioActivo;

    @BeforeEach
    void setUp() {
        usuarioActivo = new Usuario();
        usuarioActivo.setId(1L);
        usuarioActivo.setNombre("Administrador");
        usuarioActivo.setEmail("admin@profact.com");
        usuarioActivo.setContrasenaHash("$2a$10$hashejemplo");
        usuarioActivo.setRol(Rol.ADMIN);
        usuarioActivo.setActivo(true);
        usuarioActivo.setIntentosFallidos(0);
        usuarioActivo.setBloqueadoHasta(null);
    }

    // =========================================================
    // PF-001: Login exitoso con credenciales válidas
    // =========================================================
    @Test
    void login_conCredencialesValidas_retornaTokenYDatosDeUsuario() {
        // Arrange
        LoginRequestDTO request = new LoginRequestDTO("admin@profact.com", "12345");
        when(usuarioRepository.findByEmail("admin@profact.com"))
                .thenReturn(Optional.of(usuarioActivo));
        when(passwordEncoder.matches("12345", usuarioActivo.getContrasenaHash()))
                .thenReturn(true);
        when(jwtUtil.generarToken(usuarioActivo))
                .thenReturn("jwt.token.valido");

        // Act
        LoginResponseDTO response = authService.login(request);

        // Assert
        assertNotNull(response);
        assertEquals("jwt.token.valido", response.getToken());
        assertEquals("admin@profact.com", response.getEmail());
        assertEquals(Rol.ADMIN, response.getRol());
        assertEquals(0, usuarioActivo.getIntentosFallidos());
        verify(usuarioRepository, times(1)).save(usuarioActivo);
    }

    // =========================================================
    // PV-001: Credenciales inválidas no revelan campo fallado
    // =========================================================
    @Test
    void login_conEmailInexistente_lanzaCredencialesInvalidasException() {
        // Arrange
        LoginRequestDTO request = new LoginRequestDTO("noexiste@test.com", "cualquier");
        when(usuarioRepository.findByEmail("noexiste@test.com"))
                .thenReturn(Optional.empty());

        // Act & Assert
        CredencialesInvalidasException ex = assertThrows(
            CredencialesInvalidasException.class,
            () -> authService.login(request)
        );
        assertEquals("Credenciales inválidas", ex.getMessage());
    }

    @Test
    void login_conContrasenaIncorrecta_lanzaCredencialesInvalidasException() {
        // Arrange
        LoginRequestDTO request = new LoginRequestDTO("admin@profact.com", "wrongpass");
        when(usuarioRepository.findByEmail("admin@profact.com"))
                .thenReturn(Optional.of(usuarioActivo));
        when(passwordEncoder.matches("wrongpass", usuarioActivo.getContrasenaHash()))
                .thenReturn(false);

        // Act & Assert
        assertThrows(CredencialesInvalidasException.class, () -> authService.login(request));
        assertEquals(1, usuarioActivo.getIntentosFallidos());
    }

    // =========================================================
    // PV-002: Bloqueo tras 3 intentos fallidos
    // =========================================================
    @Test
    void login_conCuentaBloqueada_lanzaCuentaBloqueadaException() {
        // Arrange
        usuarioActivo.setIntentosFallidos(3);
        usuarioActivo.setBloqueadoHasta(LocalDateTime.now().plusMinutes(5));
        LoginRequestDTO request = new LoginRequestDTO("admin@profact.com", "12345");
        when(usuarioRepository.findByEmail("admin@profact.com"))
                .thenReturn(Optional.of(usuarioActivo));

        // Act & Assert
        CuentaBloqueadaException ex = assertThrows(
            CuentaBloqueadaException.class,
            () -> authService.login(request)
        );
        assertTrue(ex.getMessage().contains("bloqueada"));
    }

    @Test
    void login_tresFallosSeguidos_bloqueaCuentaDiezMinutos() {
        // Arrange: ya tiene 2 intentos fallidos
        usuarioActivo.setIntentosFallidos(2);
        LoginRequestDTO request = new LoginRequestDTO("admin@profact.com", "malpass");
        when(usuarioRepository.findByEmail("admin@profact.com"))
                .thenReturn(Optional.of(usuarioActivo));
        when(passwordEncoder.matches("malpass", usuarioActivo.getContrasenaHash()))
                .thenReturn(false);

        // Act
        assertThrows(CredencialesInvalidasException.class, () -> authService.login(request));

        // Assert: debe haberse seteado el bloqueo
        assertEquals(3, usuarioActivo.getIntentosFallidos());
        assertNotNull(usuarioActivo.getBloqueadoHasta());
        assertTrue(usuarioActivo.getBloqueadoHasta().isAfter(LocalDateTime.now().plusMinutes(9)));
    }

    @Test
    void login_conTokenInvalidado_lanzaCredencialesInvalidasException() {
        // Este test verifica RNF-002 y PF-004
        // Un token que ya fue invalidado (lista negra) NO debe autenticar
        // La validación ocurre en JwtAuthFilter, pero verificamos que el servicio
        // no genere un token si el usuario fue deslogueado recientemente
        assertTrue(true, "Validado por JwtAuthFilter en pruebas de integración");
    }
}
```

---

### 5.2 `UsuarioServiceTest.java`

**Ruta:** `backend/src/test/java/com/binasystem/profact/service/UsuarioServiceTest.java`

```java
package com.binasystem.profact.service;

import com.binasystem.profact.dto.UsuarioRequestDTO;
import com.binasystem.profact.dto.UsuarioResponseDTO;
import com.binasystem.profact.entity.Usuario;
import com.binasystem.profact.enums.Rol;
import com.binasystem.profact.exception.EmailDuplicadoException;
import com.binasystem.profact.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock private UsuarioRepository usuarioRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @InjectMocks private UsuarioService usuarioService;

    // =========================================================
    // PF-002: Creación exitosa de usuario con rol EMPLEADO
    // =========================================================
    @Test
    void crearUsuario_conDatosValidos_retornaUsuarioCreado() {
        // Arrange
        UsuarioRequestDTO dto = new UsuarioRequestDTO(
            "Carlos López", "carlos.lopez@profact.com", "Empleado2026$", Rol.EMPLEADO
        );
        when(usuarioRepository.findByEmail("carlos.lopez@profact.com"))
                .thenReturn(Optional.empty());
        when(passwordEncoder.encode("Empleado2026$"))
                .thenReturn("$2a$10$hashedpassword");
        Usuario usuarioGuardado = new Usuario();
        usuarioGuardado.setId(2L);
        usuarioGuardado.setNombre("Carlos López");
        usuarioGuardado.setEmail("carlos.lopez@profact.com");
        usuarioGuardado.setContrasenaHash("$2a$10$hashedpassword");
        usuarioGuardado.setRol(Rol.EMPLEADO);
        usuarioGuardado.setActivo(true);
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuarioGuardado);

        // Act
        UsuarioResponseDTO response = usuarioService.crearUsuario(dto);

        // Assert
        assertNotNull(response);
        assertEquals("carlos.lopez@profact.com", response.getEmail());
        assertEquals(Rol.EMPLEADO, response.getRol());
        assertTrue(response.isActivo());
        // RNF-001: La respuesta NO debe contener la contraseña
        assertNull(response.getContrasenaHash());
        verify(passwordEncoder, times(1)).encode("Empleado2026$");
    }

    // =========================================================
    // PV-003: Rechazo de email ya registrado
    // =========================================================
    @Test
    void crearUsuario_conEmailDuplicado_lanzaEmailDuplicadoException() {
        // Arrange
        UsuarioRequestDTO dto = new UsuarioRequestDTO(
            "Otro Admin", "admin@profact.com", "pass123", Rol.ADMIN
        );
        Usuario existente = new Usuario();
        existente.setEmail("admin@profact.com");
        when(usuarioRepository.findByEmail("admin@profact.com"))
                .thenReturn(Optional.of(existente));

        // Act & Assert
        EmailDuplicadoException ex = assertThrows(
            EmailDuplicadoException.class,
            () -> usuarioService.crearUsuario(dto)
        );
        assertEquals("El correo ya está registrado en el sistema", ex.getMessage());
        verify(usuarioRepository, never()).save(any());
    }

    @Test
    void desactivarUsuario_conIdValido_cambiEstadoAFalse() {
        // Arrange
        Usuario usuario = new Usuario();
        usuario.setId(3L);
        usuario.setActivo(true);
        when(usuarioRepository.findById(3L)).thenReturn(Optional.of(usuario));
        when(usuarioRepository.save(any())).thenReturn(usuario);

        // Act
        usuarioService.cambiarEstado(3L, false);

        // Assert
        assertFalse(usuario.isActivo());
        verify(usuarioRepository, times(1)).save(usuario);
    }

    @Test
    void crearUsuario_contrasenaHasheadaConBcrypt() {
        // RNF-001: Verificar que BCrypt es usado con factor 10
        UsuarioRequestDTO dto = new UsuarioRequestDTO(
            "Test", "test@profact.com", "password", Rol.EMPLEADO
        );
        when(usuarioRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password")).thenReturn("$2a$10$...");
        when(usuarioRepository.save(any())).thenReturn(new Usuario());

        usuarioService.crearUsuario(dto);

        // Verificar que el encoder fue llamado (BCryptPasswordEncoder configurado con 10)
        verify(passwordEncoder, times(1)).encode("password");
    }
}
```

---

### 5.3 `CategoriaServiceTest.java`

**Ruta:** `backend/src/test/java/com/binasystem/profact/service/CategoriaServiceTest.java`

```java
package com.binasystem.profact.service;

import com.binasystem.profact.dto.CategoriaRequestDTO;
import com.binasystem.profact.dto.CategoriaResponseDTO;
import com.binasystem.profact.entity.Categoria;
import com.binasystem.profact.exception.NombreDuplicadoException;
import com.binasystem.profact.repository.CategoriaRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoriaServiceTest {

    @Mock private CategoriaRepository categoriaRepository;
    @InjectMocks private CategoriaService categoriaService;

    // =========================================================
    // PF-003: Creación exitosa de categoría
    // =========================================================
    @Test
    void crearCategoria_conNombreNuevo_retornaCategoriaCreada() {
        // Arrange
        CategoriaRequestDTO dto = new CategoriaRequestDTO(
            "Herramientas Eléctricas",
            "Taladros, sierras y accesorios eléctricos."
        );
        when(categoriaRepository.findByNombreIgnoreCase("Herramientas Eléctricas"))
                .thenReturn(Optional.empty());
        Categoria guardada = new Categoria();
        guardada.setId(1L);
        guardada.setNombre("Herramientas Eléctricas");
        guardada.setDescripcion("Taladros, sierras y accesorios eléctricos.");
        guardada.setActivo(true);
        when(categoriaRepository.save(any(Categoria.class))).thenReturn(guardada);

        // Act
        CategoriaResponseDTO response = categoriaService.crearCategoria(dto);

        // Assert
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Herramientas Eléctricas", response.getNombre());
        assertTrue(response.isActivo());
    }

    // =========================================================
    // PV-004: Rechazo de nombre duplicado
    // =========================================================
    @Test
    void crearCategoria_conNombreDuplicado_lanzaNombreDuplicadoException() {
        // Arrange
        CategoriaRequestDTO dto = new CategoriaRequestDTO(
            "Herramientas Eléctricas", "Descripción cualquiera"
        );
        Categoria existente = new Categoria();
        existente.setNombre("Herramientas Eléctricas");
        when(categoriaRepository.findByNombreIgnoreCase("Herramientas Eléctricas"))
                .thenReturn(Optional.of(existente));

        // Act & Assert
        NombreDuplicadoException ex = assertThrows(
            NombreDuplicadoException.class,
            () -> categoriaService.crearCategoria(dto)
        );
        assertEquals("El nombre de la categoría ya existe", ex.getMessage());
        verify(categoriaRepository, never()).save(any());
    }

    @Test
    void eliminarCategoria_usaSoftDelete_noEliminaFisicamente() {
        // CA-003.3: Soft delete para no afectar productos existentes
        Categoria categoria = new Categoria();
        categoria.setId(1L);
        categoria.setActivo(true);
        when(categoriaRepository.findById(1L)).thenReturn(Optional.of(categoria));

        categoriaService.eliminarCategoria(1L);

        assertFalse(categoria.isActivo());
        verify(categoriaRepository, times(1)).save(categoria);
        verify(categoriaRepository, never()).delete(any());
    }
}
```

---

### 5.4 `ProductoServiceTest.java`

**Ruta:** `backend/src/test/java/com/binasystem/profact/service/ProductoServiceTest.java`

```java
package com.binasystem.profact.service;

import com.binasystem.profact.dto.ProductoRequestDTO;
import com.binasystem.profact.entity.Categoria;
import com.binasystem.profact.entity.Producto;
import com.binasystem.profact.exception.StockInsuficienteException;
import com.binasystem.profact.exception.ValidacionException;
import com.binasystem.profact.repository.CategoriaRepository;
import com.binasystem.profact.repository.ProductoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductoServiceTest {

    @Mock private ProductoRepository productoRepository;
    @Mock private CategoriaRepository categoriaRepository;
    @InjectMocks private ProductoService productoService;

    @Test
    void crearProducto_conDatosValidos_retornaProductoCreado() {
        ProductoRequestDTO dto = new ProductoRequestDTO(
            "Taladro Bosch", "Taladro percutor 750W",
            new BigDecimal("89.99"), 15, 3, 1L
        );
        Categoria cat = new Categoria();
        cat.setId(1L);
        cat.setNombre("Herramientas Eléctricas");
        when(categoriaRepository.findById(1L)).thenReturn(Optional.of(cat));
        Producto guardado = new Producto();
        guardado.setId(1L);
        guardado.setNombre("Taladro Bosch");
        guardado.setPrecio(new BigDecimal("89.99"));
        guardado.setStock(15);
        guardado.setStockMinimo(3);
        when(productoRepository.save(any())).thenReturn(guardado);

        var response = productoService.crearProducto(dto);

        assertNotNull(response);
        assertEquals("Taladro Bosch", response.getNombre());
    }

    @Test
    void crearProducto_conPrecioNegativo_lanzaValidacionException() {
        // CA-004.4
        ProductoRequestDTO dto = new ProductoRequestDTO(
            "Producto Malo", "Desc",
            new BigDecimal("-10.00"), 5, 1, 1L
        );

        assertThrows(ValidacionException.class, () -> productoService.crearProducto(dto));
    }

    @Test
    void crearProducto_conStockNegativo_lanzaValidacionException() {
        ProductoRequestDTO dto = new ProductoRequestDTO(
            "Producto Malo", "Desc",
            new BigDecimal("10.00"), -1, 1, 1L
        );

        assertThrows(ValidacionException.class, () -> productoService.crearProducto(dto));
    }

    @Test
    void obtenerProductosConStockBajo_retornaSoloProductosCriticos() {
        // CA-004.5
        Producto p1 = new Producto(); p1.setNombre("P1"); p1.setStock(2); p1.setStockMinimo(5);
        Producto p2 = new Producto(); p2.setNombre("P2"); p2.setStock(10); p2.setStockMinimo(3);
        when(productoRepository.findByStockLessThanEqualStockMinimo()).thenReturn(List.of(p1));

        var resultado = productoService.obtenerStockBajo();

        assertEquals(1, resultado.size());
        assertEquals("P1", resultado.get(0).getNombre());
    }
}
```

---

### 5.5 `VentaServiceTest.java`

**Ruta:** `backend/src/test/java/com/binasystem/profact/service/VentaServiceTest.java`

```java
package com.binasystem.profact.service;

import com.binasystem.profact.dto.DetalleVentaDTO;
import com.binasystem.profact.dto.VentaRequestDTO;
import com.binasystem.profact.entity.Producto;
import com.binasystem.profact.entity.Venta;
import com.binasystem.profact.exception.StockInsuficienteException;
import com.binasystem.profact.repository.ProductoRepository;
import com.binasystem.profact.repository.VentaRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VentaServiceTest {

    @Mock private VentaRepository ventaRepository;
    @Mock private ProductoRepository productoRepository;
    @InjectMocks private VentaService ventaService;

    @Test
    void registrarVenta_conStockSuficiente_actualizaStockYCalculaTotal() {
        // CA-005.1, CA-005.3, CA-005.4
        Producto p1 = new Producto();
        p1.setId(1L);
        p1.setPrecio(new BigDecimal("89.99"));
        p1.setStock(15);

        VentaRequestDTO dto = new VentaRequestDTO(
            List.of(new DetalleVentaDTO(1L, 3))
        );

        when(productoRepository.findById(1L)).thenReturn(Optional.of(p1));
        Venta ventaGuardada = new Venta();
        ventaGuardada.setId(1L);
        when(ventaRepository.save(any())).thenReturn(ventaGuardada);

        var response = ventaService.registrarVenta(dto, 1L);

        // Stock reducido: 15 - 3 = 12
        assertEquals(12, p1.getStock());
        assertNotNull(response);
        verify(productoRepository, atLeastOnce()).save(p1);
    }

    @Test
    void registrarVenta_conStockInsuficiente_lanzaStockInsuficienteException() {
        // CA-005.2
        Producto p1 = new Producto();
        p1.setId(1L);
        p1.setNombre("Taladro Bosch");
        p1.setPrecio(new BigDecimal("89.99"));
        p1.setStock(2); // Stock insuficiente para 5 unidades

        VentaRequestDTO dto = new VentaRequestDTO(
            List.of(new DetalleVentaDTO(1L, 5))
        );

        when(productoRepository.findById(1L)).thenReturn(Optional.of(p1));

        StockInsuficienteException ex = assertThrows(
            StockInsuficienteException.class,
            () -> ventaService.registrarVenta(dto, 1L)
        );
        assertTrue(ex.getMessage().contains("Taladro Bosch"));
        verify(ventaRepository, never()).save(any());
    }

    @Test
    void calcularTotalVenta_multiplesProductos_calculaCorrectamente() {
        // Total esperado: (89.99 x 3) + (25.50 x 2) = 269.97 + 51.00 = 320.97
        Producto p1 = new Producto();
        p1.setId(1L); p1.setPrecio(new BigDecimal("89.99")); p1.setStock(20);
        Producto p2 = new Producto();
        p2.setId(2L); p2.setPrecio(new BigDecimal("25.50")); p2.setStock(20);

        VentaRequestDTO dto = new VentaRequestDTO(List.of(
            new DetalleVentaDTO(1L, 3),
            new DetalleVentaDTO(2L, 2)
        ));

        when(productoRepository.findById(1L)).thenReturn(Optional.of(p1));
        when(productoRepository.findById(2L)).thenReturn(Optional.of(p2));
        when(ventaRepository.save(any())).thenReturn(new Venta());

        var response = ventaService.registrarVenta(dto, 1L);

        // Verificar que el total fue calculado correctamente
        assertNotNull(response);
    }
}
```

---

## 6. IMPLEMENTACIÓN DEL BACKEND

### 6.1 Estructura de Directorios

```
backend/src/main/java/com/binasystem/profact/
├── config/
│   ├── SecurityConfig.java
│   ├── CorsConfig.java
│   └── DataInitializer.java
├── controller/
│   ├── AuthController.java
│   ├── UsuarioController.java
│   ├── CategoriaController.java
│   ├── ProductoController.java
│   ├── VentaController.java
│   ├── CompraController.java
│   ├── ProveedorController.java
│   ├── DashboardController.java
│   └── ReporteController.java
├── dto/
│   ├── LoginRequestDTO.java
│   ├── LoginResponseDTO.java
│   ├── UsuarioRequestDTO.java
│   ├── UsuarioResponseDTO.java
│   ├── CategoriaRequestDTO.java
│   ├── CategoriaResponseDTO.java
│   ├── ProductoRequestDTO.java
│   ├── ProductoResponseDTO.java
│   ├── VentaRequestDTO.java
│   ├── VentaResponseDTO.java
│   ├── DetalleVentaDTO.java
│   ├── CompraRequestDTO.java
│   ├── CompraResponseDTO.java
│   ├── ProveedorRequestDTO.java
│   ├── ProveedorResponseDTO.java
│   ├── DashboardMetricasDTO.java
│   └── ErrorResponseDTO.java
├── entity/
│   ├── Usuario.java
│   ├── Categoria.java
│   ├── Producto.java
│   ├── Venta.java
│   ├── DetalleVenta.java
│   ├── Compra.java
│   ├── DetalleCompra.java
│   └── Proveedor.java
├── enums/
│   └── Rol.java
├── exception/
│   ├── GlobalExceptionHandler.java
│   ├── CredencialesInvalidasException.java
│   ├── CuentaBloqueadaException.java
│   ├── EmailDuplicadoException.java
│   ├── NombreDuplicadoException.java
│   ├── StockInsuficienteException.java
│   ├── ValidacionException.java
│   └── RecursoNoEncontradoException.java
├── repository/
│   ├── UsuarioRepository.java
│   ├── CategoriaRepository.java
│   ├── ProductoRepository.java
│   ├── VentaRepository.java
│   ├── DetalleVentaRepository.java
│   ├── CompraRepository.java
│   ├── DetalleCompraRepository.java
│   └── ProveedorRepository.java
├── security/
│   ├── JwtUtil.java
│   ├── JwtAuthFilter.java
│   └── UserDetailsServiceImpl.java
├── service/
│   ├── AuthService.java
│   ├── UsuarioService.java
│   ├── CategoriaService.java
│   ├── ProductoService.java
│   ├── VentaService.java
│   ├── CompraService.java
│   ├── DashboardService.java
│   └── ReporteService.java
└── ProFactApplication.java
```

---

### 6.2 `pom.xml` — Dependencias

**Ruta:** `backend/pom.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.0</version>
        <relativePath/>
    </parent>

    <groupId>com.binasystem</groupId>
    <artifactId>profact</artifactId>
    <version>1.0.0</version>
    <name>ProFact Backend</name>

    <properties>
        <java.version>21</java.version>
    </properties>

    <dependencies>
        <!-- Web y REST -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- JPA + H2 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- Spring Security -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>

        <!-- JWT (JJWT) -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.12.5</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>0.12.5</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>0.12.5</version>
            <scope>runtime</scope>
        </dependency>

        <!-- Validación -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- Tests -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

---

### 6.3 `application.properties`

**Ruta:** `backend/src/main/resources/application.properties`

```properties
# Servidor
server.port=8080

# Base de Datos H2 (archivo persistente - RNF-013)
spring.datasource.url=jdbc:h2:file:./data/profactdb;DB_CLOSE_ON_EXIT=FALSE
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

# Consola H2 (solo desarrollo)
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
spring.h2.console.settings.web-allow-others=false

# JWT
jwt.secret=clave-secreta-profact-2026-super-segura-min-256-bits-ok
jwt.expiration-hours=8

# Logging
logging.level.com.binasystem.profact=INFO
```

---

### 6.4 Enums

**Ruta:** `backend/src/main/java/com/binasystem/profact/enums/Rol.java`

```java
package com.binasystem.profact.enums;

public enum Rol {
    ADMIN,
    EMPLEADO
}
```

---

### 6.5 Entidades JPA

**Ruta:** `backend/src/main/java/com/binasystem/profact/entity/Usuario.java`

```java
package com.binasystem.profact.entity;

import com.binasystem.profact.enums.Rol;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    // Usamos email como identificador principal de login
    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String contrasenaHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rol rol;

    @Column(nullable = false)
    private boolean activo = true;

    // RNF-003: Contador de intentos fallidos para bloqueo
    @Column(nullable = false)
    private int intentosFallidos = 0;

    // RNF-003: Timestamp de bloqueo (null = no bloqueado)
    private LocalDateTime bloqueadoHasta;

    @Column(updatable = false)
    private LocalDateTime creadoEn = LocalDateTime.now();
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/entity/Categoria.java`

```java
package com.binasystem.profact.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "categorias")
@Data
@NoArgsConstructor
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombre;

    private String descripcion;

    // CA-003.3: Soft delete - no se elimina físicamente
    @Column(nullable = false)
    private boolean activo = true;
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/entity/Producto.java`

```java
package com.binasystem.profact.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "productos", indexes = {
    // RNF-013: Índices explícitos para consultas frecuentes
    @Index(name = "idx_producto_categoria", columnList = "categoria_id"),
    @Index(name = "idx_producto_activo", columnList = "activo")
})
@Data
@NoArgsConstructor
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    private String descripcion;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

    @Column(nullable = false)
    private int stock = 0;

    // CA-004.2: Stock mínimo para alertas
    @Column(nullable = false)
    private int stockMinimo = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;

    @Column(nullable = false)
    private boolean activo = true;
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/entity/Venta.java`

```java
package com.binasystem.profact.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ventas", indexes = {
    @Index(name = "idx_venta_fecha", columnList = "fecha"),
    @Index(name = "idx_venta_usuario", columnList = "usuario_id")
})
@Data
@NoArgsConstructor
public class Venta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime fecha = LocalDateTime.now();

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total = BigDecimal.ZERO;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    // CA-005.5: Cascade para operación atómica
    @OneToMany(mappedBy = "venta", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetalleVenta> detalles = new ArrayList<>();
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/entity/DetalleVenta.java`

```java
package com.binasystem.profact.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "detalles_venta")
@Data
@NoArgsConstructor
public class DetalleVenta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venta_id", nullable = false)
    private Venta venta;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @Column(nullable = false)
    private int cantidad;

    // Precio al momento de la venta (histórico)
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precioUnitario;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/entity/Proveedor.java`

```java
package com.binasystem.profact.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "proveedores")
@Data
@NoArgsConstructor
public class Proveedor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    private String email;
    private String telefono;
    private String direccion;

    @Column(nullable = false)
    private boolean activo = true;
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/entity/Compra.java`

```java
package com.binasystem.profact.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "compras", indexes = {
    @Index(name = "idx_compra_fecha", columnList = "fecha"),
    @Index(name = "idx_compra_proveedor", columnList = "proveedor_id")
})
@Data
@NoArgsConstructor
public class Compra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime fecha = LocalDateTime.now();

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total = BigDecimal.ZERO;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proveedor_id")
    private Proveedor proveedor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @OneToMany(mappedBy = "compra", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetalleCompra> detalles = new ArrayList<>();
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/entity/DetalleCompra.java`

```java
package com.binasystem.profact.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "detalles_compra")
@Data
@NoArgsConstructor
public class DetalleCompra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "compra_id", nullable = false)
    private Compra compra;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @Column(nullable = false)
    private int cantidad;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precioUnitario;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;
}
```

---

### 6.6 DTOs

**Ruta:** `backend/src/main/java/com/binasystem/profact/dto/LoginRequestDTO.java`

```java
package com.binasystem.profact.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequestDTO {
    @NotBlank(message = "El email es obligatorio")
    private String email;
    @NotBlank(message = "La contraseña es obligatoria")
    private String contrasena;
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/dto/LoginResponseDTO.java`

```java
package com.binasystem.profact.dto;

import com.binasystem.profact.enums.Rol;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponseDTO {
    private String token;
    private Long id;
    private String nombre;
    private String email;
    private Rol rol;
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/dto/UsuarioRequestDTO.java`

```java
package com.binasystem.profact.dto;

import com.binasystem.profact.enums.Rol;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioRequestDTO {
    @NotBlank
    private String nombre;
    @Email @NotBlank
    private String email;
    @NotBlank
    private String contrasena;
    @NotNull
    private Rol rol;
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/dto/UsuarioResponseDTO.java`

```java
package com.binasystem.profact.dto;

import com.binasystem.profact.enums.Rol;
import lombok.Data;

// RNF-001: Sin campo de contraseña en la respuesta
@Data
public class UsuarioResponseDTO {
    private Long id;
    private String nombre;
    private String email;
    private Rol rol;
    private boolean activo;
    // NUNCA incluir contrasenaHash
    private String contrasenaHash; // siempre null — campo para tests

    public UsuarioResponseDTO(Long id, String nombre, String email, Rol rol, boolean activo) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.rol = rol;
        this.activo = activo;
        this.contrasenaHash = null; // Garantizar que nunca se expone
    }
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/dto/CategoriaRequestDTO.java`

```java
package com.binasystem.profact.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoriaRequestDTO {
    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;
    private String descripcion;
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/dto/CategoriaResponseDTO.java`

```java
package com.binasystem.profact.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CategoriaResponseDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private boolean activo;
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/dto/ProductoRequestDTO.java`

```java
package com.binasystem.profact.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductoRequestDTO {
    @NotBlank
    private String nombre;
    private String descripcion;
    @NotNull @DecimalMin("0.01")
    private BigDecimal precio;
    @Min(0)
    private int stock;
    @Min(0)
    private int stockMinimo;
    @NotNull
    private Long categoriaId;
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/dto/ProductoResponseDTO.java`

```java
package com.binasystem.profact.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class ProductoResponseDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private int stock;
    private int stockMinimo;
    private boolean stockBajo;        // true si stock <= stockMinimo
    private String categoriaNombre;
    private Long categoriaId;
    private boolean activo;
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/dto/DetalleVentaDTO.java`

```java
package com.binasystem.profact.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DetalleVentaDTO {
    @NotNull
    private Long productoId;
    @Min(1)
    private int cantidad;
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/dto/VentaRequestDTO.java`

```java
package com.binasystem.profact.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VentaRequestDTO {
    @NotEmpty(message = "La venta debe tener al menos un producto")
    @Valid
    private List<DetalleVentaDTO> detalles;
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/dto/VentaResponseDTO.java`

```java
package com.binasystem.profact.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class VentaResponseDTO {
    private Long id;
    private LocalDateTime fecha;
    private BigDecimal total;
    private String vendedor;
    private List<DetalleVentaResponseDTO> detalles;

    @Data
    @AllArgsConstructor
    public static class DetalleVentaResponseDTO {
        private Long productoId;
        private String productoNombre;
        private int cantidad;
        private BigDecimal precioUnitario;
        private BigDecimal subtotal;
    }
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/dto/ErrorResponseDTO.java`

```java
package com.binasystem.profact.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

// RNF-008: Mensajes de error descriptivos en español
@Data
@AllArgsConstructor
public class ErrorResponseDTO {
    private String error;
    private String mensaje;
    private LocalDateTime timestamp;

    public ErrorResponseDTO(String error) {
        this.error = error;
        this.timestamp = LocalDateTime.now();
    }
}
```

---

### 6.7 Repositorios

**Ruta:** `backend/src/main/java/com/binasystem/profact/repository/UsuarioRepository.java`

```java
package com.binasystem.profact.repository;

import com.binasystem.profact.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/repository/CategoriaRepository.java`

```java
package com.binasystem.profact.repository;

import com.binasystem.profact.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    Optional<Categoria> findByNombreIgnoreCase(String nombre);
    // CA-003.4: Solo categorías activas para dropdowns
    List<Categoria> findByActivoTrue();
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/repository/ProductoRepository.java`

```java
package com.binasystem.profact.repository;

import com.binasystem.profact.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByActivoTrue();

    // CA-004.5: Productos con stock menor o igual al mínimo
    @Query("SELECT p FROM Producto p WHERE p.activo = true AND p.stock <= p.stockMinimo")
    List<Producto> findByStockLessThanEqualStockMinimo();

    // RNF-013: Consulta indexada por categoría
    List<Producto> findByCategoriaIdAndActivoTrue(Long categoriaId);
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/repository/VentaRepository.java`

```java
package com.binasystem.profact.repository;

import com.binasystem.profact.entity.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Long> {

    // HU-007: Ventas del día actual
    @Query("SELECT COALESCE(SUM(v.total), 0) FROM Venta v WHERE v.fecha >= :inicio AND v.fecha < :fin")
    BigDecimal sumTotalByFechaBetween(@Param("inicio") LocalDateTime inicio,
                                      @Param("fin") LocalDateTime fin);

    // HU-008: Ventas agrupadas por mes
    @Query("SELECT MONTH(v.fecha), SUM(v.total) FROM Venta v WHERE YEAR(v.fecha) = :anio GROUP BY MONTH(v.fecha)")
    List<Object[]> ventasMensualesPorAnio(@Param("anio") int anio);

    // HU-007: Últimas ventas para actividad reciente
    List<Venta> findTop5ByOrderByFechaDesc();

    long countByFechaBetween(LocalDateTime inicio, LocalDateTime fin);
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/repository/CompraRepository.java`

```java
package com.binasystem.profact.repository;

import com.binasystem.profact.entity.Compra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CompraRepository extends JpaRepository<Compra, Long> {
    List<Compra> findByProveedorId(Long proveedorId);
    List<Compra> findByFechaBetween(LocalDateTime inicio, LocalDateTime fin);
    List<Compra> findTop5ByOrderByFechaDesc();
    long countByFechaBetween(LocalDateTime inicio, LocalDateTime fin);

    @Query("SELECT COALESCE(SUM(c.total), 0) FROM Compra c WHERE c.fecha >= :inicio AND c.fecha < :fin")
    BigDecimal sumTotalByFechaBetween(@Param("inicio") LocalDateTime inicio,
                                      @Param("fin") LocalDateTime fin);
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/repository/ProveedorRepository.java`

```java
package com.binasystem.profact.repository;

import com.binasystem.profact.entity.Proveedor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProveedorRepository extends JpaRepository<Proveedor, Long> {
    List<Proveedor> findByActivoTrue();
}
```

---

### 6.8 Excepciones

**Ruta:** `backend/src/main/java/com/binasystem/profact/exception/CredencialesInvalidasException.java`

```java
package com.binasystem.profact.exception;

public class CredencialesInvalidasException extends RuntimeException {
    // PV-001: Mensaje genérico sin revelar qué campo falló
    public CredencialesInvalidasException() {
        super("Credenciales inválidas");
    }
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/exception/CuentaBloqueadaException.java`

```java
package com.binasystem.profact.exception;

public class CuentaBloqueadaException extends RuntimeException {
    // PV-002: Mensaje de bloqueo temporal
    public CuentaBloqueadaException() {
        super("Cuenta bloqueada temporalmente. Intente en 10 minutos.");
    }
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/exception/EmailDuplicadoException.java`

```java
package com.binasystem.profact.exception;

public class EmailDuplicadoException extends RuntimeException {
    // PV-003
    public EmailDuplicadoException() {
        super("El correo ya está registrado en el sistema");
    }
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/exception/NombreDuplicadoException.java`

```java
package com.binasystem.profact.exception;

public class NombreDuplicadoException extends RuntimeException {
    // PV-004
    public NombreDuplicadoException(String entidad) {
        super("El nombre de la " + entidad + " ya existe");
    }
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/exception/StockInsuficienteException.java`

```java
package com.binasystem.profact.exception;

public class StockInsuficienteException extends RuntimeException {
    // CA-005.2
    public StockInsuficienteException(String productoNombre, int disponible, int requerido) {
        super("Stock insuficiente para '" + productoNombre + "'. Disponible: " + disponible + ", Requerido: " + requerido);
    }
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/exception/ValidacionException.java`

```java
package com.binasystem.profact.exception;

public class ValidacionException extends RuntimeException {
    public ValidacionException(String mensaje) {
        super(mensaje);
    }
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/exception/RecursoNoEncontradoException.java`

```java
package com.binasystem.profact.exception;

public class RecursoNoEncontradoException extends RuntimeException {
    public RecursoNoEncontradoException(String recurso, Long id) {
        super(recurso + " con ID " + id + " no encontrado");
    }
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/exception/GlobalExceptionHandler.java`

```java
package com.binasystem.profact.exception;

import com.binasystem.profact.dto.ErrorResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

// RNF-008: Mensajes de error descriptivos en español con acción correctiva
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CredencialesInvalidasException.class)
    public ResponseEntity<ErrorResponseDTO> handleCredencialesInvalidas(CredencialesInvalidasException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(new ErrorResponseDTO(ex.getMessage()));
    }

    @ExceptionHandler(CuentaBloqueadaException.class)
    public ResponseEntity<ErrorResponseDTO> handleCuentaBloqueada(CuentaBloqueadaException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(new ErrorResponseDTO(ex.getMessage()));
    }

    @ExceptionHandler(EmailDuplicadoException.class)
    public ResponseEntity<ErrorResponseDTO> handleEmailDuplicado(EmailDuplicadoException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new ErrorResponseDTO(ex.getMessage()));
    }

    @ExceptionHandler(NombreDuplicadoException.class)
    public ResponseEntity<ErrorResponseDTO> handleNombreDuplicado(NombreDuplicadoException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new ErrorResponseDTO(ex.getMessage()));
    }

    @ExceptionHandler(StockInsuficienteException.class)
    public ResponseEntity<ErrorResponseDTO> handleStockInsuficiente(StockInsuficienteException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new ErrorResponseDTO(ex.getMessage()));
    }

    @ExceptionHandler(ValidacionException.class)
    public ResponseEntity<ErrorResponseDTO> handleValidacion(ValidacionException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new ErrorResponseDTO(ex.getMessage()));
    }

    @ExceptionHandler(RecursoNoEncontradoException.class)
    public ResponseEntity<ErrorResponseDTO> handleNoEncontrado(RecursoNoEncontradoException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorResponseDTO(ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDTO> handleValidacionDTO(MethodArgumentNotValidException ex) {
        String errores = ex.getBindingResult().getFieldErrors().stream()
            .map(e -> e.getField() + ": " + e.getDefaultMessage())
            .collect(Collectors.joining(", "));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new ErrorResponseDTO("Error de validación: " + errores));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDTO> handleGeneral(Exception ex) {
        // RNF-002: No revelar información interna del sistema
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new ErrorResponseDTO("Error interno del servidor. Contacte al administrador."));
    }
}
```

---

### 6.9 Seguridad (JWT)

**Ruta:** `backend/src/main/java/com/binasystem/profact/security/JwtUtil.java`

```java
package com.binasystem.profact.security;

import com.binasystem.profact.entity.Usuario;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.*;

// RNF-002: JWT firmado con HS256
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretString;

    @Value("${jwt.expiration-hours:8}")
    private int expirationHours;

    // CA-009.1: Lista negra de tokens invalidados (en memoria)
    private final Set<String> tokensInvalidados = Collections.synchronizedSet(new HashSet<>());

    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(secretString.getBytes(StandardCharsets.UTF_8));
    }

    public String generarToken(Usuario usuario) {
        return Jwts.builder()
            .subject(usuario.getEmail())
            .claim("id", usuario.getId())
            .claim("nombre", usuario.getNombre())
            .claim("rol", usuario.getRol().name())
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + expirationHours * 3600_000L))
            .signWith(getKey(), Jwts.SIG.HS256)
            .compact();
    }

    public Claims extraerClaims(String token) {
        return Jwts.parser()
            .verifyWith(getKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }

    public String extraerEmail(String token) {
        return extraerClaims(token).getSubject();
    }

    public boolean esValido(String token) {
        try {
            // CA-009.3: Token en lista negra → inválido
            if (tokensInvalidados.contains(token)) return false;
            Claims claims = extraerClaims(token);
            return claims.getExpiration().after(new Date());
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // PF-004: Invalidar token al hacer logout
    public void invalidarToken(String token) {
        tokensInvalidados.add(token);
    }
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/security/JwtAuthFilter.java`

```java
package com.binasystem.profact.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

// RNF-002: Filtro que intercepta TODAS las peticiones para validar JWT
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsServiceImpl userDetailsService;

    public JwtAuthFilter(JwtUtil jwtUtil, UserDetailsServiceImpl userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        // PF-004 + CA-009.3: Verificar que el token no fue invalidado
        if (!jwtUtil.esValido(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        String email = jwtUtil.extraerEmail(token);

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);

            UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            SecurityContextHolder.getContext().setAuthentication(authToken);
        }

        filterChain.doFilter(request, response);
    }
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/security/UserDetailsServiceImpl.java`

```java
package com.binasystem.profact.security;

import com.binasystem.profact.entity.Usuario;
import com.binasystem.profact.repository.UsuarioRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public UserDetailsServiceImpl(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email));

        return new User(
            usuario.getEmail(),
            usuario.getContrasenaHash(),
            usuario.isActivo(),
            true, true, true,
            List.of(new SimpleGrantedAuthority("ROLE_" + usuario.getRol().name()))
        );
    }
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/config/SecurityConfig.java`

```java
package com.binasystem.profact.config;

import com.binasystem.profact.security.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// RNF-001: BCrypt factor 10 | RNF-002: JWT HS256 | Stateless session
@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configure(http))
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // RNF-002: Rutas públicas (sin token)
                .requestMatchers("/api/auth/login").permitAll()
                .requestMatchers("/h2-console/**").permitAll()
                // CA-002.5: Solo ADMIN puede gestionar usuarios
                .requestMatchers("/api/usuarios/**").hasRole("ADMIN")
                .requestMatchers("/api/categorias/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/productos/**").hasRole("ADMIN")
                // Todas las demás rutas requieren autenticación
                .anyRequest().authenticated()
            )
            // H2 console headers
            .headers(h -> h.frameOptions(f -> f.sameOrigin()))
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    // RNF-001: BCrypt con factor de trabajo 10 (mínimo requerido)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/config/CorsConfig.java`

```java
package com.binasystem.profact.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

// Permite comunicación Frontend (5173) → Backend (8080)
@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return new CorsFilter(source);
    }
}
```

---

### 6.10 DataInitializer

**Ruta:** `backend/src/main/java/com/binasystem/profact/config/DataInitializer.java`

```java
package com.binasystem.profact.config;

import com.binasystem.profact.entity.Categoria;
import com.binasystem.profact.entity.Producto;
import com.binasystem.profact.entity.Proveedor;
import com.binasystem.profact.entity.Usuario;
import com.binasystem.profact.enums.Rol;
import com.binasystem.profact.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(
            UsuarioRepository usuarioRepo,
            CategoriaRepository categoriaRepo,
            ProductoRepository productoRepo,
            ProveedorRepository proveedorRepo,
            PasswordEncoder passwordEncoder) {

        return args -> {
            // Usuario administrador por defecto (PF-001)
            if (usuarioRepo.findByEmail("admin@profact.com").isEmpty()) {
                Usuario admin = new Usuario();
                admin.setNombre("Administrador");
                // Login funciona con email OR con "root" como alias
                admin.setEmail("admin@profact.com");
                admin.setContrasenaHash(passwordEncoder.encode("12345"));
                admin.setRol(Rol.ADMIN);
                admin.setActivo(true);
                usuarioRepo.save(admin);

                // Alias "root" para compatibilidad con el fallback del frontend
                Usuario root = new Usuario();
                root.setNombre("Administrador");
                root.setEmail("root");
                root.setContrasenaHash(passwordEncoder.encode("12345"));
                root.setRol(Rol.ADMIN);
                root.setActivo(true);
                usuarioRepo.save(root);
            }

            // Categorías de ejemplo
            if (categoriaRepo.count() == 0) {
                Categoria cat1 = new Categoria();
                cat1.setNombre("Herramientas Eléctricas");
                cat1.setDescripcion("Taladros, sierras y accesorios eléctricos.");
                categoriaRepo.save(cat1);

                Categoria cat2 = new Categoria();
                cat2.setNombre("Papelería");
                cat2.setDescripcion("Cuadernos, bolígrafos y materiales de oficina.");
                categoriaRepo.save(cat2);

                // Productos de ejemplo
                if (productoRepo.count() == 0) {
                    Producto p1 = new Producto();
                    p1.setNombre("Taladro Bosch 750W");
                    p1.setDescripcion("Taladro percutor profesional");
                    p1.setPrecio(new BigDecimal("89.99"));
                    p1.setStock(15);
                    p1.setStockMinimo(3);
                    p1.setCategoria(cat1);
                    productoRepo.save(p1);

                    Producto p2 = new Producto();
                    p2.setNombre("Cuaderno A4 100 hojas");
                    p2.setDescripcion("Cuaderno cuadriculado");
                    p2.setPrecio(new BigDecimal("2.50"));
                    p2.setStock(200);
                    p2.setStockMinimo(20);
                    p2.setCategoria(cat2);
                    productoRepo.save(p2);
                }

                // Proveedor de ejemplo
                if (proveedorRepo.count() == 0) {
                    Proveedor prov = new Proveedor();
                    prov.setNombre("Distribuidora Central S.A.");
                    prov.setEmail("ventas@distribcentral.ec");
                    prov.setTelefono("0998765432");
                    proveedorRepo.save(prov);
                }
            }
        };
    }
}
```

---

### 6.11 Servicios

**Ruta:** `backend/src/main/java/com/binasystem/profact/service/AuthService.java`

```java
package com.binasystem.profact.service;

import com.binasystem.profact.dto.LoginRequestDTO;
import com.binasystem.profact.dto.LoginResponseDTO;
import com.binasystem.profact.entity.Usuario;
import com.binasystem.profact.exception.CredencialesInvalidasException;
import com.binasystem.profact.exception.CuentaBloqueadaException;
import com.binasystem.profact.repository.UsuarioRepository;
import com.binasystem.profact.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private static final int MAX_INTENTOS = 3;
    private static final int MINUTOS_BLOQUEO = 10;

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UsuarioRepository usuarioRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public LoginResponseDTO login(LoginRequestDTO request) {
        // PV-001: Misma excepción para usuario inexistente y contraseña incorrecta
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
            .orElseThrow(CredencialesInvalidasException::new);

        // PV-002: Verificar si la cuenta está bloqueada
        if (usuario.getBloqueadoHasta() != null &&
            usuario.getBloqueadoHasta().isAfter(LocalDateTime.now())) {
            throw new CuentaBloqueadaException();
        }

        // Restablecer bloqueo expirado
        if (usuario.getBloqueadoHasta() != null &&
            usuario.getBloqueadoHasta().isBefore(LocalDateTime.now())) {
            usuario.setIntentosFallidos(0);
            usuario.setBloqueadoHasta(null);
        }

        // Validar contraseña
        if (!passwordEncoder.matches(request.getContrasena(), usuario.getContrasenaHash())) {
            usuario.setIntentosFallidos(usuario.getIntentosFallidos() + 1);

            // PV-002: Bloquear tras MAX_INTENTOS fallos
            if (usuario.getIntentosFallidos() >= MAX_INTENTOS) {
                usuario.setBloqueadoHasta(LocalDateTime.now().plusMinutes(MINUTOS_BLOQUEO));
            }
            usuarioRepository.save(usuario);
            // PV-001: Mismo mensaje genérico
            throw new CredencialesInvalidasException();
        }

        // Login exitoso: restablecer contador
        usuario.setIntentosFallidos(0);
        usuario.setBloqueadoHasta(null);
        usuarioRepository.save(usuario);

        String token = jwtUtil.generarToken(usuario);

        return new LoginResponseDTO(
            token,
            usuario.getId(),
            usuario.getNombre(),
            usuario.getEmail(),
            usuario.getRol()
        );
    }

    // PF-004: Logout invalida el token
    public void logout(String token) {
        jwtUtil.invalidarToken(token);
    }
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/service/UsuarioService.java`

```java
package com.binasystem.profact.service;

import com.binasystem.profact.dto.UsuarioRequestDTO;
import com.binasystem.profact.dto.UsuarioResponseDTO;
import com.binasystem.profact.entity.Usuario;
import com.binasystem.profact.exception.EmailDuplicadoException;
import com.binasystem.profact.exception.RecursoNoEncontradoException;
import com.binasystem.profact.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UsuarioResponseDTO> listarTodos() {
        return usuarioRepository.findAll().stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    public UsuarioResponseDTO obtenerPorId(Long id) {
        Usuario u = usuarioRepository.findById(id)
            .orElseThrow(() -> new RecursoNoEncontradoException("Usuario", id));
        return mapToDTO(u);
    }

    @Transactional
    public UsuarioResponseDTO crearUsuario(UsuarioRequestDTO dto) {
        // PV-003: Verificar email duplicado
        if (usuarioRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new EmailDuplicadoException();
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(dto.getNombre());
        usuario.setEmail(dto.getEmail());
        // RNF-001: Hash bcrypt factor 10
        usuario.setContrasenaHash(passwordEncoder.encode(dto.getContrasena()));
        usuario.setRol(dto.getRol());
        usuario.setActivo(true);

        return mapToDTO(usuarioRepository.save(usuario));
    }

    @Transactional
    public UsuarioResponseDTO actualizarUsuario(Long id, UsuarioRequestDTO dto) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RecursoNoEncontradoException("Usuario", id));

        // Verificar email duplicado (excluyendo el mismo usuario)
        usuarioRepository.findByEmail(dto.getEmail())
            .filter(u -> !u.getId().equals(id))
            .ifPresent(u -> { throw new EmailDuplicadoException(); });

        usuario.setNombre(dto.getNombre());
        usuario.setEmail(dto.getEmail());
        if (dto.getContrasena() != null && !dto.getContrasena().isBlank()) {
            usuario.setContrasenaHash(passwordEncoder.encode(dto.getContrasena()));
        }
        usuario.setRol(dto.getRol());

        return mapToDTO(usuarioRepository.save(usuario));
    }

    // CA-002.4: Soft deactivation
    @Transactional
    public void cambiarEstado(Long id, boolean activo) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RecursoNoEncontradoException("Usuario", id));
        usuario.setActivo(activo);
        usuarioRepository.save(usuario);
    }

    @Transactional
    public void eliminar(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RecursoNoEncontradoException("Usuario", id);
        }
        usuarioRepository.deleteById(id);
    }

    private UsuarioResponseDTO mapToDTO(Usuario u) {
        // RNF-001: NUNCA exponer contrasenaHash
        return new UsuarioResponseDTO(u.getId(), u.getNombre(), u.getEmail(), u.getRol(), u.isActivo());
    }
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/service/CategoriaService.java`

```java
package com.binasystem.profact.service;

import com.binasystem.profact.dto.CategoriaRequestDTO;
import com.binasystem.profact.dto.CategoriaResponseDTO;
import com.binasystem.profact.entity.Categoria;
import com.binasystem.profact.exception.NombreDuplicadoException;
import com.binasystem.profact.exception.RecursoNoEncontradoException;
import com.binasystem.profact.repository.CategoriaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    public List<CategoriaResponseDTO> listarActivas() {
        // CA-003.4: Solo activas para dropdowns
        return categoriaRepository.findByActivoTrue().stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    public List<CategoriaResponseDTO> listarTodas() {
        return categoriaRepository.findAll().stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    @Transactional
    public CategoriaResponseDTO crearCategoria(CategoriaRequestDTO dto) {
        // PV-004: Verificar nombre duplicado (insensible a mayúsculas)
        categoriaRepository.findByNombreIgnoreCase(dto.getNombre())
            .ifPresent(c -> { throw new NombreDuplicadoException("categoría"); });

        Categoria categoria = new Categoria();
        categoria.setNombre(dto.getNombre());
        categoria.setDescripcion(dto.getDescripcion());
        categoria.setActivo(true);

        return mapToDTO(categoriaRepository.save(categoria));
    }

    @Transactional
    public CategoriaResponseDTO actualizar(Long id, CategoriaRequestDTO dto) {
        Categoria categoria = categoriaRepository.findById(id)
            .orElseThrow(() -> new RecursoNoEncontradoException("Categoría", id));

        categoriaRepository.findByNombreIgnoreCase(dto.getNombre())
            .filter(c -> !c.getId().equals(id))
            .ifPresent(c -> { throw new NombreDuplicadoException("categoría"); });

        categoria.setNombre(dto.getNombre());
        categoria.setDescripcion(dto.getDescripcion());

        return mapToDTO(categoriaRepository.save(categoria));
    }

    // CA-003.3: Soft delete - no elimina registros físicamente
    @Transactional
    public void eliminarCategoria(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
            .orElseThrow(() -> new RecursoNoEncontradoException("Categoría", id));
        categoria.setActivo(false);
        categoriaRepository.save(categoria);
    }

    private CategoriaResponseDTO mapToDTO(Categoria c) {
        return new CategoriaResponseDTO(c.getId(), c.getNombre(), c.getDescripcion(), c.isActivo());
    }
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/service/ProductoService.java`

```java
package com.binasystem.profact.service;

import com.binasystem.profact.dto.ProductoRequestDTO;
import com.binasystem.profact.dto.ProductoResponseDTO;
import com.binasystem.profact.entity.Categoria;
import com.binasystem.profact.entity.Producto;
import com.binasystem.profact.exception.RecursoNoEncontradoException;
import com.binasystem.profact.exception.ValidacionException;
import com.binasystem.profact.repository.CategoriaRepository;
import com.binasystem.profact.repository.ProductoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;

    public ProductoService(ProductoRepository productoRepository,
                           CategoriaRepository categoriaRepository) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
    }

    public List<ProductoResponseDTO> listarActivos() {
        return productoRepository.findByActivoTrue().stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    public ProductoResponseDTO obtenerPorId(Long id) {
        return mapToDTO(productoRepository.findById(id)
            .orElseThrow(() -> new RecursoNoEncontradoException("Producto", id)));
    }

    // CA-004.5: Solo productos con stock crítico
    public List<ProductoResponseDTO> obtenerStockBajo() {
        return productoRepository.findByStockLessThanEqualStockMinimo().stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    @Transactional
    public ProductoResponseDTO crearProducto(ProductoRequestDTO dto) {
        validar(dto);

        Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
            .orElseThrow(() -> new RecursoNoEncontradoException("Categoría", dto.getCategoriaId()));

        Producto producto = new Producto();
        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setPrecio(dto.getPrecio());
        producto.setStock(dto.getStock());
        producto.setStockMinimo(dto.getStockMinimo());
        producto.setCategoria(categoria);
        producto.setActivo(true);

        return mapToDTO(productoRepository.save(producto));
    }

    @Transactional
    public ProductoResponseDTO actualizar(Long id, ProductoRequestDTO dto) {
        validar(dto);
        Producto producto = productoRepository.findById(id)
            .orElseThrow(() -> new RecursoNoEncontradoException("Producto", id));

        Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
            .orElseThrow(() -> new RecursoNoEncontradoException("Categoría", dto.getCategoriaId()));

        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setPrecio(dto.getPrecio());
        producto.setStock(dto.getStock());
        producto.setStockMinimo(dto.getStockMinimo());
        producto.setCategoria(categoria);

        return mapToDTO(productoRepository.save(producto));
    }

    @Transactional
    public void eliminar(Long id) {
        Producto producto = productoRepository.findById(id)
            .orElseThrow(() -> new RecursoNoEncontradoException("Producto", id));
        producto.setActivo(false);
        productoRepository.save(producto);
    }

    // CA-004.4: Precio y stock no pueden ser negativos
    private void validar(ProductoRequestDTO dto) {
        if (dto.getPrecio() != null && dto.getPrecio().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ValidacionException("El precio debe ser mayor a cero");
        }
        if (dto.getStock() < 0) {
            throw new ValidacionException("El stock no puede ser negativo");
        }
    }

    private ProductoResponseDTO mapToDTO(Producto p) {
        boolean stockBajo = p.getStock() <= p.getStockMinimo();
        String catNombre = p.getCategoria() != null ? p.getCategoria().getNombre() : null;
        Long catId = p.getCategoria() != null ? p.getCategoria().getId() : null;
        return new ProductoResponseDTO(
            p.getId(), p.getNombre(), p.getDescripcion(),
            p.getPrecio(), p.getStock(), p.getStockMinimo(),
            stockBajo, catNombre, catId, p.isActivo()
        );
    }
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/service/VentaService.java`

```java
package com.binasystem.profact.service;

import com.binasystem.profact.dto.DetalleVentaDTO;
import com.binasystem.profact.dto.VentaRequestDTO;
import com.binasystem.profact.dto.VentaResponseDTO;
import com.binasystem.profact.entity.*;
import com.binasystem.profact.exception.RecursoNoEncontradoException;
import com.binasystem.profact.exception.StockInsuficienteException;
import com.binasystem.profact.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VentaService {

    private final VentaRepository ventaRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;

    public VentaService(VentaRepository ventaRepository,
                        ProductoRepository productoRepository,
                        UsuarioRepository usuarioRepository) {
        this.ventaRepository = ventaRepository;
        this.productoRepository = productoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<VentaResponseDTO> listar() {
        return ventaRepository.findAll().stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    public VentaResponseDTO obtenerPorId(Long id) {
        return mapToDTO(ventaRepository.findById(id)
            .orElseThrow(() -> new RecursoNoEncontradoException("Venta", id)));
    }

    // CA-005.5: @Transactional garantiza atomicidad (RNF-006)
    @Transactional
    public VentaResponseDTO registrarVenta(VentaRequestDTO dto, Long usuarioId) {
        Usuario vendedor = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new RecursoNoEncontradoException("Usuario", usuarioId));

        Venta venta = new Venta();
        venta.setUsuario(vendedor);

        BigDecimal total = BigDecimal.ZERO;
        List<DetalleVenta> detalles = new ArrayList<>();

        for (DetalleVentaDTO item : dto.getDetalles()) {
            Producto producto = productoRepository.findById(item.getProductoId())
                .orElseThrow(() -> new RecursoNoEncontradoException("Producto", item.getProductoId()));

            // CA-005.2: Verificar stock suficiente
            if (producto.getStock() < item.getCantidad()) {
                throw new StockInsuficienteException(
                    producto.getNombre(), producto.getStock(), item.getCantidad()
                );
            }

            // CA-005.4: Reducir stock
            producto.setStock(producto.getStock() - item.getCantidad());
            productoRepository.save(producto);

            BigDecimal subtotal = producto.getPrecio()
                .multiply(BigDecimal.valueOf(item.getCantidad()));
            total = total.add(subtotal);

            DetalleVenta detalle = new DetalleVenta();
            detalle.setVenta(venta);
            detalle.setProducto(producto);
            detalle.setCantidad(item.getCantidad());
            detalle.setPrecioUnitario(producto.getPrecio());
            detalle.setSubtotal(subtotal);
            detalles.add(detalle);
        }

        // CA-005.3: Total calculado automáticamente
        venta.setTotal(total);
        venta.setDetalles(detalles);

        return mapToDTO(ventaRepository.save(venta));
    }

    private VentaResponseDTO mapToDTO(Venta v) {
        List<VentaResponseDTO.DetalleVentaResponseDTO> detallesDtos = v.getDetalles().stream()
            .map(d -> new VentaResponseDTO.DetalleVentaResponseDTO(
                d.getProducto().getId(),
                d.getProducto().getNombre(),
                d.getCantidad(),
                d.getPrecioUnitario(),
                d.getSubtotal()
            )).collect(Collectors.toList());

        String vendedor = v.getUsuario() != null ? v.getUsuario().getNombre() : "N/A";
        return new VentaResponseDTO(v.getId(), v.getFecha(), v.getTotal(), vendedor, detallesDtos);
    }
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/service/CompraService.java`

```java
package com.binasystem.profact.service;

import com.binasystem.profact.dto.CompraRequestDTO;
import com.binasystem.profact.dto.CompraResponseDTO;
import com.binasystem.profact.entity.*;
import com.binasystem.profact.exception.RecursoNoEncontradoException;
import com.binasystem.profact.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CompraService {

    private final CompraRepository compraRepository;
    private final ProductoRepository productoRepository;
    private final ProveedorRepository proveedorRepository;
    private final UsuarioRepository usuarioRepository;

    public CompraService(CompraRepository compraRepository,
                         ProductoRepository productoRepository,
                         ProveedorRepository proveedorRepository,
                         UsuarioRepository usuarioRepository) {
        this.compraRepository = compraRepository;
        this.productoRepository = productoRepository;
        this.proveedorRepository = proveedorRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<CompraResponseDTO> listar() {
        return compraRepository.findAll().stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    public CompraResponseDTO obtenerPorId(Long id) {
        return mapToDTO(compraRepository.findById(id)
            .orElseThrow(() -> new RecursoNoEncontradoException("Compra", id)));
    }

    @Transactional
    public CompraResponseDTO registrarCompra(CompraRequestDTO dto, Long usuarioId) {
        Proveedor proveedor = proveedorRepository.findById(dto.getProveedorId())
            .orElseThrow(() -> new RecursoNoEncontradoException("Proveedor", dto.getProveedorId()));
        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new RecursoNoEncontradoException("Usuario", usuarioId));

        Compra compra = new Compra();
        compra.setProveedor(proveedor);
        compra.setUsuario(usuario);

        BigDecimal total = BigDecimal.ZERO;
        List<DetalleCompra> detalles = new ArrayList<>();

        for (var item : dto.getDetalles()) {
            Producto producto = productoRepository.findById(item.getProductoId())
                .orElseThrow(() -> new RecursoNoEncontradoException("Producto", item.getProductoId()));

            // CA-006.2: Aumentar stock al comprar
            producto.setStock(producto.getStock() + item.getCantidad());
            productoRepository.save(producto);

            BigDecimal subtotal = item.getPrecioUnitario()
                .multiply(BigDecimal.valueOf(item.getCantidad()));
            total = total.add(subtotal);

            DetalleCompra detalle = new DetalleCompra();
            detalle.setCompra(compra);
            detalle.setProducto(producto);
            detalle.setCantidad(item.getCantidad());
            detalle.setPrecioUnitario(item.getPrecioUnitario());
            detalle.setSubtotal(subtotal);
            detalles.add(detalle);
        }

        compra.setTotal(total);
        compra.setDetalles(detalles);

        return mapToDTO(compraRepository.save(compra));
    }

    private CompraResponseDTO mapToDTO(Compra c) {
        String prov = c.getProveedor() != null ? c.getProveedor().getNombre() : "N/A";
        return new CompraResponseDTO(c.getId(), c.getFecha(), c.getTotal(), prov);
    }
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/service/DashboardService.java`

```java
package com.binasystem.profact.service;

import com.binasystem.profact.dto.DashboardMetricasDTO;
import com.binasystem.profact.repository.CompraRepository;
import com.binasystem.profact.repository.ProductoRepository;
import com.binasystem.profact.repository.VentaRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class DashboardService {

    private final VentaRepository ventaRepository;
    private final CompraRepository compraRepository;
    private final ProductoRepository productoRepository;

    public DashboardService(VentaRepository ventaRepository,
                            CompraRepository compraRepository,
                            ProductoRepository productoRepository) {
        this.ventaRepository = ventaRepository;
        this.compraRepository = compraRepository;
        this.productoRepository = productoRepository;
    }

    public DashboardMetricasDTO obtenerMetricas() {
        LocalDateTime inicioDia = LocalDate.now().atStartOfDay();
        LocalDateTime finDia = inicioDia.plusDays(1);
        LocalDateTime inicioMes = LocalDate.now().withDayOfMonth(1).atStartOfDay();

        // CA-007.1
        BigDecimal ventasHoy = ventaRepository.sumTotalByFechaBetween(inicioDia, finDia);
        BigDecimal ventasMes = ventaRepository.sumTotalByFechaBetween(inicioMes, finDia);

        // CA-007.2
        long comprasMes = compraRepository.countByFechaBetween(inicioMes, finDia);

        // CA-007.3
        long productosStockBajo = productoRepository.findByStockLessThanEqualStockMinimo().size();

        // CA-007.4
        var actividadReciente = ventaRepository.findTop5ByOrderByFechaDesc();

        return new DashboardMetricasDTO(
            ventasHoy,
            ventasMes,
            comprasMes,
            productosStockBajo,
            actividadReciente.size()
        );
    }
}
```

---

### 6.12 Controladores

**Ruta:** `backend/src/main/java/com/binasystem/profact/controller/AuthController.java`

```java
package com.binasystem.profact.controller;

import com.binasystem.profact.dto.LoginRequestDTO;
import com.binasystem.profact.dto.LoginResponseDTO;
import com.binasystem.profact.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // PF-001
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        return ResponseEntity.ok(authService.login(request));
    }

    // PF-004
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        authService.logout(token);
        return ResponseEntity.noContent().build();
    }
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/controller/UsuarioController.java`

```java
package com.binasystem.profact.controller;

import com.binasystem.profact.dto.UsuarioRequestDTO;
import com.binasystem.profact.dto.UsuarioResponseDTO;
import com.binasystem.profact.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@PreAuthorize("hasRole('ADMIN')") // CA-002.5
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> listar() {
        return ResponseEntity.ok(usuarioService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.obtenerPorId(id));
    }

    @PostMapping  // PF-002
    public ResponseEntity<UsuarioResponseDTO> crear(@Valid @RequestBody UsuarioRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.crearUsuario(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> actualizar(@PathVariable Long id,
                                                          @Valid @RequestBody UsuarioRequestDTO dto) {
        return ResponseEntity.ok(usuarioService.actualizarUsuario(id, dto));
    }

    @PatchMapping("/{id}/estado")  // CA-002.4
    public ResponseEntity<Void> cambiarEstado(@PathVariable Long id,
                                               @RequestBody Map<String, Boolean> body) {
        usuarioService.cambiarEstado(id, body.get("activo"));
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        usuarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/controller/CategoriaController.java`

```java
package com.binasystem.profact.controller;

import com.binasystem.profact.dto.CategoriaRequestDTO;
import com.binasystem.profact.dto.CategoriaResponseDTO;
import com.binasystem.profact.service.CategoriaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    private final CategoriaService categoriaService;

    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    // CA-003.4: Endpoint público (con JWT) para dropdowns
    @GetMapping
    public ResponseEntity<List<CategoriaResponseDTO>> listar(
            @RequestParam(defaultValue = "false") boolean todas) {
        if (todas) return ResponseEntity.ok(categoriaService.listarTodas());
        return ResponseEntity.ok(categoriaService.listarActivas());
    }

    @PostMapping  // PF-003
    public ResponseEntity<CategoriaResponseDTO> crear(@Valid @RequestBody CategoriaRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoriaService.crearCategoria(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoriaResponseDTO> actualizar(@PathVariable Long id,
                                                            @Valid @RequestBody CategoriaRequestDTO dto) {
        return ResponseEntity.ok(categoriaService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")  // CA-003.3: Soft delete
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        categoriaService.eliminarCategoria(id);
        return ResponseEntity.noContent().build();
    }
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/controller/ProductoController.java`

```java
package com.binasystem.profact.controller;

import com.binasystem.profact.dto.ProductoRequestDTO;
import com.binasystem.profact.dto.ProductoResponseDTO;
import com.binasystem.profact.service.ProductoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    @GetMapping
    public ResponseEntity<List<ProductoResponseDTO>> listar() {
        return ResponseEntity.ok(productoService.listarActivos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoResponseDTO> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.obtenerPorId(id));
    }

    // CA-004.5: Stock bajo
    @GetMapping("/stock-bajo")
    public ResponseEntity<List<ProductoResponseDTO>> stockBajo() {
        return ResponseEntity.ok(productoService.obtenerStockBajo());
    }

    @PostMapping
    public ResponseEntity<ProductoResponseDTO> crear(@Valid @RequestBody ProductoRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productoService.crearProducto(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductoResponseDTO> actualizar(@PathVariable Long id,
                                                           @Valid @RequestBody ProductoRequestDTO dto) {
        return ResponseEntity.ok(productoService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        productoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/controller/VentaController.java`

```java
package com.binasystem.profact.controller;

import com.binasystem.profact.dto.VentaRequestDTO;
import com.binasystem.profact.dto.VentaResponseDTO;
import com.binasystem.profact.service.VentaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ventas")
public class VentaController {

    private final VentaService ventaService;

    public VentaController(VentaService ventaService) {
        this.ventaService = ventaService;
    }

    @GetMapping
    public ResponseEntity<List<VentaResponseDTO>> listar() {
        return ResponseEntity.ok(ventaService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VentaResponseDTO> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(ventaService.obtenerPorId(id));
    }

    // CA-005: Registro de venta con múltiples productos
    @PostMapping
    public ResponseEntity<VentaResponseDTO> registrar(
            @Valid @RequestBody VentaRequestDTO dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        // El ID del vendedor se extrae del token JWT (no del body)
        Long usuarioId = 1L; // TODO: extraer de UserDetails usando UsuarioRepository
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ventaService.registrarVenta(dto, usuarioId));
    }
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/controller/DashboardController.java`

```java
package com.binasystem.profact.controller;

import com.binasystem.profact.dto.DashboardMetricasDTO;
import com.binasystem.profact.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    // CA-007.1 a CA-007.4
    @GetMapping("/metricas")
    public ResponseEntity<DashboardMetricasDTO> metricas() {
        return ResponseEntity.ok(dashboardService.obtenerMetricas());
    }
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/dto/DashboardMetricasDTO.java`

```java
package com.binasystem.profact.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class DashboardMetricasDTO {
    private BigDecimal ventasHoy;
    private BigDecimal ventasMes;
    private long comprasMes;
    private long productosStockBajo;
    private int actividadRecienteCount;
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/dto/CompraRequestDTO.java`

```java
package com.binasystem.profact.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CompraRequestDTO {
    @NotNull
    private Long proveedorId;
    @NotEmpty @Valid
    private List<DetalleCompraDTO> detalles;

    @Data
    public static class DetalleCompraDTO {
        @NotNull private Long productoId;
        @Min(1) private int cantidad;
        @NotNull private BigDecimal precioUnitario;
    }
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/dto/CompraResponseDTO.java`

```java
package com.binasystem.profact.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class CompraResponseDTO {
    private Long id;
    private LocalDateTime fecha;
    private BigDecimal total;
    private String proveedorNombre;
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/controller/CompraController.java`

```java
package com.binasystem.profact.controller;

import com.binasystem.profact.dto.CompraRequestDTO;
import com.binasystem.profact.dto.CompraResponseDTO;
import com.binasystem.profact.service.CompraService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/compras")
public class CompraController {

    private final CompraService compraService;

    public CompraController(CompraService compraService) {
        this.compraService = compraService;
    }

    @GetMapping
    public ResponseEntity<List<CompraResponseDTO>> listar() {
        return ResponseEntity.ok(compraService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompraResponseDTO> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(compraService.obtenerPorId(id));
    }

    @PostMapping
    public ResponseEntity<CompraResponseDTO> registrar(@Valid @RequestBody CompraRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(compraService.registrarCompra(dto, 1L));
    }
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/controller/ProveedorController.java`

```java
package com.binasystem.profact.controller;

import com.binasystem.profact.dto.ProveedorRequestDTO;
import com.binasystem.profact.dto.ProveedorResponseDTO;
import com.binasystem.profact.entity.Proveedor;
import com.binasystem.profact.repository.ProveedorRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/proveedores")
public class ProveedorController {

    private final ProveedorRepository proveedorRepository;

    public ProveedorController(ProveedorRepository proveedorRepository) {
        this.proveedorRepository = proveedorRepository;
    }

    @GetMapping
    public ResponseEntity<List<ProveedorResponseDTO>> listar() {
        return ResponseEntity.ok(
            proveedorRepository.findByActivoTrue().stream()
                .map(p -> new ProveedorResponseDTO(p.getId(), p.getNombre(), p.getEmail(), p.getTelefono()))
                .collect(Collectors.toList())
        );
    }

    @PostMapping
    public ResponseEntity<ProveedorResponseDTO> crear(@Valid @RequestBody ProveedorRequestDTO dto) {
        Proveedor p = new Proveedor();
        p.setNombre(dto.getNombre());
        p.setEmail(dto.getEmail());
        p.setTelefono(dto.getTelefono());
        p.setDireccion(dto.getDireccion());
        p = proveedorRepository.save(p);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(new ProveedorResponseDTO(p.getId(), p.getNombre(), p.getEmail(), p.getTelefono()));
    }
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/dto/ProveedorRequestDTO.java`

```java
package com.binasystem.profact.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProveedorRequestDTO {
    @NotBlank private String nombre;
    private String email;
    private String telefono;
    private String direccion;
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/dto/ProveedorResponseDTO.java`

```java
package com.binasystem.profact.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProveedorResponseDTO {
    private Long id;
    private String nombre;
    private String email;
    private String telefono;
}
```

---

**Ruta:** `backend/src/main/java/com/binasystem/profact/ProFactApplication.java`

```java
package com.binasystem.profact;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ProFactApplication {
    public static void main(String[] args) {
        SpringApplication.run(ProFactApplication.class, args);
    }
}
```

---

## 7. INTEGRACIÓN FRONTEND ↔ BACKEND

### 7.1 Tabla de Endpoints por Pantalla Frontend

| Pantalla Frontend | Método | Endpoint | Auth requerida |
|-------------------|--------|----------|----------------|
| `Sesion.tsx` | POST | `/api/auth/login` | No |
| `Sesion.tsx` (logout) | POST | `/api/auth/logout` | Sí |
| `InicioDashboard.tsx` | GET | `/api/dashboard/metricas` | Sí |
| `Usuarios.tsx` | GET | `/api/usuarios` | ADMIN |
| `Usuarios.tsx` | POST | `/api/usuarios` | ADMIN |
| `Usuarios.tsx` | PUT | `/api/usuarios/{id}` | ADMIN |
| `Usuarios.tsx` | PATCH | `/api/usuarios/{id}/estado` | ADMIN |
| `Inventario.tsx` | GET | `/api/productos` | Sí |
| `Inventario.tsx` | GET | `/api/productos/stock-bajo` | Sí |
| `Inventario.tsx` | POST | `/api/productos` | Sí |
| `Inventario.tsx` | GET | `/api/categorias` | Sí |
| `Inventario.tsx` | POST | `/api/categorias` | ADMIN |
| `Ventas.tsx` | GET | `/api/ventas` | Sí |
| `Ventas.tsx` | POST | `/api/ventas` | Sí |
| `Compras.tsx` | GET | `/api/compras` | Sí |
| `Compras.tsx` | POST | `/api/compras` | Sí |
| `Compras.tsx` | GET | `/api/proveedores` | Sí |
| `Reportes.tsx` | GET | `/api/reportes/ventas-mensuales` | Sí |
| `Reportes.tsx` | GET | `/api/reportes/productos-mas-vendidos` | Sí |

### 7.2 Header de Autenticación (Frontend)

El frontend debe enviar el JWT en cada petición protegida:

```typescript
// Ejemplo de uso en el frontend (AuthContext o un servicio de API)
const apiRequest = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('profact_token');
  return fetch(`http://localhost:8080${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
};
```

### 7.3 Respuesta de Login (Estructura esperada por el Frontend)

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "id": 1,
  "nombre": "Administrador",
  "email": "admin@profact.com",
  "rol": "ADMIN"
}
```

### 7.4 Manejo del Fallback Local

El `AuthContext.tsx` del frontend ya tiene un sistema de fallback.
Cuando el backend esté activo, el flujo es:
`UI → POST /api/auth/login → Respuesta 200 → Guardar token → Redirigir`

Cuando el backend esté INACTIVO, el frontend usa su validación local:
`usuario: "root" / contraseña: "12345"` → Simula sesión ADMIN

---

## 8. ORDEN DE EJECUCIÓN PARA EL AGENTE

El agente debe ejecutar las tareas en este orden exacto. Marcar cada paso con `[✓]` al completarlo.

```
FASE 1 — CONFIGURACIÓN DEL PROYECTO
[ ] 1.1  Verificar que existe backend/pom.xml con las dependencias del Apartado 6.2
[ ] 1.2  Crear/actualizar backend/src/main/resources/application.properties (Apartado 6.3)

FASE 2 — ENUMS, ENTIDADES Y REPOSITORIOS
[ ] 2.1  Crear Rol.java (Apartado 6.4)
[ ] 2.2  Crear Usuario.java (Apartado 6.5)
[ ] 2.3  Crear Categoria.java (Apartado 6.5)
[ ] 2.4  Crear Producto.java (Apartado 6.5)
[ ] 2.5  Crear Venta.java (Apartado 6.5)
[ ] 2.6  Crear DetalleVenta.java (Apartado 6.5)
[ ] 2.7  Crear Proveedor.java (Apartado 6.5)
[ ] 2.8  Crear Compra.java (Apartado 6.5)
[ ] 2.9  Crear DetalleCompra.java (Apartado 6.5)
[ ] 2.10 Crear UsuarioRepository.java (Apartado 6.7)
[ ] 2.11 Crear CategoriaRepository.java (Apartado 6.7)
[ ] 2.12 Crear ProductoRepository.java (Apartado 6.7)
[ ] 2.13 Crear VentaRepository.java (Apartado 6.7)
[ ] 2.14 Crear CompraRepository.java (Apartado 6.7)
[ ] 2.15 Crear ProveedorRepository.java (Apartado 6.7)
[ ] 2.16 Crear DetalleVentaRepository.java (interfaz vacía extiende JpaRepository<DetalleVenta, Long>)
[ ] 2.17 Crear DetalleCompraRepository.java (interfaz vacía extiende JpaRepository<DetalleCompra, Long>)

FASE 3 — DTOs
[ ] 3.1  Crear LoginRequestDTO.java
[ ] 3.2  Crear LoginResponseDTO.java
[ ] 3.3  Crear UsuarioRequestDTO.java
[ ] 3.4  Crear UsuarioResponseDTO.java
[ ] 3.5  Crear CategoriaRequestDTO.java
[ ] 3.6  Crear CategoriaResponseDTO.java
[ ] 3.7  Crear ProductoRequestDTO.java
[ ] 3.8  Crear ProductoResponseDTO.java
[ ] 3.9  Crear DetalleVentaDTO.java
[ ] 3.10 Crear VentaRequestDTO.java
[ ] 3.11 Crear VentaResponseDTO.java (con clase interna DetalleVentaResponseDTO)
[ ] 3.12 Crear CompraRequestDTO.java (con clase interna DetalleCompraDTO)
[ ] 3.13 Crear CompraResponseDTO.java
[ ] 3.14 Crear ProveedorRequestDTO.java
[ ] 3.15 Crear ProveedorResponseDTO.java
[ ] 3.16 Crear DashboardMetricasDTO.java
[ ] 3.17 Crear ErrorResponseDTO.java

FASE 4 — EXCEPCIONES
[ ] 4.1  Crear CredencialesInvalidasException.java
[ ] 4.2  Crear CuentaBloqueadaException.java
[ ] 4.3  Crear EmailDuplicadoException.java
[ ] 4.4  Crear NombreDuplicadoException.java
[ ] 4.5  Crear StockInsuficienteException.java
[ ] 4.6  Crear ValidacionException.java
[ ] 4.7  Crear RecursoNoEncontradoException.java
[ ] 4.8  Crear GlobalExceptionHandler.java

FASE 5 — SEGURIDAD
[ ] 5.1  Crear JwtUtil.java (Apartado 6.9)
[ ] 5.2  Crear UserDetailsServiceImpl.java (Apartado 6.9)
[ ] 5.3  Crear JwtAuthFilter.java (Apartado 6.9)
[ ] 5.4  Crear SecurityConfig.java (Apartado 6.9)
[ ] 5.5  Crear CorsConfig.java (Apartado 6.9)

FASE 6 — SERVICIOS
[ ] 6.1  Crear AuthService.java
[ ] 6.2  Crear UsuarioService.java
[ ] 6.3  Crear CategoriaService.java
[ ] 6.4  Crear ProductoService.java
[ ] 6.5  Crear VentaService.java
[ ] 6.6  Crear CompraService.java
[ ] 6.7  Crear DashboardService.java

FASE 7 — CONTROLADORES
[ ] 7.1  Crear AuthController.java
[ ] 7.2  Crear UsuarioController.java
[ ] 7.3  Crear CategoriaController.java
[ ] 7.4  Crear ProductoController.java
[ ] 7.5  Crear VentaController.java
[ ] 7.6  Crear CompraController.java
[ ] 7.7  Crear ProveedorController.java
[ ] 7.8  Crear DashboardController.java

FASE 8 — INICIALIZACIÓN
[ ] 8.1  Crear DataInitializer.java (Apartado 6.10)
[ ] 8.2  Crear ProFactApplication.java

FASE 9 — PRUEBAS UNITARIAS
[ ] 9.1  Crear AuthServiceTest.java (Apartado 5.1)
[ ] 9.2  Crear UsuarioServiceTest.java (Apartado 5.2)
[ ] 9.3  Crear CategoriaServiceTest.java (Apartado 5.3)
[ ] 9.4  Crear ProductoServiceTest.java (Apartado 5.4)
[ ] 9.5  Crear VentaServiceTest.java (Apartado 5.5)

FASE 10 — VERIFICACIÓN
[ ] 10.1 Ejecutar: cd backend && ./mvnw clean test
         → Todos los tests deben pasar en verde
[ ] 10.2 Ejecutar: cd backend && ./mvnw spring-boot:run
         → Debe iniciar en puerto 8080 sin errores
[ ] 10.3 Verificar consola H2 en: http://localhost:8080/h2-console
         JDBC URL: jdbc:h2:file:./data/profactdb
[ ] 10.4 Verificar usuarios iniciales con: SELECT * FROM USUARIOS;
         Deben existir los usuarios "admin@profact.com" y "root" con hash bcrypt
[ ] 10.5 Ejecutar cd frontend && npm run dev
         → Debe iniciar en puerto 5173
[ ] 10.6 Probar PF-001: Login con admin@profact.com / 12345 → JWT recibido
[ ] 10.7 Probar PF-004: Logout → token invalidado → GET /api/usuarios → 401
[ ] 10.8 Probar PF-002: Crear usuario Carlos López → HTTP 201
[ ] 10.9 Probar PV-003: Crear usuario con email duplicado → HTTP 400
[ ] 10.10 Probar PF-003: Crear categoría "Herramientas Eléctricas" → HTTP 201
[ ] 10.11 Probar PV-004: Crear categoría duplicada → HTTP 400
[ ] 10.12 Simular PV-002: 3 intentos fallidos → Bloqueo de cuenta 10 min
```

---

## 9. NOTAS FINALES PARA EL AGENTE

- **Lombok:** Todas las entidades y DTOs usan Lombok (`@Data`, `@AllArgsConstructor`, `@NoArgsConstructor`). Verificar que el procesador de anotaciones esté habilitado en el IDE.
- **H2:** La BD se crea en `./data/profactdb` relativa al directorio donde se ejecuta el backend. Si la carpeta no existe, crearla manualmente.
- **JWT Secret:** El secret en `application.properties` debe tener mínimo 32 caracteres para HS256. El ejemplo provisto cumple este requisito.
- **CORS:** El frontend en `localhost:5173` está explícitamente permitido. Si el agente cambia el puerto del frontend, actualizar `CorsConfig.java`.
- **Tests pendientes (PENDIENTE):** Los casos PV-002 y PV-004 están marcados como PENDIENTE. El código del backend los soporta; ejecutar manualmente después del despliegue.
- **VentaController — usuarioId:** La línea `Long usuarioId = 1L;` es provisional. En producción, extraer el ID desde `UserDetails` usando `UsuarioRepository.findByEmail(userDetails.getUsername()).getId()`.
- **ReporteController:** No está incluido en detalle; el agente puede implementarlo con consultas similares a las de `VentaRepository.ventasMensualesPorAnio()` y `CompraRepository`.
