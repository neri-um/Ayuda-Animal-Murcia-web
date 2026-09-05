import { useState, useEffect, useCallback } from 'react';
import { Plus, FileText, Trash2, Loader2, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AppContext';
import type { FormularioAdopcionAdmin } from '../../types/adoption';

import { API_BASE as BASE, leerMensajeError } from '../../services/api';

const ESPECIES = ['PERRO', 'GATO', 'CONEJO', 'AVE', 'REPTIL', 'OTRO'];

const PLANTILLA_PREGUNTAS = JSON.stringify([
  { "id": "vivienda", "label": "¿Tipo de vivienda?", "tipo": "select", "required": true,
    "opciones": [{"value": "piso", "label": "Piso"}, {"value": "casa", "label": "Casa con jardín"}] },
  { "id": "experiencia", "label": "¿Has tenido animales antes?", "tipo": "radio", "required": true,
    "opciones": [{"value": "si", "label": "Sí"}, {"value": "no", "label": "No"}] },
  { "id": "horas_solo", "label": "¿Horas solo al día?", "tipo": "number", "required": true, "placeholder": "Ej: 4" },
  { "id": "motivo", "label": "¿Por qué quieres adoptarlo?", "tipo": "textarea", "required": true, "placeholder": "Cuéntanos tu motivación..." }
], null, 2);

const PLANTILLA_ACOGIDA = JSON.stringify({
  "titulo": "CUESTIONARIO DE CASA DE ACOGIDA",
  "secciones": [
    {
      "nro": 1,
      "titulo": "HOGAR",
      "preguntas": [
        {
          "id": "hogar_tipo_vivienda",
          "pregunta": "1.- Tipo de vivienda",
          "tipo": "select",
          "obligatoria": true,
          "opciones": [
            { "value": "piso", "label": "Piso" },
            { "value": "casa", "label": "Casa" },
            { "value": "adosado", "label": "Adosado" },
            { "value": "otro", "label": "Otro" }
          ]
        },
        {
          "id": "hogar_propiedad",
          "pregunta": "2.- ¿Vivienda propia o de alquiler?",
          "tipo": "select",
          "obligatoria": true,
          "opciones": [
            { "value": "propia", "label": "Propia" },
            { "value": "alquiler", "label": "De alquiler" }
          ]
        },
        {
          "id": "hogar_personas",
          "pregunta": "3.- Número de personas en la vivienda",
          "tipo": "number",
          "obligatoria": true
        },
        {
          "id": "hogar_alguien_en_contra",
          "pregunta": "4.- ¿Hay alguien en contra de acoger un animal?",
          "tipo": "textarea",
          "obligatoria": true
        },
        {
          "id": "hogar_horas_solo",
          "pregunta": "5.- ¿Cuántas horas al día estaría solo el animal?",
          "tipo": "select",
          "obligatoria": true,
          "opciones": [
            { "value": "0-2", "label": "0-2 horas" },
            { "value": "2-4", "label": "2-4 horas" },
            { "value": "4-6", "label": "4-6 horas" },
            { "value": "6-8", "label": "6-8 horas" },
            { "value": "8-9", "label": "8-9 horas" },
            { "value": "9+", "label": "Más de 9 horas" }
          ]
        },
        {
          "id": "hogar_protecciones",
          "pregunta": "6.- ¿Qué tipo de protecciones tiene en ventanas y balcones?",
          "tipo": "textarea",
          "obligatoria": true
        }
      ]
    },
    {
      "nro": 2,
      "titulo": "ANIMALES",
      "preguntas": [
        {
          "id": "otros_animales_en_casa",
          "pregunta": "7.- ¿Tiene otros animales en casa? Descríbalos",
          "tipo": "textarea",
          "obligatoria": true
        },
        {
          "id": "gatos_testados",
          "pregunta": "8.- En caso de tener gatos, ¿están testados de Leucemia/Inmunodeficiencia?",
          "tipo": "select",
          "obligatoria": false,
          "opciones": [
            { "value": "si_negativo", "label": "Sí, con resultado negativo" },
            { "value": "si_positivo", "label": "Sí, con resultado positivo" },
            { "value": "no_testados", "label": "No, no están testados" },
            { "value": "no_aplica", "label": "No tengo gatos" }
          ]
        }
      ]
    },
    {
      "nro": 3,
      "titulo": "ACOGIDA",
      "preguntas": [
        {
          "id": "tiempo_acogida",
          "pregunta": "9.- ¿Cuánto tiempo puede ofrecer como casa de acogida?",
          "tipo": "select",
          "obligatoria": true,
          "opciones": [
            { "value": "indefinido", "label": "Tiempo indefinido (hasta la adopción)" },
            { "value": "temporal", "label": "Temporal (unas semanas)" },
            { "value": "emergencia", "label": "Solo de emergencia" }
          ]
        },
        {
          "id": "tipo_animal_acoger",
          "pregunta": "10.- ¿Qué tipo de animal desea acoger?",
          "tipo": "select",
          "obligatoria": true,
          "opciones": [
            { "value": "gato", "label": "Gato" },
            { "value": "perro", "label": "Perro" },
            { "value": "cualquiera", "label": "Cualquiera" }
          ]
        },
        {
          "id": "animal_concreto",
          "pregunta": "11.- Si desea acoger un animal en concreto, indíquelo aquí",
          "tipo": "text",
          "obligatoria": false,
          "placeholder": "Nombre o referencia del animal"
        }
      ]
    }
  ]
}, null, 2);

type Tab = 'adopcion' | 'acogida';

interface FormularioAcogidaAdmin {
  id?: number;
  nombre: string;
  especie: string | null;
  preguntasRaw: string;
}

export default function FormularioManagement() {
  const { token } = useAuth();
  const [tab, setTab] = useState<Tab>('adopcion');
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [eliminando, setEliminando] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [expandido, setExpandido] = useState<number | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [formulariosAdopcion, setFormulariosAdopcion] = useState<FormularioAdopcionAdmin[]>([]);
  const [formulariosAcogida, setFormulariosAcogida] = useState<FormularioAcogidaAdmin[]>([]);

  const [form, setForm] = useState({
    nombre: '',
    especie: '' as string,
    cachorro: '' as string,
    preguntasRaw: PLANTILLA_PREGUNTAS,
  });

  const fetchFormulariosAdopcion = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${BASE}/formularios`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw await leerMensajeError(res);
      const data = await res.json();
      setFormulariosAdopcion(
        (Array.isArray(data) ? data : []).map((f: any) => ({
          ...f,
          preguntasRaw: f.preguntasRaw
            ?? (f.preguntas != null ? JSON.stringify(f.preguntas, null, 2) : ''),
        }))
      );
    } catch (e: any) {
      setError(e?.message ?? 'No se pudieron cargar los formularios.');
    }
  }, [token]);

  const fetchFormulariosAcogida = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${BASE}/formularios/acogida`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw await leerMensajeError(res);
      const data = await res.json();
      setFormulariosAcogida(
        (Array.isArray(data) ? data : []).map((f: any) => ({
          ...f,
          preguntasRaw: f.preguntasRaw
            ?? (f.preguntas != null ? JSON.stringify(f.preguntas, null, 2) : ''),
        }))
      );
    } catch (e: any) {
      setError(e?.message ?? 'No se pudieron cargar los formularios de acogida.');
    }
  }, [token]);

  const fetchFormularios = useCallback(async () => {
    setLoading(true);
    setError(null);
    await Promise.all([fetchFormulariosAdopcion(), fetchFormulariosAcogida()]);
    setLoading(false);
  }, [fetchFormulariosAdopcion, fetchFormulariosAcogida]);

  useEffect(() => { fetchFormularios(); }, [fetchFormularios]);

  useEffect(() => {
    setMostrarFormulario(false);
    setExpandido(null);
    setJsonError(null);
    setError(null);
    if (tab === 'adopcion') {
      setForm(f => ({ ...f, preguntasRaw: PLANTILLA_PREGUNTAS, nombre: '', especie: '', cachorro: '' }));
    } else {
      setForm(f => ({ ...f, preguntasRaw: PLANTILLA_ACOGIDA, nombre: '', especie: '', cachorro: '' }));
    }
  }, [tab]);

  const validarJson = (raw: string): boolean => {
    try {
      JSON.parse(raw);
      setJsonError(null);
      return true;
    } catch (e: any) {
      setJsonError(`JSON inválido: ${e.message}`);
      return false;
    }
  };

  const handleSubmitAdopcion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarJson(form.preguntasRaw)) return;
    setGuardando(true);
    setError(null);
    try {
      const payload = {
        nombre: form.nombre,
        especie: form.especie || null,
        cachorro: form.cachorro === '' ? null : form.cachorro === 'true',
        preguntas: JSON.parse(form.preguntasRaw),
      };
      const res = await fetch(`${BASE}/formularios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw await leerMensajeError(res);
      setForm({ nombre: '', especie: '', cachorro: '', preguntasRaw: PLANTILLA_PREGUNTAS });
      setMostrarFormulario(false);
      await fetchFormulariosAdopcion();
    } catch (e: any) {
      setError(e?.message ?? 'No se pudo guardar el formulario.');
    } finally {
      setGuardando(false);
    }
  };

  const handleSubmitAcogida = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarJson(form.preguntasRaw)) return;
    setGuardando(true);
    setError(null);
    try {
      const payload = {
        nombre: form.nombre,
        especie: form.especie || null,
        preguntas: JSON.parse(form.preguntasRaw),
      };
      const res = await fetch(`${BASE}/formularios/acogida`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw await leerMensajeError(res);
      setForm({ nombre: '', especie: '', cachorro: '', preguntasRaw: PLANTILLA_ACOGIDA });
      setMostrarFormulario(false);
      await fetchFormulariosAcogida();
    } catch (e: any) {
      setError(e?.message ?? 'No se pudo guardar el formulario de acogida.');
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminarAdopcion = async (id: number) => {
    if (!window.confirm('¿Seguro que quieres eliminar este formulario?')) return;
    setEliminando(id);
    try {
      const res = await fetch(`${BASE}/formularios/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw await leerMensajeError(res);
      await fetchFormulariosAdopcion();
    } catch (e: any) {
      setError(e?.message ?? 'No se pudo eliminar el formulario.');
    } finally {
      setEliminando(null);
    }
  };

  const handleEliminarAcogida = async (id: number) => {
    if (!window.confirm('¿Seguro que quieres eliminar este formulario de acogida?')) return;
    setEliminando(id);
    try {
      const res = await fetch(`${BASE}/formularios/acogida/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw await leerMensajeError(res);
      await fetchFormulariosAcogida();
    } catch (e: any) {
      setError(e?.message ?? 'No se pudo eliminar el formulario de acogida.');
    } finally {
      setEliminando(null);
    }
  };

  const inputClass = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none';
  const focusStyle = {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      (e.currentTarget.style.borderColor = '#547792'),
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      (e.currentTarget.style.borderColor = '#e5e7eb'),
  };

  const isAcogida = tab === 'acogida';
  const formularios = isAcogida ? formulariosAcogida : formulariosAdopcion;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {isAcogida ? 'Formularios de acogida' : 'Formularios de adopción'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isAcogida
              ? 'Configura el cuestionario de casas de acogida'
              : 'Configura los cuestionarios según especie y edad'}
          </p>
        </div>
        <button
          onClick={() => setMostrarFormulario(v => !v)}
          className="flex items-center gap-2 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          style={{ backgroundColor: '#547792' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#3d6180')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#547792')}
        >
          <Plus className="w-4 h-4" />
          Nuevo formulario
        </button>
      </div>

      <div className="flex gap-2">
        {(['adopcion', 'acogida'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
              tab === t
                ? 'text-white border-transparent'
                : 'bg-white text-gray-500 border-gray-200'
            }`}
            style={tab === t ? { backgroundColor: '#547792' } : {}}
          >
            {t === 'adopcion' ? 'Adopción' : 'Acogida'}
          </button>
        ))}
      </div>

      {mostrarFormulario && (
        <form onSubmit={isAcogida ? handleSubmitAcogida : handleSubmitAdopcion} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
          <h2 className="text-base font-semibold text-gray-800 mb-2">Nuevo formulario {isAcogida ? 'de acogida' : 'de adopción'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Nombre *</label>
              <input
                type="text"
                value={form.nombre}
                onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                placeholder={isAcogida ? 'Ej: Formulario casa de acogida' : 'Ej: Formulario perro adulto'}
                required
                className={inputClass}
                {...focusStyle}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Especie</label>
              <select
                value={form.especie}
                onChange={e => setForm(f => ({ ...f, especie: e.target.value }))}
                className={inputClass}
                {...focusStyle}
              >
                <option value="">Todas las especies (genérico)</option>
                {ESPECIES.map(esp => (
                  <option key={esp} value={esp}>{esp.charAt(0) + esp.slice(1).toLowerCase()}</option>
                ))}
              </select>
            </div>
            {!isAcogida && (
              <div>
                <label className="block text-sm text-gray-700 mb-1">¿Para cachorro?</label>
                <select
                  value={form.cachorro}
                  onChange={e => setForm(f => ({ ...f, cachorro: e.target.value }))}
                  className={inputClass}
                  {...focusStyle}
                >
                  <option value="">Cualquier edad</option>
                  <option value="true">Sí (cachorro)</option>
                  <option value="false">No (adulto)</option>
                </select>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Preguntas (JSON) *</label>
            <textarea
              value={form.preguntasRaw}
              onChange={e => {
                setForm(f => ({ ...f, preguntasRaw: e.target.value }));
                validarJson(e.target.value);
              }}
              rows={12}
              className={`${inputClass} font-mono text-xs resize-y ${jsonError ? 'border-red-400' : ''}`}
              {...focusStyle}
            />
            {jsonError && (
              <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                <AlertCircle className="w-3 h-3" /> {jsonError}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              {isAcogida
                ? 'Estructura con secciones: { "titulo": "...", "secciones": [{ "nro": 1, "titulo": "...", "preguntas": [...] }] }'
                : 'Tipos válidos: text, textarea, select, radio, number, email, tel'}
            </p>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={() => { setMostrarFormulario(false); setJsonError(null); }}
              className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando || !!jsonError}
              className="flex items-center gap-2 px-4 py-2 text-sm text-white rounded-xl transition-colors disabled:opacity-60"
              style={{ backgroundColor: '#547792' }}
              onMouseEnter={e => !guardando && (e.currentTarget.style.backgroundColor = '#3d6180')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#547792')}
            >
              {guardando ? <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</> : 'Guardar formulario'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400 gap-3">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Cargando formularios...</span>
        </div>
      ) : formularios.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FileText className="w-10 h-10 text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm">
            {isAcogida
              ? 'No hay formularios de acogida configurados.'
              : 'No hay formularios configurados todavía.'}
          </p>
          <p className="text-gray-400 text-xs mt-1">Crea uno con el botón «Nuevo formulario».</p>
        </div>
      ) : (
        <div className="space-y-3">
          {formularios.map((f: any, i: number) => (
            <div key={f.id ?? i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="flex items-center gap-4 px-5 py-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm">{f.nombre}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {f.especie ?? 'Todas las especies'}
                    {!isAcogida && (
                      f.cachorro !== null && f.cachorro !== undefined
                        ? f.cachorro ? ' · Cachorro' : ' · Adulto'
                        : ' · Cualquier edad'
                    )}
                  </p>
                </div>
                <button
                  onClick={() => setExpandido(expandido === (f.id ?? i) ? null : (f.id ?? i))}
                  className="p-2 rounded-xl text-gray-400 hover:bg-gray-50 transition-colors"
                  title="Ver preguntas"
                >
                  {expandido === (f.id ?? i)
                    ? <ChevronUp className="w-4 h-4" />
                    : <ChevronDown className="w-4 h-4" />}
                </button>
                {f.id != null && (
                  <button
                    onClick={() => isAcogida ? handleEliminarAcogida(f.id!) : handleEliminarAdopcion(f.id!)}
                    disabled={eliminando === f.id}
                    className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition-colors disabled:opacity-50"
                    title="Eliminar formulario"
                  >
                    {eliminando === f.id
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Trash2 className="w-4 h-4" />}
                  </button>
                )}
              </div>

              {expandido === (f.id ?? i) && (
                <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Preguntas configuradas</p>
                  <pre className="text-xs text-gray-600 font-mono whitespace-pre-wrap break-all bg-white border border-gray-100 rounded-xl p-3">
                    {f.preguntasRaw
                      ? (() => { try { return JSON.stringify(JSON.parse(f.preguntasRaw), null, 2); } catch { return f.preguntasRaw; } })()
                      : '—'}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
