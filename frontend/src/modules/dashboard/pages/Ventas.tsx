import React, { useEffect, useState } from 'react';
import { Topbar } from '../components/Topbar';
import { Modal } from '../../../core/components/Modal';
import { api } from '../../../core/api/api';
import type { VentaDTO, ProductoDTO, ClienteDTO } from '../../../core/api/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const Ventas: React.FC = () => {
  const [ventas, setVentas] = useState<VentaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [productos, setProductos] = useState<ProductoDTO[]>([]);
  const [clientes, setClientes] = useState<ClienteDTO[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');
  const [detalles, setDetalles] = useState<{ productoId: string; cantidad: string }[]>([
    { productoId: '', cantidad: '1' },
  ]);
  const [submitting, setSubmitting] = useState(false);

  const [nuevoClienteModal, setNuevoClienteModal] = useState(false);
  const [formCliente, setFormCliente] = useState({ nombre: '', identificacion: '', email: '', telefono: '' });
  const [submittingCliente, setSubmittingCliente] = useState(false);

  const load = async () => {
    try {
      const [v, p, c] = await Promise.all([
        api.get<VentaDTO[]>('/ventas'),
        api.get<ProductoDTO[]>('/productos'),
        api.get<ClienteDTO[]>('/clientes'),
      ]);
      setVentas(v);
      setProductos(p.filter(pr => pr.activo && pr.stock > 0));
      setClientes(c);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openNuevo = () => {
    setClienteSeleccionado('');
    setDetalles([{ productoId: '', cantidad: '1' }]);
    setModalOpen(true);
  };

  const cambiarDetalle = (i: number, field: 'productoId' | 'cantidad', value: string) => {
    const copy = [...detalles];
    copy[i] = { ...copy[i], [field]: value };
    setDetalles(copy);
  };

  const agregarDetalle = () => {
    setDetalles([...detalles, { productoId: '', cantidad: '1' }]);
  };

  const quitarDetalle = (i: number) => {
    if (detalles.length > 1) setDetalles(detalles.filter((_, idx) => idx !== i));
  };

  const calcularTotal = () => {
    return detalles.reduce((sum, d) => {
      const p = productos.find(pr => pr.id === parseInt(d.productoId));
      return sum + (p ? p.precio * parseInt(d.cantidad || '0') : 0);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/ventas', {
        clienteId: parseInt(clienteSeleccionado),
        detalles: detalles.map(d => ({
          productoId: parseInt(d.productoId),
          cantidad: parseInt(d.cantidad),
        })),
      });
      setModalOpen(false);
      await load();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error al registrar venta');
    } finally {
      setSubmitting(false);
    }
  };

  const crearCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingCliente(true);
    try {
      await api.post('/clientes', { ...formCliente, activo: true });
      setNuevoClienteModal(false);
      setFormCliente({ nombre: '', identificacion: '', email: '', telefono: '' });
      await load();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error al crear cliente');
    } finally {
      setSubmittingCliente(false);
    }
  };

  const generarFactura = (venta: VentaDTO) => {
    const doc = new jsPDF();
    doc.text(`Nota de Entrega #${venta.id}`, 14, 20);
    doc.setFontSize(11);
    doc.text(`Fecha: ${new Date(venta.fecha).toLocaleString()}`, 14, 30);
    doc.text(`Cliente: ${venta.clienteNombre || 'Consumidor Final'}`, 14, 36);
    doc.text(`CI/RUC: ${venta.clienteIdentificacion || '9999999999'}`, 14, 42);
    doc.text(`Vendedor: ${venta.vendedor}`, 14, 48);

    const tableData = venta.detalles.map(d => [
      d.productoNombre,
      d.cantidad.toString(),
      `$${d.precioUnitario.toFixed(2)}`,
      `$${d.subtotal.toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: 55,
      head: [['Producto', 'Cantidad', 'P.Unit', 'Subtotal']],
      body: tableData,
    });

    // @ts-ignore
    const finalY = doc.lastAutoTable.finalY || 55;
    doc.setFontSize(14);
    doc.text(`Total: $${venta.total.toFixed(2)}`, 14, finalY + 10);
    
    doc.save(`factura_${venta.id}.pdf`);
  };

  const ingresos = ventas.reduce((s, v) => s + v.total, 0);
  const totalVentas = ventas.length;

  return (
    <main className="main-content">
      <Topbar title="Gestión de Ventas" subtitle="Controla todas las ventas y facturación del negocio" searchPlaceholder="Buscar venta..." />

      <section className="cards">
        <div className="card">
          <div className="card-icon blue"><i className="fa-solid fa-dollar-sign"></i></div>
          <div className="card-info"><h2>${ingresos.toFixed(2)}</h2><p>Ingresos Totales</p></div>
        </div>
        <div className="card">
          <div className="card-icon green"><i className="fa-solid fa-receipt"></i></div>
          <div className="card-info"><h2>{totalVentas}</h2><p>Ventas Realizadas</p></div>
        </div>
        <div className="card">
          <div className="card-icon orange"><i className="fa-solid fa-users"></i></div>
          <div className="card-info"><h2>{new Set(ventas.map(v => v.vendedor)).size}</h2><p>Vendedores</p></div>
        </div>
        <div className="card">
          <div className="card-icon red"><i className="fa-solid fa-chart-line"></i></div>
          <div className="card-info"><h2>{ventas.filter(v => v.total > 100).length}</h2><p>Ventas &gt; $100</p></div>
        </div>
      </section>

      <section className="table-section">
        <div className="table-header">
          <h2>Registro de Ventas</h2>
          <button onClick={openNuevo}><i className="fa-solid fa-plus"></i> Nueva Venta</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Vendedor</th>
              <th>Cliente</th>
              <th>Productos</th>
              <th>Total</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="loading-cell">Cargando...</td></tr>
            ) : ventas.length === 0 ? (
              <tr><td colSpan={5} className="loading-cell">No hay ventas registradas</td></tr>
            ) : ventas.map(v => (
              <tr key={v.id}>
                <td>#{v.id}</td>
                <td>{v.vendedor}</td>
                <td>{v.clienteNombre || 'N/A'}</td>
                <td>{v.detalles?.map(d => `${d.productoNombre} x${d.cantidad}`).join(', ')}</td>
                <td>${v.total.toFixed(2)}</td>
                <td>{new Date(v.fecha).toLocaleString()}</td>
                <td>
                  <button className="btn-icon blue" onClick={() => generarFactura(v)} title="Descargar PDF">
                    <i className="fa-solid fa-file-pdf"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <Modal open={modalOpen} title="Nueva Venta" onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label style={{ display: 'flex', justifyContent: 'space-between' }}>
              Cliente
              <button type="button" onClick={() => setNuevoClienteModal(true)} style={{ background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', fontSize: '0.85em', fontWeight: 'bold' }}>
                + Nuevo Cliente
              </button>
            </label>
            <select required value={clienteSeleccionado} onChange={e => setClienteSeleccionado(e.target.value)}>
              <option value="">Seleccione un cliente...</option>
              {clientes.map(c => (
                <option key={c.id} value={c.id}>{c.nombre} ({c.identificacion})</option>
              ))}
            </select>
          </div>
          {detalles.map((d, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-end', marginBottom: 12 }}>
              <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                <label>Producto</label>
                <select required value={d.productoId} onChange={e => cambiarDetalle(i, 'productoId', e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {productos.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre} (${p.precio.toFixed(2)} · stock: {p.stock})</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ width: 100, marginBottom: 0 }}>
                <label>Cant.</label>
                <input type="number" min="1" required value={d.cantidad} onChange={e => cambiarDetalle(i, 'cantidad', e.target.value)} />
              </div>
              <button type="button" className="btn-icon delete" onClick={() => quitarDetalle(i)} style={{ marginBottom: 0 }}>
                <i className="fa-solid fa-minus-circle"></i>
              </button>
            </div>
          ))}
          <button type="button" onClick={agregarDetalle} style={{ background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', fontWeight: 500, marginBottom: 15 }}>
            <i className="fa-solid fa-plus"></i> Agregar producto
          </button>
          <p style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 15 }}>
            Total estimado: ${calcularTotal().toFixed(2)}
          </p>
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => setModalOpen(false)}>Cancelar</button>
            <button type="submit" className="btn-submit" disabled={submitting}>
              {submitting ? 'Registrando...' : 'Registrar Venta'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={nuevoClienteModal} title="Nuevo Cliente" onClose={() => setNuevoClienteModal(false)}>
        <form onSubmit={crearCliente}>
          <div className="form-group">
            <label>Nombre Completo</label>
            <input required value={formCliente.nombre} onChange={e => setFormCliente({ ...formCliente, nombre: e.target.value })} autoFocus />
          </div>
          <div className="form-group">
            <label>Identificación (Cédula/RUC)</label>
            <input required value={formCliente.identificacion} onChange={e => setFormCliente({ ...formCliente, identificacion: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={formCliente.email} onChange={e => setFormCliente({ ...formCliente, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Teléfono</label>
            <input value={formCliente.telefono} onChange={e => setFormCliente({ ...formCliente, telefono: e.target.value })} />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => setNuevoClienteModal(false)}>Cancelar</button>
            <button type="submit" className="btn-submit" disabled={submittingCliente}>
              {submittingCliente ? 'Guardando...' : 'Crear Cliente'}
            </button>
          </div>
        </form>
      </Modal>
    </main>
  );
};
