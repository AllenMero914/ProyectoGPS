import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../core/context/AuthContext';
import logoProfact from '../../../assets/images/logoProFact.png';

export const Sesion: React.FC = () => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const success = await login(usuario, password);
      if (success) {
        navigate('/dashboard');
      } else {
        alert('Usuario o contraseña incorrectos');
      }
    } catch {
      alert('Error al intentar iniciar sesión. Intente de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="login-section">
      <div className="login-left">
        <div className="login-box">
          <img src={logoProfact} alt="ProFact Logo" className="login-logo" />
          <h1>Bienvenido</h1>
          <p className="login-text">
            Ingresa a tu cuenta para administrar tu empresa de manera inteligente.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <i className="fa-solid fa-user"></i>
              <input
                type="text"
                id="usuario"
                placeholder="Usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="input-group">
              <i className="fa-solid fa-lock"></i>
              <input
                type="password"
                id="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Ingresando...' : 'Ingresar'}
            </button>
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <Link to="/" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600, fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <i className="fa-solid fa-arrow-left"></i>
                Volver a la Página Principal
              </Link>
            </div>
          </form>
        </div>
      </div>
      <div className="login-right"></div>
    </section>
  );
};

