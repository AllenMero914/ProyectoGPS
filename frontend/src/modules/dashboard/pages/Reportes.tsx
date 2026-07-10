import React, { useEffect, useState, useMemo } from 'react';
import { Topbar } from '../components/Topbar';
import { api } from '../../../core/api/api';
import type { DashboardMetricas, VentaDTO, CompraDTO } from '../../../core/api/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, getWeek, getYear, getMonth, startOfWeek, endOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';

type FiltroTiempo = 'SEMANAL' | 'MENSUAL' | 'ANUAL';

export const Reportes: React.FC = () => {
  const [metricas, setMetricas] = useState<DashboardMetricas | null>(null);
  const [ventas, setVentas] = useState<VentaDTO[]>([]);
  const [compras, setCompras] = useState<CompraDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<FiltroTiempo>('MENSUAL');

  const load = async () => {
    try {
      const [m, v, c] = await Promise.all([
        api.get<DashboardMetricas>('/dashboard/metricas'),
        api.get<VentaDTO[]>('/ventas'),
        api.get<CompraDTO[]>('/compras'),
      ]);
      setMetricas(m);
      setVentas(v);
      setCompras(c);
    } catch (error) {
      console.error('Error cargando reportes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const dataGrafica = useMemo(() => {
    const grouped = new Map<string, { label: string, Ingresos: number, Gastos: number, orden: number }>();

    const agregarDato = (fechaStr: string, monto: number, tipo: 'ingreso' | 'gasto') => {
      if (!fechaStr) return;
      const d = new Date(fechaStr);
      let key = '';
      let label = '';
      let orden = 0;

      if (filtro === 'SEMANAL') {
        const year = getYear(d);
        const week = getWeek(d);
        key = `${year}-W${week}`;
        const inicio = startOfWeek(d, { weekStartsOn: 1 });
        const fin = endOfWeek(d, { weekStartsOn: 1 });
        label = `${format(inicio, 'dd MMM', { locale: es })} - ${format(fin, 'dd MMM', { locale: es })}`;
        orden = d.getTime(); 
      } else if (filtro === 'MENSUAL') {
        const year = getYear(d);
        const month = getMonth(d);
        key = `${year}-${month}`;
        label = format(d, 'MMM yyyy', { locale: es });
        label = label.charAt(0).toUpperCase() + label.slice(1);
        orden = year * 100 + month;
      } else {
        const year = getYear(d);
        key = `${year}`;
        label = `${year}`;
        orden = year;
      }

      if (!grouped.has(key)) {
        grouped.set(key, { label, Ingresos: 0, Gastos: 0, orden });
      }
      const item = grouped.get(key)!;
      if (tipo === 'ingreso') item.Ingresos += monto;
      else item.Gastos += monto;
    };

    ventas.forEach(v => agregarDato(v.fecha, v.total, 'ingreso'));
    compras.forEach(c => agregarDato(c.fecha, c.total, 'gasto'));

    return Array.from(grouped.values()).sort((a, b) => a.orden - b.orden);
  }, [ventas, compras, filtro]);

  const totalIngresos = dataGrafica.reduce((sum, item) => sum + item.Ingresos, 0);
  const totalGastos = dataGrafica.reduce((sum, item) => sum + item.Gastos, 0);
  const beneficioNeto = totalIngresos - totalGastos;
  const isBeneficioPositivo = beneficioNeto >= 0;

  return (
    <main className="main-content">
      <Topbar title="Panel de Reportes" subtitle="Visualiza estadísticas y rendimiento del negocio" searchPlaceholder="Buscar reporte..." />

      <section className="cards">
        <div className="card">
          <div className="card-icon blue"><i className="fa-solid fa-arrow-trend-up"></i></div>
          <div className="card-info"><h2>${totalIngresos.toFixed(2)}</h2><p>Ingresos Totales</p></div>
        </div>
        <div className="card">
          <div className="card-icon red"><i className="fa-solid fa-arrow-trend-down"></i></div>
          <div className="card-info"><h2>${totalGastos.toFixed(2)}</h2><p>Gastos Totales</p></div>
        </div>
        <div className="card">
          <div className={`card-icon ${isBeneficioPositivo ? 'green' : 'orange'}`}>
            <i className={`fa-solid fa-${isBeneficioPositivo ? 'money-bill-trend-up' : 'money-bill-transfer'}`}></i>
          </div>
          <div className="card-info">
            <h2 style={{ color: isBeneficioPositivo ? '#10b981' : '#f59e0b' }}>${beneficioNeto.toFixed(2)}</h2>
            <p>Beneficio Neto</p>
          </div>
        </div>
        <div className="card">
          <div className="card-icon orange"><i className="fa-solid fa-users"></i></div>
          <div className="card-info"><h2>{metricas?.productosStockBajo ?? 0}</h2><p>Stock Bajo</p></div>
        </div>
      </section>

      <section className="content-grid" style={{ gridTemplateColumns: '1fr', gap: '20px' }}>
        <div className="table-section" style={{ overflow: 'hidden' }}>
          <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Desglose Financiero</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => setFiltro('SEMANAL')} 
                style={{ background: filtro === 'SEMANAL' ? '#4f46e5' : '#f3f4f6', color: filtro === 'SEMANAL' ? '#fff' : '#374151', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
              >Semanal</button>
              <button 
                onClick={() => setFiltro('MENSUAL')} 
                style={{ background: filtro === 'MENSUAL' ? '#4f46e5' : '#f3f4f6', color: filtro === 'MENSUAL' ? '#fff' : '#374151', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
              >Mensual</button>
              <button 
                onClick={() => setFiltro('ANUAL')} 
                style={{ background: filtro === 'ANUAL' ? '#4f46e5' : '#f3f4f6', color: filtro === 'ANUAL' ? '#fff' : '#374151', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
              >Anual</button>
            </div>
          </div>
          
          <div style={{ width: '100%', height: '400px', padding: '20px' }}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>Cargando datos...</div>
            ) : dataGrafica.length === 0 ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>No hay datos registrados.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dataGrafica}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} formatter={(value: number) => `$${value.toFixed(2)}`} />
                  <Legend />
                  <Bar dataKey="Ingresos" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Gastos" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="activity-section" style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ marginBottom: '10px' }}>Exportar Datos</h2>
            <p style={{ color: '#6b7280' }}>Descarga los datos actuales mostrados en la gráfica en formato CSV.</p>
          </div>
          <button
            onClick={() => {
              const csv = 'Periodo,Ingresos,Gastos,Beneficio\n' + 
                dataGrafica.map(r => `${r.label},${r.Ingresos.toFixed(2)},${r.Gastos.toFixed(2)},${(r.Ingresos - r.Gastos).toFixed(2)}`).join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url; 
              a.download = `reporte_financiero_${filtro.toLowerCase()}.csv`;
              a.click(); 
              URL.revokeObjectURL(url);
            }}
            style={{ background: '#111827', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', cursor: 'pointer', fontWeight: 500 }}
            disabled={loading || dataGrafica.length === 0}
          >
            <i className="fa-solid fa-download"></i> Exportar CSV Actual
          </button>
        </div>
      </section>
    </main>
  );
};
