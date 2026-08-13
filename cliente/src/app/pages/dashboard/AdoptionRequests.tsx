import { useState, useEffect, useCallback } from 'react';
import { ClipboardList, CheckCircle, XCircle, Clock, Search, ChevronDown, ChevronUp, Loader2, FileDown, ArrowLeftRight, X, Trash2 } from 'lucide-react';
import { useApp, useAuth } from '../../context/AppContext';
import { useEnums, formatEnum } from '../../hooks/useEnums';
import type { SolicitudAdopcion, EstadoSolicitudAdopcion } from '../../types/adoption';

import { API_BASE as BASE } from '../../services/api';

const ESTADO_COLORS: Record<EstadoSolicitudAdopcion, string> = {
  PENDIENTE: 'bg-amber-100 text-amber-700',
  ACEPTADA:  'bg-green-100 text-green-700',
  RECHAZADA: 'bg-red-100 text-red-600',
};

export default function AdoptionRequests() {
  const { token } = useAuth();
  const { animalsTodos } = useApp();
  const { enums } = useEnums();
  const [solicitudes, setSolicitudes] = useState<SolicitudAdopcion[]>([]);
  const [preguntasMap, setPreguntasMap] = useState<Record<string, string>>({});
  const [formulariosInfo, setFormulariosInfo] = useState<{
    nombre: string;
    especie: string | null;
    cachorro: boolean | null;
    secciones: { titulo: string; ids: string[] }[];
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState<EstadoSolicitudAdopcion | 'TODAS'>('TODAS');
  const [busqueda, setBusqueda] = useState('');
  const [expandida, setExpandida] = useState<number | null>(null);
  const [actualizando, setActualizando] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reubicarId, setReubicarId] = useState<number | null>(null);
  const [reubicarAnimalId, setReubicarAnimalId] = useState('');
  const [reubicando, setReubicando] = useState(false);
  const [errorReubicar, setErrorReubicar] = useState<string | null>(null);
  const [borrarId, setBorrarId] = useState<number | null>(null);
  const [borrando, setBorrando] = useState(false);
  const [errorBorrar, setErrorBorrar] = useState<string | null>(null);

  const estadosFiltro = ['TODAS', ...(enums?.estadosSolicitudAdopcion ?? ['PENDIENTE', 'ACEPTADA', 'RECHAZADA'])] as const;

  const fetchSolicitudes = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/adopciones`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSolicitudes(Array.isArray(data) ? data : []);
    } catch {
      setError('No se pudieron cargar las solicitudes.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchPreguntas = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${BASE}/formularios`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      const map: Record<string, string> = {};
      const formularios: {
        nombre: string;
        especie: string | null;
        cachorro: boolean | null;
        secciones: { titulo: string; ids: string[] }[];
      }[] = [];

      const recorrer = (nodo: any, secciones: { titulo: string; ids: string[] }[]) => {
        if (Array.isArray(nodo)) {
          nodo.forEach(p => recorrer(p, secciones));
          return;
        }
        if (nodo && typeof nodo === 'object') {
          if (typeof nodo.id === 'string' && (nodo.pregunta || nodo.label)) {
            const texto = nodo.pregunta ?? nodo.label ?? nodo.id;
            if (texto && !map[nodo.id]) map[nodo.id] = texto;
          }
          if (
            typeof nodo.titulo === 'string' &&
            Array.isArray(nodo.preguntas) &&
            nodo.preguntas.some((p: any) => p && typeof p.id === 'string')
          ) {
            const ids = nodo.preguntas
              .filter((p: any) => p && typeof p.id === 'string')
              .map((p: any) => p.id);
            if (ids.length > 0) secciones.push({ titulo: nodo.titulo, ids });
          }
          Object.values(nodo).forEach(v => recorrer(v, secciones));
        }
      };

      (Array.isArray(data) ? data : []).forEach((f: any) => {
        const secciones: { titulo: string; ids: string[] }[] = [];
        recorrer(f.preguntas, secciones);
        if (secciones.length > 0) {
          formularios.push({
            nombre: f.nombre ?? '',
            especie: f.especie ?? null,
            cachorro: f.cachorro ?? null,
            secciones,
          });
        }
      });

      setPreguntasMap(map);
      setFormulariosInfo(formularios);
    } catch {
      // No se pudo cargar el mapa de preguntas: se usa el id como etiqueta
    }
  }, [token]);

  useEffect(() => { fetchSolicitudes(); }, [fetchSolicitudes]);
  useEffect(() => { fetchPreguntas(); }, [fetchPreguntas]);

  const cambiarEstado = async (id: number, nuevoEstado: EstadoSolicitudAdopcion) => {
    setActualizando(id);
    try {
      const res = await fetch(`${BASE}/adopciones/${id}/estado`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      if (!res.ok) throw new Error();
      await fetchSolicitudes();
    } catch {
      setError('No se pudo actualizar el estado.');
    } finally {
      setActualizando(null);
    }
  };

  const abrirReubicar = (s: SolicitudAdopcion) => {
    setReubicarId(s.id);
    setReubicarAnimalId(s.animalId ? String(s.animalId) : '');
    setErrorReubicar(null);
  };

  const confirmarReubicar = async () => {
    if (reubicarId === null || !reubicarAnimalId) return;
    setReubicando(true);
    setErrorReubicar(null);
    try {
      const res = await fetch(`${BASE}/adopciones/${reubicarId}/animal`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ animalId: Number(reubicarAnimalId) }),
      });
      if (!res.ok) throw new Error();
      setReubicarId(null);
      await fetchSolicitudes();
    } catch {
      setErrorReubicar('No se pudo reubicar la solicitud.');
    } finally {
      setReubicando(false);
    }
  };

  const confirmarBorrar = async () => {
    if (borrarId === null) return;
    setBorrando(true);
    setErrorBorrar(null);
    try {
      const res = await fetch(`${BASE}/adopciones/${borrarId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setBorrarId(null);
      await fetchSolicitudes();
    } catch {
      setErrorBorrar('No se pudo eliminar la solicitud.');
    } finally {
      setBorrando(false);
    }
  };

  const contextoCuestionario = (s: SolicitudAdopcion) => {
    const respuestas = s.respuestas ?? {};
    const animal = animalsTodos.find(a => String(a.id) === String(s.animalId));
    const especie = animal?.species ?? null;
    const esCachorro = animal?.birthDate
      ? Math.floor((Date.now() - new Date(animal.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 30.44)) < 12
      : false;

    const candidatos = (especie ?? '') !== ''
      ? formulariosInfo.filter(f => f.especie === especie)
      : [];
    const conCachorro = candidatos.find(f => f.cachorro === true);
    const sinEdad = candidatos.find(f => f.cachorro === null || f.cachorro === false);
    const generico = formulariosInfo.find(f => f.especie === null);
    const elegido =
      (esCachorro ? conCachorro : null) ??
      sinEdad ??
      conCachorro ??
      generico ??
      formulariosInfo[0];

    const secciones = elegido?.secciones ?? [];
    const idsEnSecciones = new Set(secciones.flatMap(sec => sec.ids));
    const sueltas = Object.keys(respuestas).filter(id => !idsEnSecciones.has(id));

    return { secciones, sueltas, tipoFormulario: elegido?.nombre ?? 'Solicitud de adopción' };
  };

  const exportarPDF = (s: SolicitudAdopcion) => {
    const respuestas = s.respuestas ?? {};
    const respuestaHTML = (id: string, v: string) => {
      const pregunta = preguntasMap[id] ?? id.replace(/_/g, ' ');
      return `<div class="qa">
          <div class="pregunta">${pregunta}</div>
          <div class="respuesta">${v || '-'}</div>
        </div>`;
    };

    const { secciones, sueltas, tipoFormulario } = contextoCuestionario(s);

    const conRespuesta = (ids: string[]) => ids.filter(id => respuestas[id] !== undefined);

    const seccionesHTML = secciones
      .map(sec => {
        const ids = conRespuesta(sec.ids);
        if (ids.length === 0) return '';
        return `<div class="seccion">${sec.titulo}</div>${ids.map(id => respuestaHTML(id, respuestas[id])).join('')}`;
      })
      .join('');

    const sueltasHTML = sueltas.length > 0
      ? `<div class="seccion">Otras respuestas</div>${sueltas.map(id => respuestaHTML(id, respuestas[id])).join('')}`
      : '';

    const filas = seccionesHTML + sueltasHTML;

    const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
    <title>${tipoFormulario} - ${s.nombreAdoptante}</title>
    <style>
      @page { margin: 18mm 16mm; }
      body { font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; color: #1f2937; max-width: 760px; margin: auto; background: #fff; }
      .head { border-bottom: 3px solid #f7e3b0; padding-bottom: 16px; margin-bottom: 20px; }
      .logo { font-weight: 700; color: #547792; letter-spacing: .02em; font-size: 14px; margin-bottom: 4px; }
      h1 { font-size: 20px; margin: 0 0 6px; color: #1f2937; }
      .meta { font-size: 13px; color: #4b5563; line-height: 1.7; }
      .meta strong { color: #1f2937; font-weight: 700; }
      .seccion { margin: 26px 0 8px; font-size: 13px; font-weight: 700; color: #2e2e2e; background: #f7e3b0; border-left: 5px solid #e8a020; padding: 9px 14px; border-radius: 6px; text-transform: uppercase; letter-spacing: .03em; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .qa { padding: 12px 0; border-bottom: 1px solid #f3f4f6; }
      .qa .pregunta { font-size: 12.5px; font-weight: 700; color: #374151; margin-bottom: 5px; }
      .qa .respuesta { font-size: 14px; color: #111827; white-space: pre-wrap; padding-left: 14px; }
      .vacias { color: #9ca3af; font-style: italic; }
    </style></head><body>
    <div class="head">
      <div class="logo">Ayuda Animal Murcia</div>
      <h1>${tipoFormulario}</h1>
      <div class="meta">
        <strong>${s.nombreAdoptante}</strong> &nbsp;·&nbsp; ${formatEnum(s.estado)}
        <br>${s.email} &nbsp;·&nbsp; ${s.dni} &nbsp;·&nbsp; ${s.telefono}
        ${s.animalNombre ? `&nbsp;·&nbsp; Animal: <strong>${s.animalNombre}</strong>` : ''}
        ${s.fechaSolicitud ? `&nbsp;·&nbsp; ${new Date(s.fechaSolicitud).toLocaleDateString('es-ES')}` : ''}
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

  const solicitudesFiltradas = solicitudes.filter(s => {
    const coincideEstado = filtroEstado === 'TODAS' || s.estado === filtroEstado;
    const coincideBusqueda =
      s.nombreAdoptante.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.email.toLowerCase().includes(busqueda.toLowerCase()) ||
      (s.animalNombre ?? '').toLowerCase().includes(busqueda.toLowerCase());
    return coincideEstado && coincideBusqueda;
  });

  const contadores: Record<string, number> = {
    TODAS: solicitudes.length,
    ...(enums?.estadosSolicitudAdopcion ?? ['PENDIENTE', 'ACEPTADA', 'RECHAZADA']).reduce(
      (acc, e) => ({ ...acc, [e]: solicitudes.filter(s => s.estado === e).length }),
      {}
    ),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Solicitudes de adopción</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gestiona las solicitudes recibidas</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <ClipboardList className="w-4 h-4" />
          <span>{contadores['PENDIENTE'] ?? 0} pendiente{(contadores['PENDIENTE'] ?? 0) !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o animal..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none"
            onFocus={e => (e.currentTarget.style.borderColor = '#547792')}
            onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {estadosFiltro.map(estado => (
            <button
              key={estado}
              onClick={() => setFiltroEstado(estado as EstadoSolicitudAdopcion | 'TODAS')}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors border ${
                filtroEstado === estado
                  ? 'text-white border-transparent'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
              }`}
              style={filtroEstado === estado ? { backgroundColor: '#547792', borderColor: '#547792' } : {}}
            >
              {estado === 'TODAS' ? 'Todas' : formatEnum(estado)} ({contadores[estado] ?? 0})
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400 gap-3">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Cargando solicitudes...</span>
        </div>
      ) : solicitudesFiltradas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ClipboardList className="w-10 h-10 text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm">
            No hay solicitudes{filtroEstado !== 'TODAS' ? ` con estado «${formatEnum(filtroEstado)}»` : ''}.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {solicitudesFiltradas.map(s => {
            const { secciones, sueltas } = contextoCuestionario(s);
            return (
            <div key={s.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              {/* Cabecera: nombre + estado (clic expande respuestas) */}
              <button
                onClick={() => setExpandida(expandida === s.id ? null : s.id)}
                className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-gray-50/60 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-gray-900 text-sm">{s.nombreAdoptante}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ESTADO_COLORS[s.estado]}`}>
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

              <div className="flex items-center gap-1.5 px-4 py-3 mt-3 border-t border-gray-100">
                {s.estado === 'PENDIENTE' ? (
                  <>
                    <button
                      onClick={() => cambiarEstado(s.id, 'ACEPTADA')}
                      disabled={actualizando === s.id}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 transition-colors disabled:opacity-50"
                    >
                      {actualizando === s.id
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <CheckCircle className="w-4 h-4" />}
                      Aceptar
                    </button>
                    <button
                      onClick={() => cambiarEstado(s.id, 'RECHAZADA')}
                      disabled={actualizando === s.id}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" />
                      Rechazar
                    </button>
                  </>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-2 text-xs text-gray-400">
                    <Clock className="w-4 h-4" />
                    {formatEnum(s.estado)}
                  </span>
                )}
                <div className="flex-1" />
                <button
                  onClick={() => abrirReubicar(s)}
                  disabled={actualizando === s.id}
                  title="Reubicar a otro animal"
                  className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => exportarPDF(s)}
                  title="Exportar PDF"
                  className="p-2 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <FileDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { setBorrarId(s.id); setErrorBorrar(null); }}
                  title="Eliminar solicitud"
                  className="p-2 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {expandida === s.id && (
                <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Respuestas del cuestionario</p>
                  </div>
                  {s.respuestas && Object.keys(s.respuestas).length > 0 ? (
                    <div className="space-y-5">
                      {secciones.map(sec => {
                        const ids = sec.ids.filter(id => s.respuestas[id] !== undefined && s.respuestas[id] !== '');
                        if (ids.length === 0) return null;
                        return (
                          <div key={sec.titulo}>
                            <p className="inline-block text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full mb-2.5"
                              style={{ backgroundColor: '#f7e3b0', color: '#2e2e2e' }}>
                              {sec.titulo}
                            </p>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                              {ids.map(preguntaId => (
                                <div key={preguntaId}>
                                  <dt className="text-xs text-gray-500">
                                    {preguntasMap[preguntaId] ?? preguntaId.replace(/_/g, ' ')}
                                  </dt>
                                  <dd className="text-sm text-gray-800 font-medium mt-0.5">{s.respuestas[preguntaId] || '—'}</dd>
                                </div>
                              ))}
                            </dl>
                          </div>
                        );
                      })}
                      {sueltas.length > 0 && (
                        <div>
                          <p className="inline-block text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full mb-2.5"
                            style={{ backgroundColor: '#f7e3b0', color: '#2e2e2e' }}>
                            Otras respuestas
                          </p>
                          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                            {sueltas.map(preguntaId => (
                              <div key={preguntaId}>
                                <dt className="text-xs text-gray-500">
                                  {preguntasMap[preguntaId] ?? preguntaId.replace(/_/g, ' ')}
                                </dt>
                                <dd className="text-sm text-gray-800 font-medium mt-0.5">{s.respuestas[preguntaId] || '—'}</dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">Sin respuestas registradas.</p>
                  )}
                </div>
              )}
            </div>
            );
          })}
        </div>
      )}

      {reubicarId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !reubicando && setReubicarId(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-900">Reubicar solicitud</h3>
              <button
                onClick={() => !reubicando && setReubicarId(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              La solicitud está asociada a{' '}
              <strong>{solicitudes.find(x => x.id === reubicarId)?.animalNombre ?? 'este animal'}</strong>.
              Elige el animal al que quieres reubicarla:
            </p>
            <select
              value={reubicarAnimalId}
              onChange={e => setReubicarAnimalId(e.target.value)}
              disabled={reubicando}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none disabled:opacity-60"
            >
              <option value="">Selecciona un animal...</option>
              {animalsTodos
                .filter(a => String(a.id) !== String(solicitudes.find(x => x.id === reubicarId)?.animalId))
                .map(a => (
                  <option key={a.id} value={a.id}>
                    {a.name} — {formatEnum(a.species)}
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
                {reubicando ? 'Reubicando...' : 'Reubicar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {borrarId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !borrando && setBorrarId(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-900">Eliminar solicitud</h3>
              <button
                onClick={() => !borrando && setBorrarId(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              ¿Seguro que quieres eliminar la solicitud de{' '}
              <strong>{solicitudes.find(x => x.id === borrarId)?.nombre ?? 'este solicitante'}</strong> para{' '}
              <strong>{solicitudes.find(x => x.id === borrarId)?.animalNombre ?? 'este animal'}</strong>?
              Esta acción no se puede deshacer.
            </p>
            {errorBorrar && <p className="text-xs text-red-600 mt-2">{errorBorrar}</p>}
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => !borrando && setBorrarId(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarBorrar}
                disabled={borrando}
                className="px-4 py-2 text-sm font-medium text-white rounded-xl transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: '#c0392b' }}
              >
                {borrando ? <Loader2 className="w-4 h-4 animate-spin inline mr-1" /> : null}
                {borrando ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
