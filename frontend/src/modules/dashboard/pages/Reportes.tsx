import React, { useEffect, useState } from 'react';
import { Topbar } from '../components/Topbar';
import { api } from '../../../core/api/api';
import type { DashboardMetricas, ReportEntry } from '../../../core/api/api';

export const Reportes: React.FC = () => {
  const [metricas, setMetricas] = useState<DashboardMetricas | null>(null);
  const [ventasMensuales, setVentasMensuales] = useState<ReportEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const anio = new Date().getFullYear();
      const [m, vm] = await Promise.all([
        api.get<DashboardMetricas>('/dashboard/metricas'),
        api.get<ReportEntry[]>(`/reportes/ventas-mensuales?anio=${anio}`),
      ]);
      setMetricas(m);
      setVentasMensuales(vm);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const totalVentas = ventasMensuales.reduce((s, e) => s + (e.total || 0), 0);
  const mejorMes = ventasMensuales.reduce((best, e) => !best || (e.total || 0) > (best.total || 0) ? e : best, undefined as ReportEntry | undefined);
  const totalVentasCount = metricas?.actividadRecienteCount ?? 0;

  return (
    <main className="main-content">
      <Topbar title="Panel de Reportes" subtitle="Visualiza estadísticas y rendimiento del negocio" searchPlaceholder="Buscar reporte..." />

      <section className="cards">
        <div className="card">
          <div className="card-icon blue"><i className="fa-solid fa-chart-column"></i></div>
          <div className="card-info"><h2>${totalVentas.toFixed(2)}</h2><p>Ventas del Año</p></div>
        </div>
        <div className="card">
          <div className="card-icon green"><i className="fa-solid fa-arrow-trend-up"></i></div>
          <div className="card-info">
            <h2>{mejorMes ? meses[(mejorMes.mes || 1) - 1] : '-'}</h2>
            <p>Mejor Mes</p>
          </div>
        </div>
        <div className="card">
          <div className="card-icon orange"><i className="fa-solid fa-cart-shopping"></i></div>
          <div className="card-info"><h2>{totalVentasCount}</h2><p>Ventas Totales</p></div>
        </div>
        <div className="card">
          <div className="card-icon red"><i className="fa-solid fa-users"></i></div>
          <div className="card-info"><h2>{metricas?.productosStockBajo ?? 0}</h2><p>Productos Stock Bajo</p></div>
        </div>
      </section>

      <section className="content-grid">
        <div className="table-section">
          <div className="table-header">
            <h2>Ventas Mensuales</h2>
          </div>
          <table>
            <thead>
              <tr>
                <th>Mes</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={2} className="loading-cell">Cargando...</td></tr>
              ) : ventasMensuales.length === 0 ? (
                <tr><td colSpan={2} className="loading-cell">No hay datos</td></tr>
              ) : ventasMensuales.map((r, i) => (
                <tr key={i}>
                  <td>{meses[(r.mes || 1) - 1]}</td>
                  <td>${(r.total || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="activity-section">
          <div className="activity-header">
            <h2>Resumen Rápido</h2>
          </div>
          <div style={{ padding: '10px 0' }}>
            <p><strong>Ventas Hoy:</strong> ${metricas?.ventasHoy.toFixed(2) ?? '0.00'}</p>
            <p><strong>Ventas del Mes:</strong> ${metricas?.ventasMes.toFixed(2) ?? '0.00'}</p>
            <p><strong>Compras del Mes:</strong> {metricas?.comprasMes ?? 0}</p>
            <p><strong>Productos con Stock Bajo:</strong> {metricas?.productosStockBajo ?? 0}</p>
          </div>
          <div className="activity-header" style={{ marginTop: 20 }}>
            <h2>Exportar Datos</h2>
          </div>
          <p style={{ color: '#6b7280', marginBottom: 10 }}>Descarga los reportes en formato CSV para análisis externo.</p>
          <button
            onClick={() => {
              const csv = 'Mes,Total\n' + ventasMensuales.map(r => `${meses[(r.mes || 1) - 1]},${(r.total || 0).toFixed(2)}`).join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url; a.download = `reporte_ventas_${new Date().getFullYear()}.csv`;
              a.click(); URL.revokeObjectURL(url);
            }}
            style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 12, cursor: 'pointer', fontWeight: 500 }}
            disabled={loading}
          >
            <i className="fa-solid fa-download"></i> Exportar CSV
          </button>
        </div>
      </section>
    </main>
  );
};
