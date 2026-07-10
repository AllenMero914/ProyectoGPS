# Contexto Funcional del Sistema (GestorPro / Inventra)

Este documento describe a nivel de producto y negocio todas las funcionalidades que posee el sistema actual. El objetivo es servir como hoja de ruta o "Product Requirement Document" (PRD) para reconstruir, adaptar o migrar estas funcionalidades hacia un sistema nuevo, independientemente de la tecnología (stack) o lógica interna que se utilice.

---

## 1. Arquitectura de Negocio (Multi-Tenant)

El sistema está diseñado para manejar múltiples empresas de forma aislada.

- **Aislamiento de Datos:** La información de productos, clientes y ventas pertenece a una Empresa específica. Los usuarios solo pueden ver la data de la empresa a la que pertenecen.
- **Roles de Usuario:**
  - **Super Administrador:** Tiene permisos para ver todas las empresas, administrar suscripciones, o configurar parámetros globales.
  - **Usuario Cliente (Dueño/Vendedor):** Administra exclusivamente el inventario, clientes y ventas de su propia empresa (Ej: _EssenceGroup_).

---

## 2. Módulo de Productos (Inventario)

Gestión completa del catálogo de artículos que se comercializan.

- **Datos del Producto:** Código (SKU), Nombre, Categoría, Costo de Compra, Precio Base de Venta y Estado (Activo/Inactivo).
- **Control de Stock:** El sistema debe llevar un conteo de unidades disponibles. No se debe permitir la venta si el stock es insuficiente.
- **Soft Delete:** Los productos no se eliminan físicamente de la base de datos (para no romper historiales de ventas), sino que se marcan como "Inactivos" para que no aparezcan en nuevas ventas.

---

## 3. Módulo de Clientes y Precios Especiales

Gestión de la cartera de clientes y personalización de precios.

- **Datos del Cliente:** Cédula/RUC, Nombre/Razón Social, Teléfono, Sector, Parroquia, Dirección, Observaciones.
- **Control de Estado:** Activos vs Inactivos. Los clientes inactivos no pueden ser seleccionados para nuevas ventas, pero su historial se mantiene.
- **Precios Especiales (Funcionalidad Clave):**
  - El sistema permite asignar precios personalizados a un cliente específico para ciertos productos.
  - Si el cliente "A" tiene un precio especial para la "Proteína Kilo", el sistema debe usar ese precio automáticamente al hacerle una venta, ignorando el "Precio Base" del producto.
- **Seguimiento de Deuda:** El sistema debe calcular y mantener actualizado el `Saldo Pendiente` total de cada cliente.

---

## 4. Módulo de Ventas (Notas de Entrega / Comprobantes)

Es el núcleo transaccional del sistema (Punto de Venta).

- **Experiencia de Venta (Carrito):**
  - Buscador rápido de clientes (solo activos).
  - Buscador de productos (solo activos y con stock > 0).
  - Posibilidad de editar el precio unitario y la cantidad directamente en el carrito antes de cerrar la venta.
- **Cálculos Automáticos:** Subtotal, cálculo de IVA (dependiendo de si el cliente aplica o está exento) y Total.
- **Estados y Cobranza:**
  - **PAGADO (Cancelado):** Se registra inmediatamente el Método de Pago (Efectivo o Transferencia).
  - **POR COBRAR (Pendiente):** No se exige método de pago. La deuda del cliente aumenta automáticamente. En el futuro, el usuario puede buscar esta nota de venta y cambiarla a "Pagado", registrando cómo se pagó y reduciendo la deuda del cliente.
- **Generación de Documentos:**
  - Al guardar, el sistema emite un Comprobante (Nota de Entrega) con numeración secuencial (Ej: `000000857`).
  - **Exportación PDF:** Generación dinámica de un archivo PDF con el diseño de la nota de entrega, logo de la empresa y detalles de la transacción.
  - **Compartir:** Botones integrados para enviar el PDF directamente por WhatsApp (abriendo la app/web con mensaje predefinido) o por Email.

---

## 5. Módulo de Historial e Informes (Dashboard)

Visibilidad del estado del negocio.

- **Métricas Principales (KPIs):**
  - Total de clientes registrados (desglosado en activos e inactivos).
  - Cantidad de clientes con deudas pendientes.
  - Sumatoria total del dinero "Por Cobrar".
  - Sumatoria total del dinero "Cobrado".
- **Historial de Ventas:**
  - Tabla/lista de todas las notas de entrega emitidas.
  - Buscador por número de nota o nombre de cliente.
  - Filtros visuales por estado (Pagado, Por Cobrar, Anulado).
  - Desde el historial se deben poder re-imprimir los PDFs o reenviarlos por WhatsApp.

---

## Consideraciones para el Nuevo Sistema

1. **Validaciones Estrictas:**
   - Nunca permitir ventas sin cliente seleccionado o con carrito vacío.
   - Restringir ventas si superan el stock.
2. **Flexibilidad en el Historial:**
   - Si un producto cambia de precio en el catálogo, **no debe afectar** el precio al que fue vendido en facturas antiguas. Los detalles de las ventas deben guardar una "fotografía" del precio exacto en ese momento.
3. **Escalabilidad:**
   - La estructura debe soportar miles de notas de entrega por mes, por lo que la carga de historiales debe ser paginada (o usar scroll infinito) para no saturar la memoria del navegador.
