const API_BASE = 'http://localhost:8080/api';

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('profact_token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  get: <T>(path: string): Promise<T> =>
    fetch(`${API_BASE}${path}`, { headers: authHeaders() }).then(handleResponse<T>),

  post: <T>(path: string, body: unknown): Promise<T> =>
    fetch(`${API_BASE}${path}`, {
      method: 'POST', headers: authHeaders(), body: JSON.stringify(body),
    }).then(handleResponse<T>),

  put: <T>(path: string, body: unknown): Promise<T> =>
    fetch(`${API_BASE}${path}`, {
      method: 'PUT', headers: authHeaders(), body: JSON.stringify(body),
    }).then(handleResponse<T>),

  patch: <T>(path: string, body?: unknown): Promise<T> =>
    fetch(`${API_BASE}${path}`, {
      method: 'PATCH', headers: authHeaders(), body: body ? JSON.stringify(body) : undefined,
    }).then(handleResponse<T>),

  del: <T>(path: string): Promise<T> =>
    fetch(`${API_BASE}${path}`, {
      method: 'DELETE', headers: authHeaders(),
    }).then(handleResponse<T>),
};

export interface DashboardMetricas {
  ventasHoy: number;
  ventasMes: number;
  comprasMes: number;
  productosStockBajo: number;
  actividadRecienteCount: number;
}

export interface ProductoDTO {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  stockMinimo: number;
  stockBajo: boolean;
  categoriaNombre: string;
  categoriaId: number;
  activo: boolean;
}

export interface CategoriaDTO {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

export interface VentaDTO {
  id: number;
  fecha: string;
  total: number;
  vendedor: string;
  detalles: VentaDetalleDTO[];
}

export interface VentaDetalleDTO {
  productoId: number;
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface CompraDTO {
  id: number;
  fecha: string;
  total: number;
  proveedorNombre: string;
}

export interface UsuarioDTO {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  activo: boolean;
}

export interface ProveedorDTO {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
}

export interface ReportEntry {
  mes?: number;
  total?: number;
  productoId?: number;
  productoNombre?: string;
  cantidadVendida?: number;
  totalIngresos?: number;
}
