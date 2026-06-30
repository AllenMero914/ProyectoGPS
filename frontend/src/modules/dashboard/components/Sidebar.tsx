import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../core/context/AuthContext';
import logoProFact from '../../../assets/images/logoProFact.png';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.confirm('¿Desea cerrar sesión?')) {
      logout();
      navigate('/sesion');
    }
  };

  return (
    <aside className="sidebar">
      <div className="logo">
        <h2>ProFact</h2>
        <img src={logoProFact} alt="ProFact Logo" style={{ maxWidth: '100%', height: 'auto' }} />
      </div>
      <nav>
        <ul>
          <li className={isActive('/dashboard') ? 'active' : ''}>
            <Link to="/dashboard">
              <i className="fa-solid fa-house"></i>
              <span>Inicio</span>
            </Link>
          </li>
          <li className={isActive('/dashboard/compras') ? 'active' : ''}>
            <Link to="/dashboard/compras">
              <i className="fa-solid fa-cart-shopping"></i>
              <span>Compras</span>
            </Link>
          </li>
          <li className={isActive('/dashboard/ventas') ? 'active' : ''}>
            <Link to="/dashboard/ventas">
              <i className="fa-solid fa-cash-register"></i>
              <span>Ventas</span>
            </Link>
          </li>
          <li className={isActive('/dashboard/inventario') ? 'active' : ''}>
            <Link to="/dashboard/inventario">
              <i className="fa-solid fa-box"></i>
              <span>Inventario</span>
            </Link>
          </li>
          <li className={isActive('/dashboard/reportes') ? 'active' : ''}>
            <Link to="/dashboard/reportes">
              <i className="fa-solid fa-chart-line"></i>
              <span>Reportes</span>
            </Link>
          </li>
          <li className={isActive('/dashboard/usuarios') ? 'active' : ''}>
            <Link to="/dashboard/usuarios">
              <i className="fa-solid fa-users"></i>
              <span>Usuarios</span>
            </Link>
          </li>
          <li>
            <a href="/sesion" onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket"></i>
              <span>Cerrar Sesión</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};
