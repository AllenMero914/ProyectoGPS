# Modelo de Base de Datos — ProFact

- **Motor:** H2 (embebido, persistente en archivo)
- **ORM:** Spring Data JPA (Hibernate) — `ddl-auto=update`
- **JDBC URL:** `jdbc:h2:file:./data/profactdb`

---

## Diagrama de Relaciones

```
Categoria ──1:N──> Producto ──1:N──> DetalleVenta ──N:1──> Venta ──N:1──> Usuario
                                              ──N:1──> Producto
Producto  ──1:N──> DetalleCompra ──N:1──> Compra ──N:1──> Proveedor
                                              ──N:1──> Usuario
```

---

## Tablas y Entidades

### 1. `usuarios` — Usuario

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | `Long` | PK, autogenerado | Identificador único |
| `nombre` | `String` | NOT NULL | Nombre completo |
| `email` | `String` | NOT NULL, UNIQUE | Correo electrónico (login) |
| `contrasena_hash` | `String` | NOT NULL | Contraseña cifrada (BCrypt) |
| `rol` | `ENUM(ADMIN, EMPLEADO)` | NOT NULL | Rol del usuario |
| `activo` | `boolean` | NOT NULL, default `true` | Eliminación lógica |
| `intentos_fallidos` | `int` | NOT NULL, default `0` | Intentos de login fallidos |
| `bloqueado_hasta` | `LocalDateTime` | nullable | Bloqueo por fecha/hora |
| `creado_en` | `LocalDateTime` | updatable=false | Fecha de creación |

**Relaciones:** Ninguna directa; referenciado por `Venta` y `Compra`.

---

### 2. `categorias` — Categoría

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | `Long` | PK, autogenerado | Identificador único |
| `nombre` | `String` | NOT NULL, UNIQUE | Nombre de la categoría |
| `descripcion` | `String` | nullable | Descripción opcional |
| `activo` | `boolean` | NOT NULL, default `true` | Eliminación lógica |

**Relaciones:** Uno a muchos con `Producto`.

---

### 3. `productos` — Producto

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | `Long` | PK, autogenerado | Identificador único |
| `nombre` | `String` | NOT NULL | Nombre del producto |
| `descripcion` | `String` | nullable | Descripción |
| `precio` | `BigDecimal(10,2)` | NOT NULL | Precio unitario |
| `stock` | `int` | NOT NULL, default `0` | Cantidad en inventario |
| `stock_minimo` | `int` | NOT NULL, default `0` | Stock mínimo de alerta |
| `categoria_id` | `Long` | FK → `categorias(id)` | Categoría |
| `activo` | `boolean` | NOT NULL, default `true` | Eliminación lógica |

**Índices:** `idx_producto_categoria`, `idx_producto_activo`
**Relaciones:** Muchos a uno con `Categoria`; uno a muchos con `DetalleVenta` y `DetalleCompra`.

---

### 4. `proveedores` — Proveedor

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | `Long` | PK, autogenerado | Identificador único |
| `nombre` | `String` | NOT NULL | Nombre del proveedor |
| `email` | `String` | nullable | Correo de contacto |
| `telefono` | `String` | nullable | Teléfono |
| `direccion` | `String` | nullable | Dirección física |
| `activo` | `boolean` | NOT NULL, default `true` | Eliminación lógica |

**Relaciones:** Uno a muchos con `Compra`.

---

### 5. `ventas` — Venta (cabecera)

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | `Long` | PK, autogenerado | Identificador único |
| `fecha` | `LocalDateTime` | NOT NULL | Fecha y hora de la venta |
| `total` | `BigDecimal(10,2)` | NOT NULL | Monto total |
| `usuario_id` | `Long` | FK → `usuarios(id)` | Vendedor que realizó la venta |

**Índices:** `idx_venta_fecha`, `idx_venta_usuario`
**Relaciones:** Muchos a uno con `Usuario`; uno a muchos con `DetalleVenta` (cascada ALL, orphan removal).

---

### 6. `detalles_venta` — Detalle de Venta (líneas)

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | `Long` | PK, autogenerado | Identificador único |
| `venta_id` | `Long` | FK → `ventas(id)`, NOT NULL | Venta padre |
| `producto_id` | `Long` | FK → `productos(id)`, NOT NULL | Producto vendido (EAGER) |
| `cantidad` | `int` | NOT NULL | Cantidad vendida |
| `precio_unitario` | `BigDecimal(10,2)` | NOT NULL | Precio histórico al momento de la venta |
| `subtotal` | `BigDecimal(10,2)` | NOT NULL | Total de la línea |

**Relaciones:** Muchos a uno con `Venta`; muchos a uno con `Producto`.

---

### 7. `compras` — Compra (cabecera)

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | `Long` | PK, autogenerado | Identificador único |
| `fecha` | `LocalDateTime` | NOT NULL | Fecha y hora de la compra |
| `total` | `BigDecimal(10,2)` | NOT NULL | Monto total |
| `proveedor_id` | `Long` | FK → `proveedores(id)` | Proveedor |
| `usuario_id` | `Long` | FK → `usuarios(id)` | Usuario que registró la compra |

**Índices:** `idx_compra_fecha`, `idx_compra_proveedor`
**Relaciones:** Muchos a uno con `Proveedor`; muchos a uno con `Usuario`; uno a muchos con `DetalleCompra` (cascada ALL, orphan removal).

---

### 8. `detalles_compra` — Detalle de Compra (líneas)

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | `Long` | PK, autogenerado | Identificador único |
| `compra_id` | `Long` | FK → `compras(id)`, NOT NULL | Compra padre |
| `producto_id` | `Long` | FK → `productos(id)`, NOT NULL | Producto comprado (EAGER) |
| `cantidad` | `int` | NOT NULL | Cantidad comprada |
| `precio_unitario` | `BigDecimal(10,2)` | NOT NULL | Costo unitario histórico |
| `subtotal` | `BigDecimal(10,2)` | NOT NULL | Total de la línea |

**Relaciones:** Muchos a uno con `Compra`; muchos a uno con `Producto`.

---

## Enumeraciones

### `Rol`

| Valor | Descripción |
|-------|-------------|
| `ADMIN` | Acceso completo al sistema |
| `EMPLEADO` | Acceso limitado (ventas, consultas) |

Almacenado como `VARCHAR` en la columna `rol` de `usuarios`.

---

## Convenciones Generales

- **Eliminación lógica (soft-delete):** Las tablas `usuarios`, `categorias`, `productos` y `proveedores` tienen un campo `activo` booleano. Las transacciones (`ventas`, `compras`) y sus detalles no usan soft-delete.
- **Auditoría:** La tabla `usuarios` tiene `creado_en` como timestamp de creación.
- **Precisión monetaria:** Todos los montos usan `BigDecimal` con precisión 10 y escala 2.
- **Carga perezosa (LAZY):** Relaciones `@ManyToOne` salvo `DetalleVenta.producto` y `DetalleCompra.producto` que son `EAGER`.
- **Cascada:** Las relaciones `@OneToMany` en `Venta.detalles` y `Compra.detalles` usan `cascade = ALL` y `orphanRemoval = true`.

---

## Datos Iniciales (Seed)

El sistema crea automáticamente al iniciar por primera vez:

| Email | Contraseña | Rol |
|-------|-----------|-----|
| `admin@profact.com` | `12345` | ADMIN |
| `root` | `12345` | ADMIN |
