import { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { Home, PawPrint, Loader2, Search, ChevronDown, ChevronUp, MessageCircle,
  Trash2, CheckCircle, XCircle, ClipboardList, RefreshCw, FileDown, ArrowLeftRight, X,
  Clock, Ban } from 'lucide-react';
import { useApp, useAuth } from '../../context/AppContext';
import { formatEnum } from '../../services/enums';
import type { Acogida, EstadoAcogida } from '../../types/acogida';
import type { EstadoSolicitudCuestionario } from '../../types/adoption';
import {
  listarAcogidas, cambiarEstadoAcogida, eliminarAcogida,
  cambiarEstadoSolicitud,
} from '../../services/acogidas';
import { API_BASE as BASE, leerMensajeError } from '../../services/api';

type SeccionKey = 'PENDIENTE' | 'DISPONIBLE' | 'ACTIVA' | 'NO_DISPONIBLE';

const SECCIONES: { key: SeccionKey; label: string; icono: ReactNode }[] = [
  { key: 'DISPONIBLE', label: 'Disponibles', icono: <Home className="w-4 h-4 text-gray-400" /> },
  { key: 'PENDIENTE', label: 'Pendientes', icono: <Clock className="w-4 h-4 text-gray-400" /> },
  { key: 'ACTIVA', label: 'Usadas', icono: <PawPrint className="w-4 h-4 text-gray-400" /> },
  { key: 'NO_DISPONIBLE', label: 'No disponibles', icono: <Ban className="w-4 h-4 text-gray-400" /> },
];

const COLOR_SECCION: Record<SeccionKey, string> = {
  PENDIENTE: 'border-l-amber-400',
  DISPONIBLE: 'border-l-green-500',
  ACTIVA: 'border-l-blue-500',
  NO_DISPONIBLE: 'border-l-gray-400',
};

export default function AcogidaManagement() {
  const { token, currentUser } = useAuth();
  const { animalsTodos } = useApp();
  const [acogidas, setAcogidas] = useState<Acogida[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<SeccionKey | ''>('');
  const [expandida, setExpandida] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preguntasMap, setPreguntasMap] = useState<Record<string, string>>({});
  const [reubicarId, setReubicarId] = useState<number | null>(null);
  const [errorReubicar, setErrorReubicar] = useState<string | null>(null);
  const [reubicarAnimalId, setReubicarAnimalId] = useState('');
  const [reubicando, setReubicando] = useState(false);
  const [seccionColapsada, setSeccionColapsada] = useState<Record<string, boolean>>({});

  const cargar = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await listarAcogidas(token);
      setAcogidas(data);
    } catch (e: any) {
      setError(e?.message ?? 'No se pudieron cargar los datos.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { cargar(); }, [cargar]);

  const fetchPreguntas = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${BASE}/formularios/acogida`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      const map: Record<string, string> = {};
      const recorrer = (nodo: any) => {
        if (Array.isArray(nodo)) { nodo.forEach(recorrer); return; }
        if (nodo && typeof nodo === 'object') {
          if (typeof nodo.id === 'string' && (nodo.pregunta || nodo.label)) {
            map[nodo.id] = nodo.pregunta ?? nodo.label ?? nodo.id;
          }
          Object.values(nodo).forEach(recorrer);
        }
      };
      (Array.isArray(data) ? data : []).forEach((f: any) => recorrer(f.preguntas));
      setPreguntasMap(map);
    } catch { /* se usa el id como etiqueta */ }
  }, [token]);

  useEffect(() => { fetchPreguntas(); }, [fetchPreguntas]);

  const abrirReubicar = (a: Acogida) => {
    setReubicarId(a.solicitudId ?? a.id ?? null);
    setReubicarAnimalId(a.animalId ? String(a.animalId) : '');
    setErrorReubicar(null);
  };

  const confirmarReubicar = async () => {
    if (reubicarId === null || !reubicarAnimalId) return;
    setReubicando(true);
    setErrorReubicar(null);
    try {
      const esVaciar = reubicarAnimalId === '__vaciar__';
      const res = await fetch(`${BASE}/acogidas/solicitudes/${reubicarId}/animal`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ animalId: esVaciar ? null : Number(reubicarAnimalId) }),
      });
      if (!res.ok) throw await leerMensajeError(res);
      setReubicarId(null);
      await cargar();
    } catch (e: any) {
      setErrorReubicar(e?.message ?? 'No se pudo reubicar la solicitud.');
    } finally {
      setReubicando(false);
    }
  };

  const exportarPDF = (a: Acogida) => {
    const respuestas = a.respuestas ?? {};
    const respuestaHTML = (id: string, v: string) => {
      const pregunta = preguntasMap[id] ?? id.replace(/_/g, ' ');
      return `<div class="qa"><div class="pregunta">${pregunta}</div><div class="respuesta">${v || '-'}</div></div>`;
    };
    const filas = Object.entries(respuestas).map(([id, v]) => respuestaHTML(id, v)).join('');
    const nombreCompleto = `${a.nombre}${a.apellidos ? ' ' + a.apellidos : ''}`;

    const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
    <title>Casa de acogida - ${nombreCompleto}</title>
    <style>
      @page { margin: 18mm 16mm; }
      body { font-family: Arial, sans-serif; color: #1f2937; max-width: 760px; margin: auto; background: #fff; }
      .head { border-bottom: 3px solid #f7e3b0; padding-bottom: 16px; margin-bottom: 20px; }
      .logo { font-weight: 700; color: #547792; font-size: 14px; margin-bottom: 4px; }
      h1 { font-size: 20px; margin: 0 0 6px; color: #1f2937; }
      .meta { font-size: 13px; color: #4b5563; line-height: 1.7; }
      .meta strong { color: #1f2937; font-weight: 700; }
      .qa { padding: 12px 0; border-bottom: 1px solid #f3f4f6; }
      .qa .pregunta { font-size: 12.5px; font-weight: 700; color: #374151; margin-bottom: 5px; }
      .qa .respuesta { font-size: 14px; color: #111827; white-space: pre-wrap; padding-left: 14px; }
      .vacias { color: #9ca3af; font-style: italic; }
    </style></head><body>
    <div class="head">
      <div class="logo">Ayuda Animal Murcia</div>
      <h1>Casa de acogida</h1>
      <div class="meta">
        <strong>${nombreCompleto}</strong> &nbsp;·&nbsp; ${formatEnum(a.estado)}
        ${a.especie ? ` &nbsp;·&nbsp; ${a.especie}` : ''}
        <br>${a.email} &nbsp;·&nbsp; ${a.telefono}
        ${a.direccion ? ` &nbsp;·&nbsp; ${a.direccion}` : ''}
        ${a.animalNombre ? ` &nbsp;·&nbsp; Animal: <strong>${a.animalNombre}</strong>` : ''}
      </div>
    </div>
    ${filas || '<div class="qa"><div class="respuesta vacias">Sin respuestas registradas.</div></div>'}
    <script>window.onload = () => { window.print(); }<\/script>
    </body></html>`;

    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(html);
    win.document.close();
  };

  const aceptarSolicitud = async (a: Acogida) => {
    if (!token || !a.solicitudId) return;
    try {
      await cambiarEstadoSolicitud(token, a.solicitudId, 'ACEPTADA');
      await cargar();
    } catch (e: any) {
      setError(e?.message ?? 'No se pudo aceptar la solicitud.');
    }
  };

  const rechazarSolicitud = async (a: Acogida) => {
    if (!token || !a.solicitudId) return;
    if (!window.confirm('¿Rechazar esta solicitud?')) return;
    try {
      await cambiarEstadoSolicitud(token, a.solicitudId, 'RECHAZADA');
      await cargar();
    } catch (e: any) {
      setError(e?.message ?? 'No se pudo rechazar la solicitud.');
    }
  };

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
    if ((currentUser?.role ?? '').toUpperCase() !== 'ADMIN') {
      alert('Solo el administrador puede eliminar casas de acogida');
      return;
    }
    if (!window.confirm('¿Eliminar esta casa de acogida?')) return;
    try {
      await eliminarAcogida(token, id);
      await cargar();
    } catch (e: any) {
      setError(e?.message ?? 'No se pudo eliminar.');
    }
  };

  const waLink = (telefono: string) => {
    const t = telefono?.replace(/\D/g, '');
    return t ? `https://wa.me/${t}` : '#';
  };

  const buscar = busqueda.toLowerCase().trim();
  const filtradas = acogidas.filter(a => {
    if (buscar) {
      const nombre = `${a.nombre} ${a.apellidos ?? ''}`.toLowerCase();
      if (!nombre.includes(buscar)) return false;
    }
    if (filtroEstado && a.estado !== filtroEstado) return false;
    return true;
  });

  const gatos = filtradas.filter(a => a.especie === 'GATO');
  const perros = filtradas.filter(a => a.especie === 'PERRO');

  const toggleSeccion = (col: string, key: string) => {
    const k = `${col}-${key}`;
    setSeccionColapsada(prev => ({ ...prev, [k]: !prev[k] }));
  };

  const isColapsada = (col: string, key: string) => seccionColapsada[`${col}-${key}`] ?? false;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-400 gap-3">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Cargando casas de acogida...</span>
      </div>
    );
  }

  const renderColumna = (especie: 'GATO' | 'PERRO', items: Acogida[]) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        {especie === 'GATO' ? (
          <PawPrint className="w-5 h-5 text-gray-600" />
        ) : (
          <PawPrint className="w-5 h-5 text-gray-600" />
        )}
        <h2 className="text-lg font-semibold text-gray-900">
          {especie === 'GATO' ? 'Gatos' : 'Perros'}
        </h2>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{items.length}</span>
      </div>

      {SECCIONES.map(sec => {
        const itemsSeccion = items.filter(a => a.estado === sec.key);
        if (itemsSeccion.length === 0) return null;
        const colapsada = isColapsada(especie, sec.key);

        return (
          <div key={sec.key} className={`rounded-xl border border-gray-100 border-l-4 ${COLOR_SECCION[sec.key]} overflow-hidden bg-white shadow-sm`}>
            <button
              onClick={() => toggleSeccion(especie, sec.key)}
              className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50/60 transition-colors"
            >
              <div className="flex items-center gap-2">
                {sec.icono}
                <span className="text-sm font-medium text-gray-800">{sec.label}</span>
                <span className="text-xs text-gray-400">({itemsSeccion.length})</span>
              </div>
              {colapsada
                ? <ChevronDown className="w-4 h-4 text-gray-400" />
                : <ChevronUp className="w-4 h-4 text-gray-400" />}
            </button>

            {!colapsada && (
              <div className="px-3 pb-3 space-y-2">
                {itemsSeccion.map(a => (
                  <div key={a.id} className="bg-gray-50/60 rounded-xl border border-gray-100 overflow-hidden">
                    <button
                      onClick={() => setExpandida(expandida === a.id ? null : a.id)}
                      className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-gray-100/60 transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {a.nombre}{a.apellidos ? ` ${a.apellidos}` : ''}
                          </p>
                          {(a.animalNombre || a.respuestas?.animal_concreto) && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-[#f7e3b0] text-gray-900 whitespace-nowrap">
                              <PawPrint className="w-3.5 h-3.5 text-gray-900" />
                              {a.animalNombre || a.respuestas?.animal_concreto}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate">{a.email}</p>
                      </div>
                      {expandida === a.id
                        ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                    </button>

                    <div className="px-4 grid grid-cols-2 gap-x-4 gap-y-1.5">
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-gray-400">Teléfono</p>
                        <p className="text-xs text-gray-800 font-medium truncate">{a.telefono || '—'}</p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-gray-400">Dirección</p>
                        <p className="text-xs text-gray-800 font-medium truncate">{a.direccion || '—'}</p>
                      </div>
                    </div>

                    {expandida === a.id && a.respuestas && (
                      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/40">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                          {Object.entries(a.respuestas).map(([k, v]) => (
                            <div key={k}>
                              <p className="text-[11px] uppercase tracking-wide text-gray-400">{preguntasMap[k] ?? k.replace(/_/g, ' ')}</p>
                              <p className="text-sm text-gray-700">{v || '—'}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 px-3 py-2.5 border-t border-gray-100">
                      {a.estado === 'PENDIENTE' && (
                        <>
                          <button
                            onClick={() => aceptarSolicitud(a)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 transition-colors"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Aceptar
                          </button>
                          <button
                            onClick={() => rechazarSolicitud(a)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Rechazar
                          </button>
                        </>
                      )}

                      {a.estado === 'DISPONIBLE' && (
                        <button
                          onClick={() => cambiarEstado(a.id, 'NO_DISPONIBLE')}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                          <Ban className="w-3.5 h-3.5" /> No disponible
                        </button>
                      )}

                      {a.estado === 'NO_DISPONIBLE' && (
                        <button
                          onClick={() => cambiarEstado(a.id, 'DISPONIBLE')}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 transition-colors"
                        >
                          <Home className="w-3.5 h-3.5" /> Disponible
                        </button>
                      )}

                      <a
                        href={waLink(a.telefono)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                      </a>

                      <div className="flex-1" />

                      <button
                        onClick={() => abrirReubicar(a)}
                        className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"
                        title="Reubicar animal"
                      >
                        <ArrowLeftRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => exportarPDF(a)}
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        title="Exportar PDF"
                      >
                        <FileDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => borrarAcogida(a.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {items.length === 0 && (
        <p className="text-xs text-gray-400 text-center py-4">No hay casas de acogida de esta especie.</p>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Casas de acogida</h1>
          <p className="text-sm text-gray-500 mt-0.5">{acogidas.length} casa{acogidas.length !== 1 ? 's' : ''} registrada{acogidas.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={cargar}
          className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors"
          title="Recargar"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {error && (
        <div className="flex items-center justify-between bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-xs underline">cerrar</button>
        </div>
      )}

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none"
          />
        </div>
        <select
          value={filtroEstado}
          onChange={e => setFiltroEstado(e.target.value as SeccionKey | '')}
          className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none bg-white"
        >
          <option value="">Todos</option>
          {SECCIONES.map(s => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </select>
      </div>

      {acogidas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ClipboardList className="w-10 h-10 text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm">No hay casas de acogida registradas.</p>
          <p className="text-gray-400 text-xs mt-1">Las solicitudes del formulario público aparecerán aquí.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {renderColumna('GATO', gatos)}
          {renderColumna('PERRO', perros)}
        </div>
      )}

      {reubicarId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !reubicando && setReubicarId(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-900">Reubicar animal</h3>
              <button
                onClick={() => !reubicando && setReubicarId(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Elige el animal al que quieres asignar esta casa de acogida, o déjala libre:
            </p>
            <select
              value={reubicarAnimalId}
              onChange={e => setReubicarAnimalId(e.target.value)}
              disabled={reubicando}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none disabled:opacity-60"
            >
              <option value="">Selecciona una opción...</option>
              <option value="__vaciar__">Dejar la casa de acogida libre</option>
              {animalsTodos
                .filter(a => String(a.id) !== String(reubicarAnimalId))
                .map(a => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
            </select>
            {errorReubicar && <p className="text-xs text-red-600 mt-2">{errorReubicar}</p>}
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => !reubicando && setReubicarId(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarReubicar}
                disabled={!reubicarAnimalId || reubicando}
                className="px-4 py-2 text-sm font-medium text-white rounded-xl transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: '#547792' }}
              >
                {reubicando ? <Loader2 className="w-4 h-4 animate-spin inline mr-1" /> : null}
                {reubicando ? 'Guardando...' : (reubicarAnimalId === '__vaciar__' ? 'Dejar libre' : 'Asignar')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
