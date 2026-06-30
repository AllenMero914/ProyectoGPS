import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../core/context/AuthContext';
import adminAvatar from '../../../assets/dashboard-images/global-admin-icon-color-outline-vector.jpg';

interface TopbarProps {
  title: string;
  subtitle: string;
  searchPlaceholder?: string;
}

export const Topbar: React.FC<TopbarProps> = ({
  title,
  subtitle,
  searchPlaceholder = 'Buscar...',
}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('¿Desea cerrar sesión?')) {
      logout();
      navigate('/sesion');
    }
  };

  return (
    <header className="topbar">
      <div className="topbar-text">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="topbar-right">
        <div className="search-box">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input type="text" placeholder={searchPlaceholder} />
        </div>
        <div className="admin-box" onClick={handleLogout} style={{ cursor: 'pointer' }} title="Haga clic para cerrar sesión">
          <img src={adminAvatar} alt="Administrador" />
          <div>
            <h4>Administrador</h4>
            <span>Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};
