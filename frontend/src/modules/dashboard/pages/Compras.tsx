import React from 'react';
import { Topbar } from '../components/Topbar';

export const Compras: React.FC = () => {
  return (
    <main className="main-content">
      <Topbar
        title="Gestión de Compras"
        subtitle="Administra y controla las compras realizadas"
        searchPlaceholder="Buscar compra..."
      />

      <section className="cards">
        <div className="card">
          <div className="card-icon blue">
            <i className="fa-solid fa-cart-plus"></i>
          </div>
          <div className="card-info">
            <h2>145</h2>
            <p>Compras Totales</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon green">
            <i className="fa-solid fa-dollar-sign"></i>
          </div>
          <div className="card-info">
            <h2>$18,450</h2>
            <p>Total Gastado</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon orange">
            <i className="fa-solid fa-truck"></i>
          </div>
          <div className="card-info">
            <h2>23</h2>
            <p>Proveedores</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon red">
            <i className="fa-solid fa-clock"></i>
          </div>
          <div className="card-info">
            <h2>12</h2>
            <p>Pendientes</p>
          </div>
        </div>
      </section>

      <section className="content-grid">
        <div className="table-section">
          <div className="table-header">
            <h2>Últimas Compras</h2>
            <button onClick={() => alert('Nueva Compra clicked')}>
              <i className="fa-solid fa-plus"></i> Nueva Compra
            </button>
          </div>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Proveedor</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#C001</td>
                <td>TechSupplier</td>
                <td>Monitores</td>
                <td>15</td>
                <td>$3,000</td>
                <td>
                  <span className="status completed">Recibido</span>
                </td>
              </tr>
              <tr>
                <td>#C002</td>
                <td>GamingStore</td>
                <td>Teclados</td>
                <td>25</td>
                <td>$1,200</td>
                <td>
                  <span className="status pending">Pendiente</span>
                </td>
              </tr>
              <tr>
                <td>#C003</td>
                <td>ImportTech</td>
                <td>Mouse Gamer</td>
                <td>40</td>
                <td>$950</td>
                <td>
                  <span className="status completed">Recibido</span>
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
              <i className="fa-solid fa-cart-plus"></i>
            </div>
            <div>
              <h4>Nueva Compra Registrada</h4>
              <p>Hace 10 minutos</p>
            </div>
          </div>

          <div className="activity">
            <div className="activity-icon green">
              <i className="fa-solid fa-box-open"></i>
            </div>
            <div>
              <h4>Pedido Recibido</h4>
              <p>Hace 25 minutos</p>
            </div>
          </div>

          <div className="activity">
            <div className="activity-icon orange">
              <i className="fa-solid fa-truck"></i>
            </div>
            <div>
              <h4>Proveedor Actualizado</h4>
              <p>Hace 1 hora</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
