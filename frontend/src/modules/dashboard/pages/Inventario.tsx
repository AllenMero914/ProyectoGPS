import React from 'react';
import { Topbar } from '../components/Topbar';

export const Inventario: React.FC = () => {
  return (
    <main className="main-content">
      <Topbar
        title="Inventario de Productos"
        subtitle="Gestiona y controla tus productos en tiempo real"
        searchPlaceholder="Buscar producto..."
      />

      <section className="cards">
        <div className="card">
          <div className="card-icon blue">
            <i className="fa-solid fa-boxes-stacked"></i>
          </div>
          <div className="card-info">
            <h2>256</h2>
            <p>Total Productos</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon green">
            <i className="fa-solid fa-layer-group"></i>
          </div>
          <div className="card-info">
            <h2>198</h2>
            <p>En Stock</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon orange">
            <i className="fa-solid fa-triangle-exclamation"></i>
          </div>
          <div className="card-info">
            <h2>24</h2>
            <p>Bajo Stock</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon red">
            <i className="fa-solid fa-circle-xmark"></i>
          </div>
          <div className="card-info">
            <h2>34</h2>
            <p>Sin Stock</p>
          </div>
        </div>
      </section>

      <section className="table-section">
        <div className="table-header">
          <h2>Lista de Productos</h2>
          <button onClick={() => alert('Nuevo Producto clicked')}>
            <i className="fa-solid fa-plus"></i> Nuevo Producto
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>P001</td>
              <td>Lámpara LED</td>
              <td>Iluminación</td>
              <td>$15</td>
              <td>45</td>
              <td>
                <span className="status available">Disponible</span>
              </td>
            </tr>
            <tr>
              <td>P002</td>
              <td>Mouse Gamer</td>
              <td>Gaming</td>
              <td>$35</td>
              <td>10</td>
              <td>
                <span className="status warning">Bajo Stock</span>
              </td>
            </tr>
            <tr>
              <td>P003</td>
              <td>Teclado Mecánico</td>
              <td>Accesorios</td>
              <td>$60</td>
              <td>0</td>
              <td>
                <span className="status danger">Sin Stock</span>
              </td>
            </tr>
            <tr>
              <td>P004</td>
              <td>Monitor LG</td>
              <td>Pantallas</td>
              <td>$220</td>
              <td>18</td>
              <td>
                <span className="status available">Disponible</span>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  );
};
