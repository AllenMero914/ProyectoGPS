import React from 'react';
import { Topbar } from '../components/Topbar';

export const InicioDashboard: React.FC = () => {
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
            <h2>$12,540</h2>
            <p>Ventas Totales</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon green">
            <i className="fa-solid fa-cart-shopping"></i>
          </div>
          <div className="card-info">
            <h2>356</h2>
            <p>Ventas Realizadas</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon orange">
            <i className="fa-solid fa-users"></i>
          </div>
          <div className="card-info">
            <h2>120</h2>
            <p>Clientes</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon red">
            <i className="fa-solid fa-box"></i>
          </div>
          <div className="card-info">
            <h2>89</h2>
            <p>Productos</p>
          </div>
        </div>
      </section>

      <section className="content-grid">
        <div className="table-section">
          <div className="table-header">
            <h2>Últimas Ventas</h2>
            <button onClick={() => alert('Ver todo clicked')}>
              <i className="fa-solid fa-eye"></i> Ver Todo
            </button>
          </div>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Producto</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#001</td>
                <td>Juan Pérez</td>
                <td>Laptop HP</td>
                <td>$850</td>
                <td>
                  <span className="status completed">Completado</span>
                </td>
              </tr>
              <tr>
                <td>#002</td>
                <td>María López</td>
                <td>Mouse Gamer</td>
                <td>$35</td>
                <td>
                  <span className="status pending">Pendiente</span>
                </td>
              </tr>
              <tr>
                <td>#003</td>
                <td>Carlos Ruiz</td>
                <td>Monitor LG</td>
                <td>$220</td>
                <td>
                  <span className="status completed">Completado</span>
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
              <i className="fa-solid fa-user-plus"></i>
            </div>
            <div>
              <h4>Nuevo Usuario Registrado</h4>
              <p>Hace 5 minutos</p>
            </div>
          </div>

          <div className="activity">
            <div className="activity-icon green">
              <i className="fa-solid fa-cart-plus"></i>
            </div>
            <div>
              <h4>Nueva Venta Realizada</h4>
              <p>Hace 15 minutos</p>
            </div>
          </div>

          <div className="activity">
            <div className="activity-icon orange">
              <i className="fa-solid fa-box-open"></i>
            </div>
            <div>
              <h4>Producto Actualizado</h4>
              <p>Hace 30 minutos</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
