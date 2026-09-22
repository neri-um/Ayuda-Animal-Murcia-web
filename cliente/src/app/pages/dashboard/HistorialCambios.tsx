import { useState, useEffect, useCallback } from 'react';
import { History, Loader2, Search, RefreshCw, User, Inbox } from 'lucide-react';
import { useAuth } from '../../context/AppContext';
import { API_BASE as BASE, leerMensajeError } from '../../services/api';

interface RegistroAuditoria {
  id: number;
  usuarioId?: number;
  usuarioLogin?: string;
  usuarioNombre?: string;
  seccion?: string;
  accion?: string;
  entidadId?: string;
  detalle?: string;
  fecha?: string;
}

const SECCIONES = ['Animales', 'Almacén', 'Configuración', 'Adopciones', 'Acogidas', 'Blog', 'Usuarios', 'Formularios', 'Otros'];

function formatFecha(fecha?: string): string {
  if (!fecha) return '—';
  const d = new Date(fecha);
  if (isNaN(d.getTime())) return fecha;
  return d.toLocaleString('es-ES', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

const ACTION_STYLES: Record<string, { bg: string; color: string }> = {
  'Crear': { bg: '#e7f4ea', color: '#1e7d3a' },
  'Editar': { bg: '#eaf1f6', color: '#2b6a9b' },
  'Cambiar estado': { bg: '#f5f2e3', color: '#8a6d1a' },
  'Eliminar': { bg: '#fbeaec', color: '#b23a48' },
  'Completar': { bg: '#e7f4ea', color: '#1e7d3a' },
  'Crear solicitud': { bg: '#eaf1f6', color: '#2b6a9b' },
};

export default function HistorialCambios() {
  const { token, canAccess } = useAuth();
  const [registros, setRegistros] = useState<RegistroAuditoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [seccion, setSeccion] = useState('');
  const [usuarioBusq, setUsuarioBusq] = useState('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');

  const cargar = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (seccion) params.set('seccion', seccion);
      if (usuarioBusq) params.set('usuarioId', usuarioBusq);
      if (desde) params.set('desde', `${desde}T00:00`);
      if (hasta) params.set('hasta', `${hasta}T00:00`);
      const qs = params.toString();
      const res = await fetch(`${BASE}/auditoria${qs ? `?${qs}` : ''}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw await leerMensajeError(res);
      const data = await res.json();
      setRegistros(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.message ?? 'No se pudo cargar el historial.');
    } finally {
      setLoading(false);
    }
  }, [token, seccion, usuarioBusq, desde, hasta]);

  useEffect(() => { cargar(); }, [cargar]);

  if (!canAccess('ADMIN')) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <Inbox className="w-10 h-10 mb-3" />
        <p className="text-sm">No tienes permisos para ver esta sección.</p>
      </div>
    );
  }

  const registrosFiltrados = registros.filter(r => {
    if (!busqueda) return true;
    const q = busqueda.toLowerCase();
    return (
      (r.usuarioNombre ?? '').toLowerCase().includes(q) ||
      (r.usuarioLogin ?? '').toLowerCase().includes(q) ||
      (r.seccion ?? '').toLowerCase().includes(q) ||
      (r.accion ?? '').toLowerCase().includes(q) ||
      (r.detalle ?? '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Historial de cambios</h1>
          <p className="text-sm text-gray-500 mt-0.5">Registro de quién hizo qué en cada sección</p>
        </div>
        <button
          onClick={cargar}
          className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors"
          title="Recargar"
        >
          <RefreshCw className={`w-4 h-4`} />
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por usuario, sección, acción..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none"
          />
        </div>
        <select
          value={seccion}
          onChange={e => setSeccion(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none"
        >
          <option value="">Todas las secciones</option>
          {SECCIONES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input
          type="text"
          value={usuarioBusq}
          onChange={e => setUsuarioBusq(e.target.value)}
          placeholder="ID de usuario"
          className="w-32 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none"
        />
        <input
          type="date"
          value={desde}
          onChange={e => setDesde(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none"
          title="Desde"
        />
        <input
          type="date"
          value={hasta}
          onChange={e => setHasta(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none"
          title="Hasta"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400 gap-3">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Cargando historial...</span>
        </div>
      ) : registrosFiltrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <History className="w-10 h-10 text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm">No hay cambios registrados.</p>
          <p className="text-gray-400 text-xs mt-1">Las acciones de los usuarios quedarán registradas aquí a partir de ahora.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100">
                  <th className="text-left font-medium py-3 pl-6 pr-4">Fecha</th>
                  <th className="text-left font-medium py-3 px-4">Usuario</th>
                  <th className="text-left font-medium py-3 px-4">Sección</th>
                  <th className="text-left font-medium py-3 px-4">Acción</th>
                  <th className="text-left font-medium py-3 px-4">Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {registrosFiltrados.map(r => {
                  const estilo = ACTION_STYLES[r.accion ?? ''] ?? { bg: '#f3f4f6', color: '#374151' };
                  return (
                    <tr key={r.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3 pl-6 pr-4 whitespace-nowrap text-gray-500 text-xs">{formatFecha(r.fecha)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] flex-shrink-0"
                            style={{ backgroundColor: '#f7e3b0', color: '#2e2e2e', fontWeight: 600 }}
                          >
                            {(r.usuarioNombre?.[0] ?? '?').toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-800 truncate">{r.usuarioNombre || '—'}</p>
                            {r.usuarioLogin && <p className="text-[11px] text-gray-400">@{r.usuarioLogin}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{ backgroundColor: '#eef2f5', color: '#40586f' }}>
                          {r.seccion || '—'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{ backgroundColor: estilo.bg, color: estilo.color }}>
                          {r.accion || '—'}
                        </span>
                      </td>
                      <td className="py-3 px-4 pr-6">
                        <code className="text-xs text-gray-600">{r.detalle || '—'}</code>
                        {r.entidadId && <span className="ml-2 text-[11px] text-gray-400">#{r.entidadId}</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}