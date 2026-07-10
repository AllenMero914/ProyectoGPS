import React, { useEffect, useState } from 'react';
import { Topbar } from '../components/Topbar';
import { Modal } from '../../../core/components/Modal';
import { api } from '../../../core/api/api';
import type { UsuarioDTO } from '../../../core/api/api';

import { useAuth } from '../../../core/context/AuthContext';

export const Usuarios: React.FC = () => {
  const { user } = useAuth();

  if (user?.rol === 'VENDEDOR') {
    return (
      <main className="main-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <i className="fa-solid fa-lock" style={{ fontSize: '4rem', color: '#9ca3af', marginBottom: '20px' }}></i>
        <h2 style={{ fontSize: '2rem', color: '#374151', marginBottom: '10px' }}>Acceso Restringido</h2>
        <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>Tu rol de Vendedor no tiene permisos para acceder a este módulo.</p>
      </main>
    );
  }

  const [usuarios, setUsuarios] = useState<UsuarioDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<UsuarioDTO | null>(null);
  const [form, setForm] = useState({ nombre: '', email: '', contrasena: '', rol: 'VENDEDOR' });
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    try {
      const u = await api.get<UsuarioDTO[]>('/usuarios');
      setUsuarios(u);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openNuevo = () => {
    setEditando(null);
    setForm({ nombre: '', email: '', contrasena: '', rol: 'VENDEDOR' });
    setModalOpen(true);
  };

  const openEditar = (u: UsuarioDTO) => {
    setEditando(u);
    setForm({ nombre: u.nombre, email: u.email, contrasena: '', rol: u.rol });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const body: Record<string, unknown> = { nombre: form.nombre, email: form.email, rol: form.rol };
      if (!editando || form.contrasena) body.contrasena = form.contrasena;

      if (editando) {
        await api.put(`/usuarios/${editando.id}`, body);
      } else {
        await api.post('/usuarios', { ...body, contrasena: form.contrasena });
      }
      setModalOpen(false);
      await load();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error al guardar usuario');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleEstado = async (u: UsuarioDTO) => {
    try {
      await api.patch(`/usuarios/${u.id}/estado`, { activo: !u.activo });
      await load();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error al cambiar estado');
    }
  };

  const eliminar = async (id: number) => {
    if (!window.confirm('¿Eliminar este usuario?')) return;
    try {
      await api.del(`/usuarios/${id}`);
      await load();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error al eliminar usuario');
    }
  };

  const activos = usuarios.filter(u => u.activo).length;
  const admins = usuarios.filter(u => u.rol === 'ADMIN').length;

  return (
    <main className="main-content">
      <Topbar title="Gestión de Usuarios" subtitle="Administra los usuarios y permisos del sistema" searchPlaceholder="Buscar usuario..." />

      <section className="cards">
        <div className="card">
          <div className="card-icon blue"><i className="fa-solid fa-users"></i></div>
          <div className="card-info"><h2>{usuarios.length}</h2><p>Usuarios Totales</p></div>
        </div>
        <div className="card">
          <div className="card-icon green"><i className="fa-solid fa-user-check"></i></div>
          <div className="card-info"><h2>{activos}</h2><p>Usuarios Activos</p></div>
        </div>
        <div className="card">
          <div className="card-icon orange"><i className="fa-solid fa-user-plus"></i></div>
          <div className="card-info"><h2>{usuarios.length - activos}</h2><p>Inactivos</p></div>
        </div>
        <div className="card">
          <div className="card-icon red"><i className="fa-solid fa-user-shield"></i></div>
          <div className="card-info"><h2>{admins}</h2><p>Administradores</p></div>
        </div>
      </section>

      <section className="table-section">
        <div className="table-header">
          <h2>Lista de Usuarios</h2>
          <button onClick={openNuevo}><i className="fa-solid fa-plus"></i> Nuevo Usuario</button>
        </div>
        <div className="table-responsive">
          <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="loading-cell">Cargando...</td></tr>
            ) : usuarios.length === 0 ? (
              <tr><td colSpan={6} className="loading-cell">No hay usuarios</td></tr>
            ) : usuarios.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.nombre}</td>
                <td>{u.email}</td>
                <td>{u.rol}</td>
                <td>
                  <span className={`status ${u.activo ? 'completed' : 'pending'}`}>
                    {u.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <button className="btn-icon edit" onClick={() => openEditar(u)} title="Editar">
                    <i className="fa-solid fa-pen"></i>
                  </button>
                  <button className="btn-icon toggle" onClick={() => toggleEstado(u)} title={u.activo ? 'Desactivar' : 'Activar'}>
                    <i className={`fa-solid ${u.activo ? 'fa-ban' : 'fa-check'}`}></i>
                  </button>
                  <button className="btn-icon delete" onClick={() => eliminar(u.id)} title="Eliminar">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </section>

      <Modal open={modalOpen} title={editando ? 'Editar Usuario' : 'Nuevo Usuario'} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre</label>
            <input required value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Contraseña {editando && <span style={{ color: '#6b7280', fontWeight: 400 }}>(dejar vacío para mantener)</span>}</label>
            <input type="password" value={form.contrasena} onChange={e => setForm({ ...form, contrasena: e.target.value })} required={!editando} />
          </div>
          <div className="form-group">
            <label>Rol</label>
            <select value={form.rol} onChange={e => setForm({ ...form, rol: e.target.value })}>
              <option value="ADMIN">Administrador (Acceso Total)</option>
              <option value="VENDEDOR">Vendedor (Ventas e Inventario Limitado)</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => setModalOpen(false)}>Cancelar</button>
            <button type="submit" className="btn-submit" disabled={submitting}>
              {submitting ? 'Guardando...' : editando ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </Modal>
    </main>
  );
};
