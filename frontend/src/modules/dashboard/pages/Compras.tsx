import React, { useEffect, useState } from 'react';
import { Topbar } from '../components/Topbar';
import { Modal } from '../../../core/components/Modal';
import { api } from '../../../core/api/api';
import type { CompraDTO, ProveedorDTO, ProductoDTO } from '../../../core/api/api';

export const Compras: React.FC = () => {
  const [compras, setCompras] = useState<CompraDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [proveedores, setProveedores] = useState<ProveedorDTO[]>([]);
  const [productos, setProductos] = useState<ProductoDTO[]>([]);
  const [proveedorId, setProveedorId] = useState('');
  const [detalles, setDetalles] = useState<{ productoId: string; cantidad: string; precio: string }[]>([
    { productoId: '', cantidad: '1', precio: '' },
  ]);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    try {
      const [c, pv, pr] = await Promise.all([
        api.get<CompraDTO[]>('/compras'),
        api.get<ProveedorDTO[]>('/proveedores'),
        api.get<ProductoDTO[]>('/productos'),
      ]);
      setCompras(c);
      setProveedores(pv);
      setProductos(pr.filter(p => p.activo));
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openNuevo = () => {
    setProveedorId('');
    setDetalles([{ productoId: '', cantidad: '1', precio: '' }]);
    setModalOpen(true);
  };

  const cambiarDetalle = (i: number, field: 'productoId' | 'cantidad' | 'precio', value: string) => {
    const copy = [...detalles];
    copy[i] = { ...copy[i], [field]: value };
    if (field === 'productoId') {
      const p = productos.find(pr => pr.id === parseInt(value));
      if (p) copy[i].precio = String(p.precio);
    }
    setDetalles(copy);
  };

  const agregarDetalle = () => setDetalles([...detalles, { productoId: '', cantidad: '1', precio: '' }]);
  const quitarDetalle = (i: number) => {
    if (detalles.length > 1) setDetalles(detalles.filter((_, idx) => idx !== i));
  };

  const calcularTotal = () => {
    return detalles.reduce((sum, d) => sum + (parseFloat(d.precio || '0') * parseInt(d.cantidad || '0')), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/compras', {
        proveedorId: parseInt(proveedorId),
        detalles: detalles.map(d => ({
          productoId: parseInt(d.productoId),
          cantidad: parseInt(d.cantidad),
          precioUnitario: parseFloat(d.precio),
        })),
      });
      setModalOpen(false);
      await load();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error al registrar compra');
    } finally {
      setSubmitting(false);
    }
  };

  const totalGastado = compras.reduce((s, c) => s + c.total, 0);

  return (
    <main className="main-content">
      <Topbar title="Gestión de Compras" subtitle="Administra y controla las compras realizadas" searchPlaceholder="Buscar compra..." />

      <section className="cards">
        <div className="card">
          <div className="card-icon blue"><i className="fa-solid fa-cart-plus"></i></div>
          <div className="card-info"><h2>{compras.length}</h2><p>Compras Totales</p></div>
        </div>
        <div className="card">
          <div className="card-icon green"><i className="fa-solid fa-dollar-sign"></i></div>
          <div className="card-info"><h2>${totalGastado.toFixed(2)}</h2><p>Total Gastado</p></div>
        </div>
        <div className="card">
          <div className="card-icon orange"><i className="fa-solid fa-truck"></i></div>
          <div className="card-info"><h2>{proveedores.length}</h2><p>Proveedores</p></div>
        </div>
        <div className="card">
          <div className="card-icon red"><i className="fa-solid fa-clock"></i></div>
          <div className="card-info"><h2>{compras.length}</h2><p>Registradas</p></div>
        </div>
      </section>

      <section className="table-section">
        <div className="table-header">
          <h2>Últimas Compras</h2>
          <button onClick={openNuevo}><i className="fa-solid fa-plus"></i> Nueva Compra</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Proveedor</th>
              <th>Total</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="loading-cell">Cargando...</td></tr>
            ) : compras.length === 0 ? (
              <tr><td colSpan={4} className="loading-cell">No hay compras registradas</td></tr>
            ) : compras.map(c => (
              <tr key={c.id}>
                <td>#{c.id}</td>
                <td>{c.proveedorNombre}</td>
                <td>${c.total.toFixed(2)}</td>
                <td>{new Date(c.fecha).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <Modal open={modalOpen} title="Nueva Compra" onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Proveedor</label>
            <select required value={proveedorId} onChange={e => setProveedorId(e.target.value)}>
              <option value="">Seleccionar...</option>
              {proveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
          </div>
          <h4 style={{ margin: '15px 0 10px', color: '#374151' }}>Detalles de Compra</h4>
          {detalles.map((d, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-end', marginBottom: 12 }}>
              <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                <label>Producto</label>
                <select required value={d.productoId} onChange={e => cambiarDetalle(i, 'productoId', e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ width: 80, marginBottom: 0 }}>
                <label>Cant.</label>
                <input type="number" min="1" required value={d.cantidad} onChange={e => cambiarDetalle(i, 'cantidad', e.target.value)} />
              </div>
              <div className="form-group" style={{ width: 110, marginBottom: 0 }}>
                <label>P/U ($)</label>
                <input type="number" step="0.01" min="0.01" required value={d.precio} onChange={e => cambiarDetalle(i, 'precio', e.target.value)} />
              </div>
              <button type="button" className="btn-icon delete" onClick={() => quitarDetalle(i)}>
                <i className="fa-solid fa-minus-circle"></i>
              </button>
            </div>
          ))}
          <button type="button" onClick={agregarDetalle} style={{ background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', fontWeight: 500, marginBottom: 15 }}>
            <i className="fa-solid fa-plus"></i> Agregar producto
          </button>
          <p style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 15 }}>
            Total: ${calcularTotal().toFixed(2)}
          </p>
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => setModalOpen(false)}>Cancelar</button>
            <button type="submit" className="btn-submit" disabled={submitting}>
              {submitting ? 'Registrando...' : 'Registrar Compra'}
            </button>
          </div>
        </form>
      </Modal>
    </main>
  );
};
