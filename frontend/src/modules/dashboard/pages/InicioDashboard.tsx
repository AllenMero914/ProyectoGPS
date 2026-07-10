import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Topbar } from '../components/Topbar';
import { api } from '../../../core/api/api';
import type { DashboardMetricas, VentaDTO } from '../../../core/api/api';

export const InicioDashboard: React.FC = () => {
  const [metricas, setMetricas] = useState<DashboardMetricas | null>(null);
  const [ventas, setVentas] = useState<VentaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const [m, v] = await Promise.all([
        api.get<DashboardMetricas>('/dashboard/metricas'),
        api.get<VentaDTO[]>('/ventas'),
      ]);
      setMetricas(m);
      setVentas(v.slice(0, 5));
    } catch {
      // silently keep stale data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="main-content">
      <Topbar
        title="Dashboard Principal"
        subtitle="Bienvenido al sistema de gestión empresarial ProFact"
        searchPlaceholder="Buscar..."
      />

      <section className="cards">
        <div className="card">
          <div className="card-icon blue">
            <i className="fa-solid fa-dollar-sign"></i>
          </div>
          <div className="card-info">
            <h2>{metricas ? `$${metricas.ventasMes.toLocaleString()}` : '$0'}</h2>
            <p>Ventas del Mes</p>
          </div>
        </div>
        <div className="card">
          <div className="card-icon green">
            <i className="fa-solid fa-cart-shopping"></i>
          </div>
          <div className="card-info">
            <h2>{metricas ? metricas.ventasHoy.toLocaleString() : '0'}</h2>
            <p>Ventas Hoy</p>
          </div>
        </div>
        <div className="card">
          <div className="card-icon orange">
            <i className="fa-solid fa-truck"></i>
          </div>
          <div className="card-info">
            <h2>{metricas ? metricas.comprasMes.toLocaleString() : '0'}</h2>
            <p>Compras del Mes</p>
          </div>
        </div>
        <div className="card">
          <div className="card-icon red">
            <i className="fa-solid fa-triangle-exclamation"></i>
          </div>
          <div className="card-info">
            <h2>{metricas ? metricas.productosStockBajo.toLocaleString() : '0'}</h2>
            <p>Productos Stock Bajo</p>
          </div>
        </div>
      </section>

      <section className="content-grid">
        <div className="table-section">
          <div className="table-header">
            <h2>Últimas Ventas</h2>
            <button onClick={() => navigate('/dashboard/ventas')}>
              <i className="fa-solid fa-eye"></i> Ver Todo
            </button>
          </div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Vendedor</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="loading-cell">Cargando...</td></tr>
              ) : ventas.length === 0 ? (
                <tr><td colSpan={5} className="loading-cell">No hay ventas registradas</td></tr>
              ) : ventas.map(v => (
                <tr key={v.id}>
                  <td>#{v.id}</td>
                  <td>{v.vendedor}</td>
                  <td>{v.detalles?.map(d => d.productoNombre).join(', ')}</td>
                  <td>${v.total.toFixed(2)}</td>
                  <td>{new Date(v.fecha).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="activity-section">
          <div className="activity-header">
            <h2>Actividad Reciente</h2>
          </div>
          {loading ? (
            <p className="loading-cell">Cargando...</p>
          ) : ventas.length === 0 ? (
            <p className="loading-cell">Sin actividad reciente</p>
          ) : ventas.slice(0, 5).map((v, i) => {
            const icons = ['cart-plus', 'cash-register', 'file-invoice-dollar', 'credit-card', 'receipt'];
            const colors = ['blue', 'green', 'orange', 'blue', 'green'];
            const label = i === 0 ? 'Nueva Venta Registrada' :
              i === 1 ? 'Factura Generada' :
              i === 2 ? 'Pago Confirmado' :
              i === 3 ? 'Venta Completada' : 'Transacción Realizada';
            return (
              <div className="activity" key={v.id}>
                <div className={`activity-icon ${colors[i]}`}>
                  <i className={`fa-solid fa-${icons[i]}`}></i>
                </div>
                <div>
                  <h4>{label}</h4>
                  <p>#{v.id} - ${v.total.toFixed(2)} · {new Date(v.fecha).toLocaleString()}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
};
