import { useState, useEffect, useCallback } from 'react';
import {
  Loader2, Search, ChevronDown, ChevronUp, CheckCircle, XCircle, MessageCircle,
  Trash2, RefreshCw, Calendar, ClipboardList,
} from 'lucide-react';
import { useAuth } from '../../context/AppContext';
import {
  listarSolicitudesColaboracion, decidirSolicitudColaboracion,
  eliminarSolicitudColaboracion, type SolicitudColaboracion,
} from '../../services/colaboracion';

type EstadoSolicitud = 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA';

// Paleta de estados: pendiente #D4AF37 · aceptado #6A994E · rechazado #9C2B1B
const ESTADO_CHIP: Record<EstadoSolicitud, string> = {
  PENDIENTE: 'bg-[#D4AF37] text-[#2e2e2e]',
  ACEPTADA:  'bg-[#6A994E] text-white',
  RECHAZADA: 'bg-[#9C2B1B] text-white',
};

const TIPO_LABEL: Record<string, string> = {
  VOLUNTARIADO:     'Voluntariado',
  VOLUNTARIADO_UMU: 'Voluntariado (UMU)',
  ACOGIDA:          'Casa de acogida',
};

const SECCIONES: { key: EstadoSolicitud; label: string; border: string; dot: string }[] = [
  { key: 'PENDIENTE', label: 'Pendientes', border: 'border-l-[#D4AF37]', dot: 'bg-[#D4AF37]' },
  { key: 'ACEPTADA',  label: 'Aceptadas',  border: 'border-l-[#6A994E]', dot: 'bg-[#6A994E]' },
  { key: 'RECHAZADA', label: 'Rechazadas', border: 'border-l-[#9C2B1B]', dot: 'bg-[#9C2B1B]' },
];

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
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [seccion, setSeccion] = useState<EstadoSolicitud | ''>('PENDIENTE');
  const [expandida, setExpandida] = useState<number | null>(null);
  const [actualizando, setActualizando] = useState<number | null>(null);
  const [decision, setDecision] = useState<{ solicitud: SolicitudColaboracion; estado: 'ACEPTADA' | 'RECHAZADA' } | null>(null);
  const [mensaje, setMensaje] = useState('');
  const [eliminarId, setEliminarId] = useState<number | null>(null);
  const [seccionesColapsadas, setSeccionesColapsadas] = useState<Record<string, boolean>>({});

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

  const confirmarDecision = async () => {
    if (!decision || !token) return;
    setActualizando(decision.solicitud.id);
    try {
      const actualizada = await decidirSolicitudColaboracion(
        token, decision.solicitud.id, decision.estado, mensaje.trim());
      setSolicitudes(prev => prev.map(s => (s.id === actualizada.id ? actualizada : s)));
      setDecision(null);
      setMensaje('');
      setError(null);
    } catch (e: any) {
      setError(e?.message ?? 'No se pudo actualizar la solicitud.');
    } finally {
      setActualizando(null);
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
    if (tipoFiltro && s.tipo !== tipoFiltro) return false;
    if (!busqueda) return true;
    const texto = busqueda.toLowerCase();
    return (s.nombre ?? '').toLowerCase().includes(texto) || s.email.toLowerCase().includes(texto);
  };

  const grupos = SECCIONES
    .filter(g => !seccion || g.key === seccion)
    .map(g => ({ ...g, items: solicitudes.filter(s => s.estado === g.key && coincide(s)) }))
    .filter(g => g.items.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-gray-900">Solicitudes de voluntariado</h1>
          <p className="text-sm text-gray-500 mt-1">
            Altas recibidas desde la web: voluntariado, voluntariado UMU y casas de acogida.
          </p>
        </div>
        <button
          onClick={cargar}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Actualizar
        </button>
      </div>

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
          value={tipoFiltro}
          onChange={e => setTipoFiltro(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
        >
          <option value="">Todos los tipos</option>
          {Object.entries(TIPO_LABEL).map(([valor, etiqueta]) => (
            <option key={valor} value={valor}>{etiqueta}</option>
          ))}
        </select>
        <select
          value={seccion}
          onChange={e => setSeccion(e.target.value as EstadoSolicitud | '')}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
        >
          <option value="">Todas</option>
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
      ) : grupos.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 text-center py-16 text-gray-400">
          <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p>No hay solicitudes con estos filtros</p>
        </div>
      ) : (
        grupos.map(({ key, label, border, dot, items }) => {
          const colapsada = seccionesColapsadas[key];
          return (
            <div key={key} className={`bg-white rounded-2xl border border-gray-100 border-l-4 ${border}`}>
              <button
                onClick={() => setSeccionesColapsadas(prev => ({ ...prev, [key]: !prev[key] }))}
                className="w-full flex items-center justify-between gap-2 px-4 sm:px-5 py-4"
              >
                <span className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                  <span className={`w-2.5 h-2.5 rounded-full ${dot}`} />
                  {label}
                  <span className="text-xs font-normal text-gray-400">({items.length})</span>
                </span>
                {colapsada ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronUp className="w-4 h-4 text-gray-400" />}
              </button>

              {!colapsada && (
                <div className="px-4 sm:px-5 pb-4 space-y-3">
                  {items.map(s => {
                    const abierta = expandida === s.id;
                    const respuestas = Object.entries(s.respuestas ?? {});
                    const telefono = s.respuestas?.['Teléfono de contacto'] ?? '';

                    return (
                      <div key={s.id} className="rounded-xl border border-gray-100">
                        <div className="p-4">
                          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${ESTADO_CHIP[s.estado]}`}>
                                  {label}
                                </span>
                                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#dce8ed] text-[#213448]">
                                  {TIPO_LABEL[s.tipo] ?? s.tipo}
                                </span>
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5" /> {formatFecha(s.fechaSolicitud)}
                                </span>
                              </div>
                              <p className="text-sm font-medium text-gray-800 truncate">{s.nombre ?? 'Sin nombre'}</p>
                              <p className="text-xs text-gray-500 truncate">{s.email}</p>
                            </div>

                            <div className="flex flex-wrap items-center gap-1.5 lg:justify-end">
                              {s.estado === 'PENDIENTE' && (
                                <>
                                  <button
                                    onClick={() => { setDecision({ solicitud: s, estado: 'ACEPTADA' }); setMensaje(''); }}
                                    disabled={actualizando === s.id}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#6A994E] bg-[#6A994E]/10 hover:bg-[#6A994E]/20 transition-colors disabled:opacity-50"
                                  >
                                    {actualizando === s.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                    Aceptar
                                  </button>
                                  <button
                                    onClick={() => { setDecision({ solicitud: s, estado: 'RECHAZADA' }); setMensaje(''); }}
                                    disabled={actualizando === s.id}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#9C2B1B] bg-[#9C2B1B]/10 hover:bg-[#9C2B1B]/20 transition-colors disabled:opacity-50"
                                  >
                                    <XCircle className="w-4 h-4" /> Rechazar
                                  </button>
                                </>
                              )}
                              <a
                                href={telefono ? `https://wa.me/${telefono.replace(/\D/g, '')}` : '#'}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 transition-colors"
                              >
                                <MessageCircle className="w-4 h-4" /> WhatsApp
                              </a>
                              <button
                                onClick={() => setExpandida(abierta ? null : s.id)}
                                className="p-2 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors"
                                title={abierta ? 'Ocultar respuestas' : 'Ver respuestas'}
                              >
                                {abierta ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </button>
                              {esAdmin && (
                                <button
                                  onClick={() => setEliminarId(s.id)}
                                  disabled={actualizando === s.id}
                                  className="p-2 rounded-xl text-red-300 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50"
                                  title="Eliminar solicitud"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>

                          {s.mensajeRespuesta && (
                            <div
                              className="mt-3 rounded-xl px-3 py-2 text-xs"
                              style={s.estado === 'ACEPTADA'
                                ? { backgroundColor: 'rgba(106,153,78,0.08)', color: '#3f5f2d' }
                                : { backgroundColor: 'rgba(156,43,27,0.08)', color: '#7d2317' }}
                            >
                              <span className="opacity-70 block mb-0.5">
                                Mensaje enviado · {formatFecha(s.fechaDecision)}
                              </span>
                              {s.mensajeRespuesta}
                            </div>
                          )}
                        </div>

                        {abierta && (
                          <div className="border-t border-gray-100 bg-gray-50/70 px-4 py-3">
                            {respuestas.length === 0 ? (
                              <p className="text-xs text-gray-400">Sin respuestas registradas.</p>
                            ) : (
                              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
                                {respuestas.map(([pregunta, respuesta]) => (
                                  <div key={pregunta} className="text-xs">
                                    <span className="block text-gray-400">{pregunta}</span>
                                    <span className="text-gray-700 break-words">{respuesta || '—'}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })
      )}

      {decision && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDecision(null)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-md w-full shadow-xl z-10">
            <h3 className="text-gray-800 mb-2 flex items-center gap-2">
              {decision.estado === 'ACEPTADA'
                ? <CheckCircle className="w-5 h-5 text-[#6A994E]" />
                : <XCircle className="w-5 h-5 text-[#9C2B1B]" />}
              {decision.estado === 'ACEPTADA' ? 'Aceptar solicitud' : 'Rechazar solicitud'}
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              Se avisará por correo a <span className="text-gray-700">{decision.solicitud.email}</span>.
              Puedes añadir un mensaje opcional.
            </p>
            <textarea
              value={mensaje}
              onChange={e => setMensaje(e.target.value)}
              rows={3}
              placeholder="Ej: te escribiremos para coordinar una reunión en la sede..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setDecision(null)}
                className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50"
                disabled={actualizando !== null}
              >
                Cancelar
              </button>
              <button
                onClick={confirmarDecision}
                disabled={actualizando !== null}
                className="flex-1 text-white py-2.5 rounded-xl text-sm transition-opacity disabled:opacity-60"
                style={{ backgroundColor: decision.estado === 'ACEPTADA' ? '#6A994E' : '#9C2B1B' }}
              >
                {actualizando !== null ? 'Guardando...' : 'Confirmar'}
              </button>
            </div>
          </div>
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