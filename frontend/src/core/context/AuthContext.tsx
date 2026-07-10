import React, { createContext, useContext, useState } from 'react';

const API_BASE_URL = 'http://localhost:8081';

interface UserData {
  nombre: string;
  rol: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  token: string | null;
  login: (usuario: string, contrasenia: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('profact_auth') === 'true';
  });

  const [user, setUser] = useState<UserData | null>(() => {
    const stored = localStorage.getItem('profact_user');
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('profact_token');
  });

  /**
   * Intenta autenticar al usuario contra el backend de Spring Boot.
   * Si el backend no está disponible, usa un fallback local para desarrollo.
   */
  const login = async (usuario: string, contrasenia: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: usuario, contrasena: contrasenia }),
      });

      if (response.ok) {
        const data = await response.json();
        const userData: UserData = {
          nombre: data.nombre,
          rol: data.rol,
        };
        setIsAuthenticated(true);
        setUser(userData);
        setToken(data.token);
        localStorage.setItem('profact_auth', 'true');
        localStorage.setItem('profact_user', JSON.stringify(userData));
        localStorage.setItem('profact_token', data.token);
        return true;
      }
      return false;
    } catch {
      console.warn('Backend no disponible. Usando autenticación local (fallback).');
      if (usuario === 'root' && contrasenia === '12345') {
        const userData: UserData = { nombre: 'Administrador', rol: 'ADMIN' };
        setIsAuthenticated(true);
        setUser(userData);
        localStorage.setItem('profact_auth', 'true');
        localStorage.setItem('profact_user', JSON.stringify(userData));
        return true;
      }
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    localStorage.removeItem('profact_auth');
    localStorage.removeItem('profact_user');
    localStorage.removeItem('profact_token');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
