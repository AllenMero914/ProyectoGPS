import React from 'react';
import { Topbar } from '../components/Topbar';

export const Reportes: React.FC = () => {
  return (
    <main className="main-content">
      <Topbar
        title="Panel de Reportes"
        subtitle="Visualiza estadísticas y rendimiento del negocio"
        searchPlaceholder="Buscar reporte..."
      />

      <section className="cards">
        <div className="card">
          <div className="card-icon blue">
            <i className="fa-solid fa-chart-column"></i>
          </div>
          <div className="card-info">
            <h2>$52,840</h2>
            <p>Ingresos Mensuales</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon green">
            <i className="fa-solid fa-arrow-trend-up"></i>
          </div>
          <div className="card-info">
            <h2>+24%</h2>
            <p>Crecimiento</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon orange">
            <i className="fa-solid fa-cart-shopping"></i>
          </div>
          <div className="card-info">
            <h2>1,240</h2>
            <p>Ventas Totales</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon red">
            <i className="fa-solid fa-users"></i>
          </div>
          <div className="card-info">
            <h2>450</h2>
            <p>Clientes Nuevos</p>
          </div>
        </div>
      </section>

      <section className="content-grid">
        <div className="table-section">
          <div className="table-header">
            <h2>Reportes Recientes</h2>
            <button onClick={() => alert('Exportar clicked')}>
              <i className="fa-solid fa-download"></i> Exportar
            </button>
          </div>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Reporte</th>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#R001</td>
                <td>Ventas Mensuales</td>
                <td>27/05/2026</td>
                <td>Financiero</td>
                <td>
                  <span className="status completed">Generado</span>
                </td>
              </tr>
              <tr>
                <td>#R002</td>
                <td>Inventario General</td>
                <td>26/05/2026</td>
                <td>Inventario</td>
                <td>
                  <span className="status pending">Pendiente</span>
                </td>
              </tr>
              <tr>
                <td>#R003</td>
                <td>Clientes Activos</td>
                <td>25/05/2026</td>
                <td>Usuarios</td>
                <td>
                  <span className="status completed">Generado</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="activity-section">
          <div className="activity-header">
            <h2>Actividad Reciente</h2>
          </div>

          <div className="activity">
            <div className="activity-icon blue">
              <i className="fa-solid fa-file-lines"></i>
            </div>
            <div>
              <h4>Nuevo Reporte Generado</h4>
              <p>Hace 10 minutos</p>
            </div>
          </div>

          <div className="activity">
            <div className="activity-icon green">
              <i className="fa-solid fa-chart-pie"></i>
            </div>
            <div>
              <h4>Estadísticas Actualizadas</h4>
              <p>Hace 30 minutos</p>
            </div>
          </div>

          <div className="activity">
            <div className="activity-icon orange">
              <i className="fa-solid fa-download"></i>
            </div>
            <div>
              <h4>Reporte Exportado</h4>
              <p>Hace 1 hora</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
