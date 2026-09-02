import { useState, useEffect, useCallback } from 'react';
import {
  Home, PawPrint, Loader2, Search, ChevronDown, ChevronUp, MessageCircle,
  Trash2, CheckCircle, XCircle, ClipboardList, Users, RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../context/AppContext';
import { formatEnum } from '../../services/enums';
import type { Acogida, SolicitudAcogida, EstadoAcogida } from '../../types/acogida';
import {
  listarAcogidas, cambiarEstadoAcogida, eliminarAcogida,
  listarSolicitudesAcogida, cambiarEstadoSolicitud, eliminarSolicitudAcogida,
} from '../../services/acogidas';

const ESTADOS_ACOGIDA: EstadoAcogida[] = ['ACTIVA', 'DISPONIBLE', 'NO_DISPONIBLE', 'PENDIENTE'];
const ESTADO_COLORS: Record<string, string> = {
  ACTIVA: 'bg-green-100 text-green-700',
  DISPONIBLE: 'bg-blue-100 text-blue-700',
  NO_DISPONIBLE: 'bg-gray-100 text-gray-600',
  PENDIENTE: 'bg-amber-100 text-amber-700',
};

export default function AcogidaManagement() {
  const { token } = useAuth();
  const [tab, setTab] = useState<'acogidas' | 'solicitudes'>('acogidas');
  const [acogidas, setAcogidas] = useState<Acogida[]>([]);
  const [solicitudes, setSolicitudes] = useState<SolicitudAcogida[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroEspecie, setFiltroEspecie] = useState<'TODAS' | 'PERRO' | 'GATO'>('TODAS');
  const [filtroEstado, setFiltroEstado] = useState<EstadoAcogida | 'TODOS'>('TODOS');
  const [busqueda, setBusqueda] = useState('');
  const [expandida, setExpandida] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [acogs, sols] = await Promise.all([
        listarAcogidas(token),
        listarSolicitudesAcogida(token),
      ]);
      setAcogidas(acogs);
      setSolicitudes(sols);
    } catch (e: any) {
      setError(e?.message ?? 'No se pudieron cargar los datos.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { cargar(); }, [cargar]);

  const cambiarEstado = async (id: number, estado: EstadoAcogida) => {
    if (!token) return;
    try {
      await cambiarEstadoAcogida(token, id, estado);
      await cargar();
    } catch (e: any) {
      setError(e?.message ?? 'No se pudo actualizar el estado.');
    }
  };

  const borrarAcogida = async (id: number) => {
    if (!token) return;
    if (!window.confirm('¿Eliminar esta acogida y su solicitud?')) return;
    try {
      await eliminarAcogida(token, id);
      await cargar();
    } catch (e: any) {
      setError(e?.message ?? 'No se pudo eliminar.');
    }
  };

  const cambiarEstadoSol = async (id: number, estado: 'ACEPTADA' | 'RECHAZADA') => {
    if (!token) return;
    try {
      await cambiarEstadoSolicitud(token, id, estado);
      await cargar();
    } catch (e: any) {
      setError(e?.message ?? 'No se pudo actualizar la solicitud.');
    }
  };

  const borrarSolicitud = async (id: number) => {
    if (!token) return;
    if (!window.confirm('¿Eliminar esta solicitud?')) return;
    try {
      await eliminarSolicitudAcogida(token, id);
      await cargar();
    } catch (e: any) {
      setError(e?.message ?? 'No se pudo eliminar.');
    }
  };

  const waLink = (telefono: string) => {
    const t = telefono?.replace(/\D/g, '');
    return t ? `https://wa.me/${t}` : '#';
  };

  const acogidasFiltrados = acogidas.filter(a => {
    const coincideEspecie = filtroEspecie === 'TODAS' || a.especie === filtroEspecie;
    const coincideEstado = filtroEstado === 'TODOS' || a.estado === filtroEstado;
    const nombreBusq = `${a.nombre} ${a.apellidos ?? ''}`.toLowerCase();
    const coincideBusqueda = busqueda === '' || nombreBusq.includes(busqueda.toLowerCase());
    return coincideEspecie && coincideEstado && coincideBusqueda;
  });

  const contadoresEspecie = {
    TODAS: acogidas.length,
    PERRO: acogidas.filter(a => a.especie === 'PERRO').length,
    GATO: acogidas.filter(a => a.especie === 'GATO').length,
  };

  const contadoresEstado: Record<string, number> = {
    TODOS: acogidas.length,
    ...ESTADOS_ACOGIDA.reduce((acc, e) => ({ ...acc, [e]: acogidas.filter(a => a.estado === e).length }), {}),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-400 gap-3">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Cargando acogidas...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Casas de acogida</h1>
          <p className="text-sm text-gray-500 mt-0.5">acogidas disponibles y solicitudes pendientes</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Home className="w-4 h-4" />
          <span>{contadoresEstado['PENDIENTE'] ?? 0} pendiente{(contadoresEstado['PENDIENTE'] ?? 0) !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setTab('acogidas')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
            tab === 'acogidas' ? 'text-white border-transparent' : 'bg-white text-gray-500 border-gray-200'
          }`}
          style={tab === 'acogidas' ? { backgroundColor: '#547792' } : {}}
        >
          <span className="inline-flex items-center gap-1.5"><Users className="w-4 h-4" /> acogidas</span>
        </button>
        <button
          onClick={() => setTab('solicitudes')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
            tab === 'solicitudes' ? 'text-white border-transparent' : 'bg-white text-gray-500 border-gray-200'
          }`}
          style={tab === 'solicitudes' ? { backgroundColor: '#547792' } : {}}
        >
          <span className="inline-flex items-center gap-1.5"><ClipboardList className="w-4 h-4" /> Solicitudes</span>
        </button>
      </div>

      {error && (
        <div className="flex items-center justify-between bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-xs underline">cerrar</button>
        </div>
      )}

      {tab === 'acogidas' ? (
        <>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar acogida por nombre..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none"
              />
            </div>
            <div className="flex gap-2 flex-wrap items-center">
              <button
                onClick={() => setFiltroEspecie('TODAS')}
                className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                  filtroEspecie === 'TODAS' ? 'text-white border-transparent' : 'bg-white text-gray-500 border-gray-200'
                }`}
                style={filtroEspecie === 'TODAS' ? { backgroundColor: '#547792' } : {}}
              >
                Todas ({contadoresEspecie.TODAS})
              </button>
              <button
                onClick={() => setFiltroEspecie('PERRO')}
                className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                  filtroEspecie === 'PERRO' ? 'text-white border-transparent' : 'bg-white text-gray-500 border-gray-200'
                }`}
                style={filtroEspecie === 'PERRO' ? { backgroundColor: '#547792' } : {}}
              >
                Perros ({contadoresEspecie.PERRO})
              </button>
              <button
                onClick={() => setFiltroEspecie('GATO')}
                className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                  filtroEspecie === 'GATO' ? 'text-white border-transparent' : 'bg-white text-gray-500 border-gray-200'
                }`}
                style={filtroEspecie === 'GATO' ? { backgroundColor: '#547792' } : {}}
              >
                Gatos ({contadoresEspecie.GATO})
              </button>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {(['TODOS', ...ESTADOS_ACOGIDA] as const).map(estado => (
              <button
                key={estado}
                onClick={() => setFiltroEstado(estado as EstadoAcogida | 'TODOS')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  filtroEstado === estado ? 'text-white border-transparent' : 'bg-white text-gray-500 border-gray-200'
                }`}
                style={filtroEstado === estado ? { backgroundColor: '#547792' } : {}}
              >
                {estado === 'TODOS' ? 'Todos' : formatEnum(estado)} ({contadoresEstado[estado] ?? 0})
              </button>
            ))}
          </div>

          {acogidasFiltrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Home className="w-10 h-10 text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">No hay acogidas con esos filtros.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {acogidasFiltrados.map(a => (
                <div key={a.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                  <button
                    onClick={() => setExpandida(expandida === a.id ? null : a.id)}
                    className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-gray-50/60 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-gray-900 text-sm">{a.nombre}{a.apellidos ? ` ${a.apellidos}` : ''}</span>
                        {a.especie && (
                          <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                            <PawPrint className="w-3.5 h-3.5" /> {formatEnum(a.especie)}
                          </span>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ESTADO_COLORS[a.estado] ?? ''}`}>
                          {formatEnum(a.estado)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate">{a.email || '—'}</p>
                    </div>
                    {expandida === a.id
                      ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                  </button>

                  <div className="px-5 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2.5">
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-gray-400">Teléfono</p>
                      <p className="text-sm text-gray-800 font-medium truncate">{a.telefono || '—'}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-gray-400">Dirección</p>
                      <p className="text-sm text-gray-800 font-medium truncate">{a.direccion || '—'}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-gray-400">Estado</p>
                      <select
                        value={a.estado}
                        onChange={e => cambiarEstado(a.id, e.target.value as EstadoAcogida)}
                        className="text-sm text-gray-800 font-medium border border-gray-200 rounded-lg px-2 py-1"
                      >
                        {ESTADOS_ACOGIDA.map(e => (
                          <option key={e} value={e}>{formatEnum(e)}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {expandida === a.id && a.respuestas && (
                    <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/40">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                        {Object.entries(a.respuestas).map(([k, v]) => (
                          <div key={k}>
                            <p className="text-[11px] uppercase tracking-wide text-gray-400">{k}</p>
                            <p className="text-sm text-gray-700">{v || '—'}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 px-4 py-3 mt-3 border-t border-gray-100">
                    <a
                      href={waLink(a.telefono)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </a>
                    <div className="flex-1" />
                    <button
                      onClick={() => borrarAcogida(a.id)}
                      className="p-2 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Solicitudes de cuestionario de acogida recibidas.</p>
            <button
              onClick={cargar}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-500 bg-white border border-gray-200 hover:bg-gray-50"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Recargar
            </button>
          </div>

          {solicitudes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ClipboardList className="w-10 h-10 text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">No hay solicitudes de acogida.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {solicitudes.map(s => (
                <div key={s.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                  <button
                    onClick={() => setExpandida(expandida === s.id ? null : s.id)}
                    className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-gray-50/60 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-gray-900 text-sm">{s.nombreAcogida}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.estado === 'PENDIENTE' ? 'bg-amber-100 text-amber-700' : s.estado === 'ACEPTADA' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                          {formatEnum(s.estado)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate">{s.email}</p>
                    </div>
                    {expandida === s.id
                      ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                  </button>

                  <div className="px-5 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2.5">
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-gray-400">Teléfono</p>
                      <p className="text-sm text-gray-800 font-medium truncate">{s.telefono || '—'}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-gray-400">DNI</p>
                      <p className="text-sm text-gray-800 font-medium truncate">{s.dni || '—'}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-gray-400">Animal</p>
                      <p className="text-sm text-gray-800 font-medium truncate">{s.animalNombre || '—'}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-gray-400">Fecha</p>
                      <p className="text-sm text-gray-800 font-medium truncate">
                        {s.fechaSolicitud ? new Date(s.fechaSolicitud).toLocaleDateString('es-ES') : '—'}
                      </p>
                    </div>
                  </div>

                  {expandida === s.id && s.respuestas && (
                    <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/40">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                        {Object.entries(s.respuestas).map(([k, v]) => (
                          <div key={k}>
                            <p className="text-[11px] uppercase tracking-wide text-gray-400">{k}</p>
                            <p className="text-sm text-gray-700">{v || '—'}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 px-4 py-3 mt-3 border-t border-gray-100">
                    {s.estado === 'PENDIENTE' ? (
                      <>
                        <button
                          onClick={() => cambiarEstadoSol(s.id, 'ACEPTADA')}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" /> Aceptar
                        </button>
                        <button
                          onClick={() => cambiarEstadoSol(s.id, 'RECHAZADA')}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                        >
                          <XCircle className="w-4 h-4" /> Rechazar
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-gray-400">{formatEnum(s.estado)}</span>
                    )}
                    <a
                      href={waLink(s.telefono)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" /> WhatsApp
                    </a>
                    <div className="flex-1" />
                    <button
                      onClick={() => borrarSolicitud(s.id)}
                      className="p-2 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
