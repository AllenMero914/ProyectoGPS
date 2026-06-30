import React from 'react';
import { Topbar } from '../components/Topbar';

export const Usuarios: React.FC = () => {
  return (
    <main className="main-content">
      <Topbar
        title="Gestión de Usuarios"
        subtitle="Administra los usuarios y permisos del sistema"
        searchPlaceholder="Buscar usuario..."
      />

      <section className="cards">
        <div className="card">
          <div className="card-icon blue">
            <i className="fa-solid fa-users"></i>
          </div>
          <div className="card-info">
            <h2>245</h2>
            <p>Usuarios Totales</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon green">
            <i className="fa-solid fa-user-check"></i>
          </div>
          <div className="card-info">
            <h2>198</h2>
            <p>Usuarios Activos</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon orange">
            <i className="fa-solid fa-user-plus"></i>
          </div>
          <div className="card-info">
            <h2>18</h2>
            <p>Nuevos Usuarios</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon red">
            <i className="fa-solid fa-user-shield"></i>
          </div>
          <div className="card-info">
            <h2>5</h2>
            <p>Administradores</p>
          </div>
        </div>
      </section>

      <section className="content-grid">
        <div className="table-section">
          <div className="table-header">
            <h2>Lista de Usuarios</h2>
            <button onClick={() => alert('Nuevo Usuario clicked')}>
              <i className="fa-solid fa-plus"></i> Nuevo Usuario
            </button>
          </div>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#U001</td>
                <td>Juan Pérez</td>
                <td>juan@gmail.com</td>
                <td>Administrador</td>
                <td>
                  <span className="status completed">Activo</span>
                </td>
              </tr>
              <tr>
                <td>#U002</td>
                <td>María López</td>
                <td>maria@gmail.com</td>
                <td>Empleado</td>
                <td>
                  <span className="status pending">Inactivo</span>
                </td>
              </tr>
              <tr>
                <td>#U003</td>
                <td>Carlos Ruiz</td>
                <td>carlos@gmail.com</td>
                <td>Supervisor</td>
                <td>
                  <span className="status completed">Activo</span>
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
              <p>Hace 15 minutos</p>
            </div>
          </div>

          <div className="activity">
            <div className="activity-icon green">
              <i className="fa-solid fa-user-check"></i>
            </div>
            <div>
              <h4>Usuario Actualizado</h4>
              <p>Hace 40 minutos</p>
            </div>
          </div>

          <div className="activity">
            <div className="activity-icon orange">
              <i className="fa-solid fa-user-shield"></i>
            </div>
            <div>
              <h4>Permisos Modificados</h4>
              <p>Hace 1 hora</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
