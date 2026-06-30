import React from 'react';
import { Topbar } from '../components/Topbar';

export const Ventas: React.FC = () => {
  return (
    <main className="main-content">
      <Topbar
        title="Gestión de Ventas"
        subtitle="Controla todas las ventas y facturación del negocio"
        searchPlaceholder="Buscar venta..."
      />

      <section className="cards">
        <div className="card">
          <div className="card-icon blue">
            <i className="fa-solid fa-dollar-sign"></i>
          </div>
          <div className="card-info">
            <h2>$32,540</h2>
            <p>Ingresos Totales</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon green">
            <i className="fa-solid fa-receipt"></i>
          </div>
          <div className="card-info">
            <h2>425</h2>
            <p>Facturas Emitidas</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon orange">
            <i className="fa-solid fa-users"></i>
          </div>
          <div className="card-info">
            <h2>185</h2>
            <p>Clientes Activos</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon red">
            <i className="fa-solid fa-chart-line"></i>
          </div>
          <div className="card-info">
            <h2>+18%</h2>
            <p>Crecimiento</p>
          </div>
        </div>
      </section>

      <section className="content-grid">
        <div className="table-section">
          <div className="table-header">
            <h2>Últimas Ventas</h2>
            <button onClick={() => alert('Nueva Venta clicked')}>
              <i className="fa-solid fa-plus"></i> Nueva Venta
            </button>
          </div>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Producto</th>
                <th>Método</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#V001</td>
                <td>Juan Pérez</td>
                <td>Laptop HP</td>
                <td>Tarjeta</td>
                <td>$850</td>
                <td>
                  <span className="status completed">Pagado</span>
                </td>
              </tr>
              <tr>
                <td>#V002</td>
                <td>María López</td>
                <td>Mouse Gamer</td>
                <td>Efectivo</td>
                <td>$35</td>
                <td>
                  <span className="status pending">Pendiente</span>
                </td>
              </tr>
              <tr>
                <td>#V003</td>
                <td>Carlos Ruiz</td>
                <td>Monitor LG</td>
                <td>Transferencia</td>
                <td>$220</td>
                <td>
                  <span className="status completed">Pagado</span>
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
              <i className="fa-solid fa-cash-register"></i>
            </div>
            <div>
              <h4>Nueva Venta Registrada</h4>
              <p>Hace 5 minutos</p>
            </div>
          </div>

          <div className="activity">
            <div className="activity-icon green">
              <i className="fa-solid fa-file-invoice-dollar"></i>
            </div>
            <div>
              <h4>Factura Generada</h4>
              <p>Hace 20 minutos</p>
            </div>
          </div>

          <div className="activity">
            <div className="activity-icon orange">
              <i className="fa-solid fa-credit-card"></i>
            </div>
            <div>
              <h4>Pago Confirmado</h4>
              <p>Hace 1 hora</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
