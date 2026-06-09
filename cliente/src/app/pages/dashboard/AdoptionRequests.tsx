import { useState, useEffect, useCallback } from 'react';
import { ClipboardList, CheckCircle, XCircle, Clock, Search, ChevronDown, ChevronUp, Loader2, FileDown } from 'lucide-react';
import { useAuth } from '../../context/AppContext';
import { useEnums, formatEnum } from '../../hooks/useEnums';
import type { SolicitudAdopcion, EstadoSolicitudAdopcion } from '../../types/adoption';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/vidanimal';

const ESTADO_COLORS: Record<EstadoSolicitudAdopcion, string> = {
  PENDIENTE: 'bg-amber-100 text-amber-700',
  ACEPTADA:  'bg-green-100 text-green-700',
  RECHAZADA: 'bg-red-100 text-red-600',
};

const ESTADO_PDF_COLORS: Record<EstadoSolicitudAdopcion, { bg: string; color: string }> = {
  PENDIENTE: { bg: '#fef3c7', color: '#b45309' },
  ACEPTADA:  { bg: '#dcfce7', color: '#15803d' },
  RECHAZADA: { bg: '#fee2e2', color: '#dc2626' },
};

export default function AdoptionRequests() {
  const { token } = useAuth();
  const { enums } = useEnums();
  const [solicitudes, setSolicitudes] = useState<SolicitudAdopcion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState<EstadoSolicitudAdopcion | 'TODAS'>('TODAS');
  const [busqueda, setBusqueda] = useState('');
  const [expandida, setExpandida] = useState<number | null>(null);
  const [actualizando, setActualizando] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Estados disponibles del backend + opción "Todas"
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

  useEffect(() => { fetchSolicitudes(); }, [fetchSolicitudes]);

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

  const exportarPDF = (s: SolicitudAdopcion) => {
    const { bg, color } = ESTADO_PDF_COLORS[s.estado];
    const filas = Object.entries(s.respuestas ?? {})
      .map(([k, v]) => `<tr><td class="label">${k.replace(/_/g, ' ')}</td><td>${v || '—'}</td></tr>`)
      .join('');

    const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
    <title>Solicitud — ${s.nombreAdoptante}</title>
    <style>
      body { font-family: 'Segoe UI', sans-serif; padding: 40px; color: #111; max-width: 720px; margin: auto; }
      h1 { font-size: 22px; margin-bottom: 4px; }
      .meta { font-size: 13px; color: #555; margin-bottom: 20px; }
      .badge { display:inline-block; padding: 2px 12px; border-radius: 999px; font-size: 12px; font-weight: 600;
        background: ${bg}; color: ${color}; margin-left: 8px; vertical-align: middle; }
      table { width: 100%; border-collapse: collapse; margin-top: 16px; }
      th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: .05em;
        color: #888; padding: 6px 12px; border-bottom: 2px solid #e5e7eb; }
      td { padding: 8px 12px; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
      td.label { color: #6b7280; width: 45%; text-transform: capitalize; }
      .footer { margin-top: 32px; font-size: 11px; color: #aaa; border-top: 1px solid #e5e7eb; padding-top: 12px; }
    </style></head><body>
    <h1>${s.nombreAdoptante} <span class="badge">${formatEnum(s.estado)}</span></h1>
    <div class="meta">
      ${s.email} &nbsp;·&nbsp; ${s.dni} &nbsp;·&nbsp; ${s.telefono}
      ${s.animalNombre ? `&nbsp;·&nbsp; Animal: <strong>${s.animalNombre}</strong>` : ''}
      ${s.fechaSolicitud ? `&nbsp;·&nbsp; ${new Date(s.fechaSolicitud).toLocaleDateString('es-ES')}` : ''}
    </div>
    <table>
      <thead><tr><th>Pregunta</th><th>Respuesta</th></tr></thead>
      <tbody>${filas || '<tr><td colspan="2" style="color:#aaa">Sin respuestas registradas.</td></tr>'}</tbody>
    </table>
    <div class="footer">Generado el ${new Date().toLocaleDateString('es-ES')} · VidAnimal</div>
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
      {/* Header */}
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

      {/* Filtros */}
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

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Contenido */}
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
          {solicitudesFiltradas.map(s => (
            <div key={s.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              {/* Fila principal */}
              <div className="flex items-center gap-4 px-5 py-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-gray-900 text-sm">{s.nombreAdoptante}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ESTADO_COLORS[s.estado]}`}>
                      {formatEnum(s.estado)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {s.email} · {s.dni}
                    {s.animalNombre && <> · Animal: <strong>{s.animalNombre}</strong></>}
                    {s.fechaSolicitud && <> · {new Date(s.fechaSolicitud).toLocaleDateString('es-ES')}</>}
                  </p>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {s.estado === 'PENDIENTE' && (
                    <>
                      <button
                        onClick={() => cambiarEstado(s.id, 'ACEPTADA')}
                        disabled={actualizando === s.id}
                        title="Aceptar"
                        className="p-2 rounded-xl text-green-600 hover:bg-green-50 transition-colors disabled:opacity-50"
                      >
                        {actualizando === s.id
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <CheckCircle className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => cambiarEstado(s.id, 'RECHAZADA')}
                        disabled={actualizando === s.id}
                        title="Rechazar"
                        className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {s.estado !== 'PENDIENTE' && (
                    <span className="p-2">
                      <Clock className="w-4 h-4 text-gray-300" />
                    </span>
                  )}
                  <button
                    onClick={() => setExpandida(expandida === s.id ? null : s.id)}
                    className="p-2 rounded-xl text-gray-400 hover:bg-gray-50 transition-colors"
                    title="Ver respuestas"
                  >
                    {expandida === s.id
                      ? <ChevronUp className="w-4 h-4" />
                      : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Respuestas expandidas */}
              {expandida === s.id && (
                <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Respuestas del cuestionario</p>
                    <button
                      onClick={() => exportarPDF(s)}
                      title="Exportar PDF"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white rounded-lg transition-opacity hover:opacity-90"
                      style={{ backgroundColor: '#547792' }}
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      Exportar PDF
                    </button>
                  </div>
                  {s.respuestas && Object.keys(s.respuestas).length > 0 ? (
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.entries(s.respuestas).map(([pregunta, respuesta]) => (
                        <div key={pregunta}>
                          <dt className="text-xs text-gray-500 capitalize">{pregunta.replace(/_/g, ' ')}</dt>
                          <dd className="text-sm text-gray-800 font-medium mt-0.5">{respuesta || '—'}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : (
                    <p className="text-sm text-gray-400">Sin respuestas registradas.</p>
                  )}
                  <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-2 gap-3">
                    <div>
                      <dt className="text-xs text-gray-500">Teléfono</dt>
                      <dd className="text-sm text-gray-800 font-medium">{s.telefono}</dd>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
