# ProFact - Sistema de Gestión de Inventario, Compras y Ventas

![Estado](https://img.shields.io/badge/Estado-Terminado-success)
![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.1-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![JWT](https://img.shields.io/badge/JWT-Seguridad-black)

ProFact es un sistema integral para la gestión de inventarios, compras y ventas con facturación, desarrollado para modernizar y optimizar los procesos comerciales de una empresa. Ofrece un control seguro del stock, historial de transacciones, métricas en tiempo real y generación automática de facturas PDF.

---

## 🚀 Características Principales

*   **Autenticación y Seguridad:** Control de acceso mediante JWT y Spring Security con roles de Administrador y Empleado.
*   **Gestión de Inventario:** Control atómico del stock. Actualización automática de existencias con cada compra y venta.
*   **Compras y Ventas:** Registro de transacciones con opciones de edición, reversión de stock inteligente, y soporte para IVA dinámico.
*   **Precios de Compra y Venta:** Diferenciación entre precios al proveedor y precios al cliente público.
*   **Facturación PDF:** Generación automática de comprobantes y facturas en formato PDF listos para impresión.
*   **Dashboard y Reportes:** Gráficos interactivos en tiempo real mostrando productos más vendidos, y métricas mensuales de compras vs ventas.
*   **Interfaz Moderna:** Diseño responsivo, elegante e intuitivo utilizando React.

---

## 📸 Capturas de Pantalla

<!-- Añade tus imágenes aquí reemplazando las URL falsas por las rutas de tus capturas -->

### Dashboard Principal
![Dashboard Principal](docs/images/dashboard.png)

### Registro de Venta
![Registro de Venta](docs/images/ventas.png)

### Gestión de Inventario
![Gestión de Inventario](docs/images/inventario.png)

### Factura PDF Generada
![Factura PDF](docs/images/factura_pdf.png)

---

## 💻 Tecnologías Utilizadas

### Backend (API REST)
*   **Java 17** con **Spring Boot 3**
*   **Spring Security** + **JSON Web Tokens (JWT)** para autenticación
*   **Spring Data JPA** y **Hibernate**
*   **H2 Database** (Desarrollo) / **PostgreSQL** (Producción)
*   **Lombok** y **MapStruct** (Manejo de DTOs)

### Frontend (SPA)
*   **React 18** (Vite)
*   **TypeScript**
*   **React Router Dom** para navegación
*   **Tailwind CSS** / CSS Vanilla (Sistema de diseño propio)
*   **jsPDF** (Generación de PDF)
*   **Recharts** (Gráficos del Dashboard)

---

## ⚙️ Instalación y Configuración Local

### Prerrequisitos
*   [Java JDK 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html) o superior
*   [Node.js](https://nodejs.org/) (versión 18 o superior)
*   [Maven](https://maven.apache.org/)

### 1. Clonar el repositorio
```bash
git clone https://github.com/AllenMero914/ProyectoGPS.git
cd ProyectoGPS
```

### 2. Configurar y Ejecutar el Backend (Spring Boot)
1. Navega a la carpeta del backend:
   ```bash
   cd backend
   ```
2. Ejecuta el proyecto mediante Maven:
   ```bash
   mvn spring-boot:run
   ```
   *El backend se iniciará en `http://localhost:8080`. La base de datos H2 se creará automáticamente en memoria.*

### 3. Configurar y Ejecutar el Frontend (React)
1. Abre una nueva terminal y navega a la carpeta del frontend:
   ```bash
   cd frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   *El frontend estará disponible en `http://localhost:5173`.*

---

## 📚 Documentación Adicional

Para más detalles sobre la arquitectura, casos de uso, diagrama de base de datos, y los endpoints de la API (Manual Técnico), consulta el documento oficial generado para el proyecto integrador:
*   [ProyectoFinal_GPSW.pdf](./ProyectoFinal_GPSW.pdf) *(Compilar con pdflatex a partir del archivo .tex incluido)*

---

## 👥 Autores
Proyecto Integrador - Gestión de Proyectos de Software (TDSD333)
Escuela Politécnica Nacional
