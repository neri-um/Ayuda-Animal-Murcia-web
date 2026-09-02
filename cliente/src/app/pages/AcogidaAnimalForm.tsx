import { useParams, Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Heart, Send, Loader2, Home } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { toSlug } from '../utils/slug';
import type { SolicitudAcogidaRequest } from '../types/acogida';
import { crearSolicitudAcogida } from '../services/acogidas';
import { API_BASE as BASE } from '../services/api';

interface PreguntaRaw {
  id: string;
  pregunta: string;
  tipo: string;
  obligatoria: boolean;
  placeholder?: string;
  opciones?: { value: string; label: string }[];
}

interface SeccionFormulario {
  nro: number;
  titulo: string;
  descripcion?: string;
  preguntas: PreguntaRaw[];
}

function mapTipo(tipo: string, tieneOpciones: boolean): string {
  if (!tieneOpciones && (tipo === 'selection' || tipo === 'multiple_choice')) return 'text';
  switch (tipo) {
    case 'paragraph': return 'textarea';
    case 'selection': return 'select';
    case 'multiple_choice': return 'radio';
    default: return tipo;
  }
}

function extraerSecciones(raw: any, tituloFormulario?: string): SeccionFormulario[] {
  const tituloCuestionario = raw?.formulario?.titulo ?? raw?.titulo ?? tituloFormulario ?? 'Cuestionario';
  const normalizarPreguntas = (preguntas: any[]) =>
    preguntas
      .map((p: any, i: number) => ({
        ...p,
        pregunta: (p.pregunta ?? '').replace(/^\s*\d+\s*[.-]+\s*/, `${i + 1}.- `),
      }));
  const secciones: any[] | undefined = raw?.formulario?.secciones ?? raw?.secciones;
  if (secciones && Array.isArray(secciones)) {
    return secciones
      .map((s: any) => ({
        nro: s.nro,
        titulo: s.titulo ?? '',
        descripcion: s.descripcion,
        preguntas: normalizarPreguntas(s.preguntas ?? []),
      }))
      .filter(s => s.preguntas.length > 0);
  }
  const preguntasPlanas: any[] | undefined = raw?.formulario?.preguntas ?? raw?.preguntas;
  if (preguntasPlanas && Array.isArray(preguntasPlanas)) {
    const preguntas = normalizarPreguntas(preguntasPlanas);
    if (preguntas.length === 0) return [];
    return [{ nro: 1, titulo: tituloCuestionario, descripcion: undefined, preguntas }];
  }
  if (Array.isArray(raw)) {
    const preguntas = normalizarPreguntas(raw);
    if (preguntas.length === 0) return [];
    return [{ nro: 1, titulo: tituloCuestionario, descripcion: undefined, preguntas }];
  }
  return [];
}

function formatEspecie(species: string): string {
  const map: Record<string, string> = { PERRO: 'Perro', GATO: 'Gato', CONEJO: 'Conejo', AVE: 'Ave', REPTIL: 'Reptil', OTRO: 'Otro' };
  return map[species] ?? species.charAt(0) + species.slice(1).toLowerCase();
}

export default function AcogidaAnimalForm() {
  const { id } = useParams<{ id: string }>();
  const { animals } = useApp();
  const navigate = useNavigate();

  const [secciones, setSecciones] = useState<SeccionFormulario[]>([]);
  const [nombreFormulario, setNombreFormulario] = useState<string>('Cuestionario de acogida');
  const [loadingForm, setLoadingForm] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [personal, setPersonal] = useState({ name: '', email: '', phone: '', dni: '' });
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const [acepta, setAcepta] = useState(false);

  const animal = animals.find(a => toSlug(a.name) === id || String(a.id) === id);

  usePageMeta({
    title: animal
      ? `Solicitud de acogida de ${animal.name} | Ayuda Animal Murcia`
      : 'Solicitud de acogida | Ayuda Animal Murcia',
    description: animal
      ? `Formulario para acoger temporalmente a ${animal.name}, ${formatEspecie(animal.species)}.`
      : 'Formulario de solicitud de casa de acogida de Ayuda Animal Murcia.',
    path: `/acogida/${id ?? ''}`,
  });

  useEffect(() => {
    if (!animal) {
      if (animals.length > 0) setLoadingForm(false);
      return;
    }
    setLoadingForm(true);
    fetch(`${BASE}/formularios/acogida`)
      .then(res => {
        if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        const lista = Array.isArray(data) ? data : [];
        const generico = lista.find((f: any) => !f.especie)
          ?? lista.find((f: any) => f.especie === animal.species)
          ?? lista[0];
        if (!generico) {
          setSecciones([]);
          return;
        }
        const nombre = generico.nombre ?? 'Cuestionario de acogida';
        setNombreFormulario(nombre);
        const rawPreguntas = typeof generico.preguntas === 'string'
          ? JSON.parse(generico.preguntas ?? '{}')
          : generico.preguntas ?? {};
        setSecciones(extraerSecciones(rawPreguntas, nombre));
      })
      .catch(() => setSecciones([]))
      .finally(() => setLoadingForm(false));
  }, [id, animal?.id, animals.length]);

  if (!animal) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🐾</div>
        <h2 className="text-gray-700 mb-4">Animal no encontrado</h2>
        <Link to="/" className="inline-block text-sm px-6 py-2 rounded-xl transition-all hover:opacity-80" style={{ backgroundColor: '#f7e3b0', color: '#2e2e2e', fontWeight: 600 }}>
          Volver al inicio
        </Link>
      </div>
    );
  }

  const updatePersonal = (field: string, value: string) =>
    setPersonal(prev => ({ ...prev, [field]: value }));

  const updateRespuesta = (preguntaId: string, value: string) =>
    setRespuestas(prev => ({ ...prev, [preguntaId]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload: SolicitudAcogidaRequest = {
        animalId: Number(animal.id),
        nombreAcogida: personal.name,
        email: personal.email,
        telefono: personal.phone,
        dni: personal.dni,
        respuestas,
      };
      await crearSolicitudAcogida(payload);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError('No se pudo enviar la solicitud. Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#f7e3b0' }}>
          <CheckCircle className="w-10 h-10" style={{ color: '#2e2e2e' }} />
        </div>
        <h2 className="text-gray-900 mb-3">¡Solicitud enviada con éxito!</h2>
        <p className="text-gray-600 mb-2">
          Gracias, <strong>{personal.name}</strong>. Hemos recibido tu solicitud para acoger a <strong>{animal.name}</strong>.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          Nuestro equipo revisará tu cuestionario y se pondrá en contacto contigo lo antes posible <strong>{personal.email}</strong>.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="inline-block text-sm px-6 py-3 rounded-xl transition-all hover:opacity-80" style={{ backgroundColor: '#f7e3b0', color: '#2e2e2e', fontWeight: 600 }}>
            Ver más animales
          </Link>
          <Link to={`/animales/${toSlug(animal.name)}`} className="border border-gray-200 text-gray-600 px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm">
            Volver a la ficha
          </Link>
        </div>
      </div>
    );
  }

  const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.currentTarget.style.borderColor = '#547792');
  const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.currentTarget.style.borderColor = '#e5e7eb');

  const baseClass = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none';

  const renderCampo = (p: PreguntaRaw) => {
    const val = respuestas[p.id] ?? '';
    const onChange = (v: string) => updateRespuesta(p.id, v);
    const tipo = mapTipo(p.tipo, !!(p.opciones && p.opciones.length > 0));
    switch (tipo) {
      case 'select':
        return (
          <select value={val} onChange={e => onChange(e.target.value)} required={p.obligatoria}
            className={baseClass} onFocus={focusStyle} onBlur={blurStyle}>
            <option value="">Selecciona una opción</option>
            {(p.opciones ?? []).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        );
      case 'radio':
        return (
          <div className="flex flex-col gap-2">
            {(p.opciones ?? []).map(o => (
              <label key={o.value} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="radio" name={p.id} value={o.value} checked={val === o.value}
                  onChange={() => onChange(o.value)} required={p.obligatoria}
                  style={{ accentColor: '#547792' }} />
                {o.label}
              </label>
            ))}
          </div>
        );
      case 'textarea':
        return (
          <textarea value={val} onChange={e => onChange(e.target.value)} required={p.obligatoria}
            placeholder={p.placeholder} rows={4} className={`${baseClass} resize-none`}
            onFocus={focusStyle} onBlur={blurStyle} />
        );
      default:
        return (
          <input type={tipo} value={val} onChange={e => onChange(e.target.value)}
            required={p.obligatoria} placeholder={p.placeholder} className={baseClass}
            onFocus={focusStyle} onBlur={blurStyle} />
        );
    }
  };

  const datosPersonalesSection = (
    <section className="bg-white rounded-2xl border border-gray-100 p-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-5 pb-3 border-b border-gray-100">Datos personales</p>
      <div className="flex flex-col gap-4">
        {[
          { label: 'Nombre completo *', field: 'name', type: 'text', placeholder: 'María García López' },
          { label: 'DNI/NIE *', field: 'dni', type: 'text', placeholder: '12345678A' },
          { label: 'Email *', field: 'email', type: 'email', placeholder: 'maria@ejemplo.com' },
          { label: 'Teléfono *', field: 'phone', type: 'tel', placeholder: '612 345 678' },
        ].map(({ label, field, type, placeholder }) => (
          <div key={field}>
            <label className="block text-sm text-gray-700 mb-1">{label}</label>
            <input type={type} value={(personal as any)[field]}
              onChange={e => updatePersonal(field, e.target.value)}
              placeholder={placeholder} required
              className={baseClass} onFocus={focusStyle} onBlur={blurStyle} />
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm transition-colors">
        <ArrowLeft className="w-4 h-4" /> Volver a la ficha
      </button>

      <div className="rounded-2xl p-6 mb-8 flex items-center gap-5 border"
        style={{ backgroundColor: '#f0e8d0', borderColor: '#d9d0b8' }}>
        <img src={animal.imageUrl} alt={animal.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Home className="w-4 h-4" style={{ color: '#547792' }} />
            <span className="text-sm" style={{ color: '#2e2e2e' }}>Formulario de acogida</span>
          </div>
          <h2 className="text-gray-900">Acoger a {animal.name}</h2>
          <p className="text-gray-500 text-sm mt-0.5">{formatEspecie(animal.species)}{animal.breed ? ` · ${animal.breed}` : ''}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {loadingForm ? (
          <div className="flex items-center justify-center py-12 text-gray-400 gap-3">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Cargando cuestionario...</span>
          </div>
        ) : secciones.length > 0 ? (
          secciones.map((seccion, idx) => (
            <div key={seccion.nro} className="space-y-6">
              <section className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-100">
                  <span className="text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: '#f7e3b0', color: '#2e2e2e' }}>
                    {seccion.titulo}
                  </span>
                </div>
                {seccion.descripcion && <p className="text-sm text-gray-500 mb-4">{seccion.descripcion}</p>}
                <div className="flex flex-col gap-4">
                  {seccion.preguntas.map(p => (
                    <div key={p.id}>
                      <label className="block text-sm text-gray-700 mb-1">
                        {p.pregunta}{p.obligatoria ? ' *' : ''}
                      </label>
                      {renderCampo(p)}
                    </div>
                  ))}
                </div>
              </section>
              {idx === 0 && datosPersonalesSection}
            </div>
          ))
        ) : (
          datosPersonalesSection
        )}

        <section className="bg-white rounded-2xl border border-gray-100 p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-3 pb-3 border-b border-gray-100">Protección de datos</p>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={acepta} onChange={e => setAcepta(e.target.checked)}
              className="mt-0.5 w-4 h-4" style={{ accentColor: '#547792' }} />
            <span className="text-sm text-gray-700">
              He leído y acepto la cláusula de protección de datos y el tratamiento de mi información para gestionar esta solicitud de acogida.
            </span>
          </label>
        </section>

        {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 border border-red-200">{error}</p>}

        <button type="submit" disabled={submitting || !acepta}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl transition-all hover:opacity-80 disabled:opacity-50"
          style={{ backgroundColor: '#f7e3b0', color: '#2e2e2e', fontWeight: 600 }}>
          {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          {submitting ? 'Enviando...' : 'Enviar solicitud de acogida'}
        </button>
      </form>
    </div>
  );
}
