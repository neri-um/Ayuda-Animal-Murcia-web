import { useState, useEffect, useCallback, type ReactNode } from 'react';
import {
  Loader2, Search, ChevronDown, ChevronUp, CheckCircle, XCircle, MessageCircle,
  Trash2, RefreshCw, ClipboardList, Info, Award, Heart, GraduationCap,
} from 'lucide-react';
import { useAuth } from '../../context/AppContext';
import {
  listarSolicitudesColaboracion, decidirSolicitudColaboracion, actualizarCrauSolicitud,
  eliminarSolicitudColaboracion, type SolicitudColaboracion,
} from '../../services/colaboracion';
import CrauNota, { crauTotal } from '../../components/colaborar/CrauInfo';
import CrauTracker from '../../components/colaborar/CrauTracker';

type EstadoSolicitud = 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA';

const SECCIONES: { key: EstadoSolicitud; label: string; border: string; dot: string }[] = [
  { key: 'PENDIENTE', label: 'Pendientes', border: 'border-l-[#D4AF37]', dot: 'bg-[#D4AF37]' },
  { key: 'ACEPTADA',  label: 'Aceptadas',  border: 'border-l-[#6A994E]', dot: 'bg-[#6A994E]' },
  { key: 'RECHAZADA', label: 'Rechazadas', border: 'border-l-[#9C2B1B]', dot: 'bg-[#9C2B1B]' },
];

// Dos columnas por tipo: voluntariado/casa de acogida y voluntariado UMU.
const COLUMNAS: { key: 'NORMAL' | 'UMU'; label: string; icono: ReactNode; tipos: string[] }[] = [
  { key: 'NORMAL', label: 'Voluntariado', icono: <Heart className="w-5 h-5 text-gray-600" />, tipos: ['VOLUNTARIADO', 'ACOGIDA'] },
  { key: 'UMU', label: 'Voluntariado UMU', icono: <GraduationCap className="w-5 h-5 text-gray-600" />, tipos: ['VOLUNTARIADO_UMU'] },
];

const ROJO_UMU = '#BD2A33';

function formatFecha(iso: string | null): string {
  if (!iso) return '—';
  const fecha = new Date(iso.length <= 10 ? `${iso}T00:00:00` : iso);
  return Number.isNaN(fecha.getTime())
    ? '—'
    : fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function VoluntariadoSolicitudes() {
  const { token, canAccess } = useAuth();
  const esAdmin = canAccess('ADMIN');

  const [solicitudes, setSolicitudes] = useState<SolicitudColaboracion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [seccion, setSeccion] = useState<EstadoSolicitud | ''>('');
  const [expandida, setExpandida] = useState<number | null>(null);
  const [actualizando, setActualizando] = useState<number | null>(null);
  const [guardandoCrau, setGuardandoCrau] = useState<number | null>(null);
  const [eliminarId, setEliminarId] = useState<number | null>(null);
  const [seccionesColapsadas, setSeccionesColapsadas] = useState<Record<string, boolean>>({});
  const [mostrarReglas, setMostrarReglas] = useState(false);

  const cargar = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      setSolicitudes(await listarSolicitudesColaboracion(token));
      setError(null);
    } catch (e: any) {
      setError(e?.message ?? 'No se pudieron cargar las solicitudes.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { cargar(); }, [cargar]);

  const decidir = async (solicitud: SolicitudColaboracion, estado: 'ACEPTADA' | 'RECHAZADA') => {
    if (!token) return;
    if (estado === 'RECHAZADA' && !window.confirm('¿Rechazar esta solicitud?')) return;
    setActualizando(solicitud.id);
    try {
      const actualizada = await decidirSolicitudColaboracion(token, solicitud.id, estado, '');
      setSolicitudes(prev => prev.map(s => (s.id === actualizada.id ? actualizada : s)));
      setError(null);
    } catch (e: any) {
      setError(e?.message ?? 'No se pudo actualizar la solicitud.');
    } finally {
      setActualizando(null);
    }
  };

  const cambiarCrau = async (s: SolicitudColaboracion, nuevoDetalle: Record<string, number>) => {
    if (!token) return;
    setGuardandoCrau(s.id);
    try {
      const total = crauTotal(nuevoDetalle);
      const actualizada = await actualizarCrauSolicitud(token, s.id, total, nuevoDetalle);
      setSolicitudes(prev => prev.map(x => (x.id === actualizada.id ? actualizada : x)));
      setError(null);
    } catch (e: any) {
      setError(e?.message ?? 'No se pudieron actualizar los CRAU.');
    } finally {
      setGuardandoCrau(null);
    }
  };

  const confirmarEliminar = async () => {
    if (eliminarId === null || !token) return;
    setActualizando(eliminarId);
    try {
      await eliminarSolicitudColaboracion(token, eliminarId);
      setSolicitudes(prev => prev.filter(s => s.id !== eliminarId));
      setEliminarId(null);
    } catch (e: any) {
      setError(e?.message ?? 'No se pudo eliminar la solicitud.');
    } finally {
      setActualizando(null);
    }
  };

  const coincide = (s: SolicitudColaboracion) => {
    if (!busqueda) return true;
    const texto = busqueda.toLowerCase();
    return (s.nombre ?? '').toLowerCase().includes(texto) || s.email.toLowerCase().includes(texto);
  };

  const filtradas = solicitudes.filter(coincide);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-gray-900">Solicitudes de voluntariado</h1>
          <p className="text-sm text-gray-500 mt-1">
            Altas recibidas desde la web: voluntariado, voluntariado UMU y casas de acogida.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMostrarReglas(v => !v)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Info className="w-4 h-4" /> Reglas CRAU
          </button>
          <button
            onClick={cargar}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Actualizar
          </button>
        </div>
      </div>

      {mostrarReglas && <CrauNota />}

      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none"
          />
        </div>
        <select
          value={seccion}
          onChange={e => setSeccion(e.target.value as EstadoSolicitud | '')}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
        >
          <option value="">Todos los estados</option>
          {SECCIONES.map(g => (
            <option key={g.key} value={g.key}>{g.label}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-2xl px-4 py-3 text-sm bg-[#9C2B1B]/5 text-[#9C2B1B] border border-[#9C2B1B]/20">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-[#547792]" />
          <p className="text-sm">Cargando solicitudes...</p>
        </div>
      ) : filtradas.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 text-center py-16 text-gray-400">
          <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p>No hay solicitudes con estos filtros</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {COLUMNAS.map(col => {
            const itemsCol = filtradas.filter(s => col.tipos.includes(s.tipo));
            const seccionesConItems = SECCIONES.filter(sec =>
              (!seccion || sec.key === seccion) && itemsCol.some(s => s.estado === sec.key));

            return (
              <div key={col.key} className="space-y-4">
                <div className="flex items-center gap-2">
                  {col.icono}
                  <h2 className="text-lg font-semibold text-gray-900">{col.label}</h2>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{itemsCol.length}</span>
                </div>

                {seccionesConItems.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 text-center py-10 text-gray-400 text-sm">
                    No hay solicitudes
                  </div>
                ) : seccionesConItems.map(sec => {
                  const items = itemsCol.filter(s => s.estado === sec.key);
                  const clave = `${col.key}-${sec.key}`;
                  const colapsada = seccionesColapsadas[clave];
                  return (
                    <div key={sec.key} className={`rounded-xl border border-gray-100 border-l-4 ${sec.border} overflow-hidden bg-white shadow-sm`}>
                      <button
                        onClick={() => setSeccionesColapsadas(prev => ({ ...prev, [clave]: !prev[clave] }))}
                        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50/60 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${sec.dot}`} />
                          <span className="text-sm font-medium text-gray-800">{sec.label}</span>
                          <span className="text-xs text-gray-400">({items.length})</span>
                        </div>
                        {colapsada ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronUp className="w-4 h-4 text-gray-400" />}
                      </button>

                      {!colapsada && (
                        <div className="px-3 pb-3 space-y-2">
                          {items.map(s => {
                            const abierta = expandida === s.id;
                            const respuestas = Object.entries(s.respuestas ?? {});
                            const telefono = s.respuestas?.['Teléfono de contacto'] ?? '';

                            return (
                              <div key={s.id} className="bg-gray-50/60 rounded-xl border border-gray-100 overflow-hidden">
                                <button
                                  onClick={() => setExpandida(abierta ? null : s.id)}
                                  className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-gray-100/60 transition-colors"
                                >
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-gray-900 truncate">{s.nombre ?? 'Sin nombre'}</p>
                                    <p className="text-xs text-gray-500 truncate">{s.email}</p>
                                  </div>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    {col.key === 'UMU' && crauTotal(s.crauDetalle) > 0 && (
                                      <span
                                        className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full text-white whitespace-nowrap"
                                        style={{ backgroundColor: ROJO_UMU }}
                                        title="CRAU acumulados"
                                      >
                                        <Award className="w-3.5 h-3.5" /> {crauTotal(s.crauDetalle)} CRAU
                                      </span>
                                    )}
                                    {abierta
                                      ? <ChevronUp className="w-4 h-4 text-gray-400" />
                                      : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                  </div>
                                </button>

                                <div className="px-4 grid grid-cols-2 gap-x-4 gap-y-1.5">
                                  <div>
                                    <p className="text-[11px] uppercase tracking-wide text-gray-400">Teléfono</p>
                                    <p className="text-xs text-gray-800 font-medium truncate">{telefono || '—'}</p>
                                  </div>
                                  <div>
                                    <p className="text-[11px] uppercase tracking-wide text-gray-400">Fecha</p>
                                    <p className="text-xs text-gray-800 font-medium truncate">{formatFecha(s.fechaSolicitud)}</p>
                                  </div>
                                </div>

                                {abierta && (
                                  <div className="mt-3 px-4 py-3 border-t border-gray-100 bg-gray-50/40 space-y-3">
                                    {col.key === 'UMU' && (
                                      <CrauTracker
                                        detalle={s.crauDetalle ?? {}}
                                        guardando={guardandoCrau === s.id}
                                        onChange={nuevo => cambiarCrau(s, nuevo)}
                                      />
                                    )}
                                    {respuestas.length === 0 ? (
                                      <p className="text-xs text-gray-400">Sin respuestas registradas.</p>
                                    ) : (
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                                        {respuestas.map(([pregunta, respuesta]) => (
                                          <div key={pregunta} className="text-xs">
                                            <span className="block text-gray-400">{pregunta}</span>
                                            <span className="text-gray-700 break-words">{respuesta || '—'}</span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                    {s.mensajeRespuesta && (
                                      <div
                                        className="rounded-xl px-3 py-2 text-xs"
                                        style={s.estado === 'ACEPTADA'
                                          ? { backgroundColor: 'rgba(106,153,78,0.08)', color: '#3f5f2d' }
                                          : { backgroundColor: 'rgba(156,43,27,0.08)', color: '#7d2317' }}
                                      >
                                        <span className="opacity-70 block mb-0.5">
                                          Nota interna · {formatFecha(s.fechaDecision)}
                                        </span>
                                        {s.mensajeRespuesta}
                                      </div>
                                    )}
                                  </div>
                                )}

                                <div className="flex flex-wrap items-center gap-1.5 px-3 py-2.5 border-t border-gray-100">
                                  {s.estado === 'PENDIENTE' && (
                                    <>
                                      <button
                                        onClick={() => decidir(s, 'ACEPTADA')}
                                        disabled={actualizando === s.id}
                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#6A994E] bg-[#6A994E]/10 hover:bg-[#6A994E]/20 transition-colors disabled:opacity-50"
                                      >
                                        {actualizando === s.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                                        Aceptar
                                      </button>
                                      <button
                                        onClick={() => decidir(s, 'RECHAZADA')}
                                        disabled={actualizando === s.id}
                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#9C2B1B] bg-[#9C2B1B]/10 hover:bg-[#9C2B1B]/20 transition-colors disabled:opacity-50"
                                      >
                                        <XCircle className="w-3.5 h-3.5" /> Rechazar
                                      </button>
                                    </>
                                  )}
                                  <a
                                    href={telefono ? `https://wa.me/${telefono.replace(/\D/g, '')}` : '#'}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 transition-colors"
                                  >
                                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                                  </a>
                                  {esAdmin && (
                                    <>
                                      <div className="flex-1" />
                                      <button
                                        onClick={() => setEliminarId(s.id)}
                                        disabled={actualizando === s.id}
                                        className="p-1.5 rounded-lg text-red-300 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50"
                                        title="Eliminar solicitud"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {eliminarId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEliminarId(null)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl z-10">
            <h3 className="text-gray-800 mb-2">Eliminar solicitud</h3>
            <p className="text-gray-500 text-sm mb-5">
              Esta acción no se puede deshacer. ¿Seguro que quieres eliminar la solicitud?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setEliminarId(null)}
                className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50"
                disabled={actualizando !== null}
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminar}
                disabled={actualizando !== null}
                className="flex-1 text-white py-2.5 rounded-xl text-sm disabled:opacity-60"
                style={{ backgroundColor: '#9C2B1B' }}
              >
                {actualizando !== null ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}