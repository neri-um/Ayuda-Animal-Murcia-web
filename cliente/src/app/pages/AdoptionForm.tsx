import { useParams, Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Heart, Send, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { SolicitudAdopcionRequest } from '../types/adoption';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/vidanimal';

// IDs que ya recoge el bloque fijo de datos personales
const IDS_PERSONALES = new Set(['email_usuario', 'nombre_apellidos', 'dni_nif', 'telefonos']);

function calcAge(birthDate?: string | null): string {
  if (!birthDate) return 'Desconocida';
  const diff = Date.now() - new Date(birthDate).getTime();
  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44));
  if (months <= 0) return 'Recién llegado';
  if (months < 12) return `${months} ${months === 1 ? 'mes' : 'meses'}`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (rem === 0) return `${years} ${years === 1 ? 'año' : 'años'}`;
  return `${years} ${years === 1 ? 'año' : 'años'} y ${rem} ${rem === 1 ? 'mes' : 'meses'}`;
}

function formatEspecie(species: string): string {
  const map: Record<string, string> = {
    PERRO: 'Perro', GATO: 'Gato', CONEJO: 'Conejo',
    AVE: 'Ave', REPTIL: 'Reptil', OTRO: 'Otro',
  };
  return map[species] ?? species.charAt(0) + species.slice(1).toLowerCase();
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

function extraerSecciones(raw: any, tituloFormulario?: string): SeccionFormulario[] {
  const secciones: any[] | undefined =
    raw?.formulario?.secciones ?? raw?.secciones;

  if (secciones && Array.isArray(secciones)) {
    return secciones.map((s: any) => ({
      nro: s.nro,
      titulo: s.titulo ?? '',
      descripcion: s.descripcion,
      preguntas: (s.preguntas ?? []).filter((p: any) => !IDS_PERSONALES.has(p.id)),
    })).filter(s => s.preguntas.length > 0);
  }

  const preguntasPlanas: any[] | undefined =
    raw?.formulario?.preguntas ?? raw?.preguntas;

  if (preguntasPlanas && Array.isArray(preguntasPlanas)) {
    const preguntas = preguntasPlanas.filter((p: any) => !IDS_PERSONALES.has(p.id));
    if (preguntas.length === 0) return [];
    return [{
      nro: 1,
      titulo: raw?.formulario?.titulo ?? tituloFormulario ?? 'Cuestionario',
      descripcion: undefined,
      preguntas,
    }];
  }

  if (Array.isArray(raw)) {
    const preguntas = raw.filter((p: any) => !IDS_PERSONALES.has(p.id));
    if (preguntas.length === 0) return [];
    return [{
      nro: 1,
      titulo: tituloFormulario ?? 'Cuestionario',
      descripcion: undefined,
      preguntas,
    }];
  }

  return [];
}

export default function AdoptionForm() {
  const { id } = useParams<{ id: string }>();
  const { animals } = useApp();
  const navigate = useNavigate();

  const [secciones, setSecciones] = useState<SeccionFormulario[]>([]);
  const [nombreFormulario, setNombreFormulario] = useState<string>('');
  const [loadingForm, setLoadingForm] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [personal, setPersonal] = useState({ name: '', email: '', phone: '', dni: '' });
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});

  const animal = animals.find(a => a.id === id);

  useEffect(() => {
    if (!id) return;
    setLoadingForm(true);
    fetch(`${BASE}/adopciones/formulario/${id}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        console.log('[AdoptionForm] DATA completa:', data);
        if (data) {
          const nombre = data.nombre ?? 'Cuestionario de adopción';
          setNombreFormulario(nombre);
          const rawPreguntas =
            typeof data.preguntas === 'string'
              ? JSON.parse(data.preguntas ?? '{}')
              : data.preguntas ?? {};
          console.log('[AdoptionForm] rawPreguntas:', rawPreguntas);
          const secs = extraerSecciones(rawPreguntas, nombre);
          console.log('[AdoptionForm] secciones resultado:', secs);
          setSecciones(secs);
        }
      })
      .catch(err => { console.error('[AdoptionForm] ERROR fetch:', err); setSecciones([]); })
      .finally(() => setLoadingForm(false));
  }, [id]);

  if (!animal) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🐾</div>
        <h2 className="text-gray-700 mb-4">Animal no encontrado</h2>
        <Link to="/" className="text-white px-6 py-2 rounded-xl transition-colors" style={{ backgroundColor: '#547792' }}>
          Volver al inicio
        </Link>
      </div>
    );
  }

  if (animal.status !== 'EN_ADOPCION') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">😔</div>
        <h2 className="text-gray-700 mb-2">Este animal no está disponible</h2>
        <p className="text-gray-500 mb-6 text-sm">Solo puedes solicitar la adopción de animales en estado «En adopción».</p>
        <Link to="/" className="text-white px-6 py-2 rounded-xl transition-colors" style={{ backgroundColor: '#547792' }}>
          Ver otros animales
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
      const payload: SolicitudAdopcionRequest = {
        animalId: Number(animal.id),
        nombreAdoptante: personal.name,
        email: personal.email,
        telefono: personal.phone,
        dni: personal.dni,
        respuestas,
      };
      const res = await fetch(`${BASE}/adopciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Error al enviar la solicitud');
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError('No se pudo enviar la solicitud. Inténtalo de nuevo.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#dce8ed' }}>
          <CheckCircle className="w-10 h-10" style={{ color: '#547792' }} />
        </div>
        <h2 className="text-gray-900 mb-3">¡Solicitud enviada con éxito!</h2>
        <p className="text-gray-600 mb-2">
          Gracias, <strong>{personal.name}</strong>. Hemos recibido tu solicitud de adopción para <strong>{animal.name}</strong>.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          Nuestro equipo revisará tu formulario y se pondrá en contacto contigo en los próximos 2 días hábiles en el email <strong>{personal.email}</strong>.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="text-white px-6 py-3 rounded-xl transition-colors" style={{ backgroundColor: '#547792' }}>
            Ver más animales
          </Link>
          <Link to={`/animals/${animal.id}`} className="border border-gray-200 text-gray-600 px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors">
            Volver a la ficha
          </Link>
        </div>
      </div>
    );
  }

  const renderCampo = (p: PreguntaRaw) => {
    const baseClass = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none';
    const val = respuestas[p.id] ?? '';
    const onChange = (v: string) => updateRespuesta(p.id, v);
    const tipo = mapTipo(p.tipo, !!(p.opciones && p.opciones.length > 0));

    switch (tipo) {
      case 'select':
        return (
          <select value={val} onChange={e => onChange(e.target.value)} required={p.obligatoria} className={baseClass}
            onFocus={e => (e.currentTarget.style.borderColor = '#547792')}
            onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}>
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
            onFocus={e => (e.currentTarget.style.borderColor = '#547792')}
            onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')} />
        );
      default:
        return (
          <input type={tipo} value={val} onChange={e => onChange(e.target.value)}
            required={p.obligatoria} placeholder={p.placeholder} className={baseClass}
            onFocus={e => (e.currentTarget.style.borderColor = '#547792')}
            onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')} />
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm transition-colors">
        <ArrowLeft className="w-4 h-4" /> Volver a la ficha
      </button>

      {/* Header */}
      <div className="rounded-2xl p-6 mb-8 flex items-center gap-5 border" style={{ backgroundColor: '#dce8ed', borderColor: '#b5cdd8' }}>
        <img src={animal.imageUrl} alt={animal.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-4 h-4" style={{ color: '#547792', fill: '#547792' }} />
            <span className="text-sm" style={{ color: '#213448' }}>Formulario de adopción</span>
          </div>
          <h2 className="text-gray-900">Adoptar a {animal.name}</h2>
          <p className="text-gray-500 text-sm mt-0.5">
            {formatEspecie(animal.species)} · {calcAge(animal.birthDate)}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Datos personales fijos */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-100">
            <span className="text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: '#547792' }}>Datos personales</span>
          </div>
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
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                  onFocus={e => (e.currentTarget.style.borderColor = '#547792')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')} />
              </div>
            ))}
          </div>
        </section>

        {/* Secciones dinámicas */}
        {loadingForm ? (
          <div className="flex items-center justify-center py-12 text-gray-400 gap-3">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Cargando cuestionario...</span>
          </div>
        ) : secciones.length > 0 ? (
          <>
            {secciones.map(seccion => (
              <section key={seccion.nro} className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-100">
                  <span className="text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: '#547792' }}>
                    {seccion.titulo}
                  </span>
                </div>
                {seccion.descripcion && (
                  <p className="text-xs text-gray-500 mb-4 leading-relaxed">{seccion.descripcion}</p>
                )}
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
            ))}
          </>
        ) : null}

        {/* Términos */}
        <div className="flex items-start gap-3 rounded-xl p-4" style={{ backgroundColor: '#dce8ed' }}>
          <input type="checkbox" id="terms" required style={{ marginTop: '4px', accentColor: '#547792' }} />
          <label htmlFor="terms" className="text-sm text-gray-600" style={{ fontWeight: 400 }}>
            Confirmo que la información proporcionada es veraz y acepto que la protectora Vidanimal
            realice las comprobaciones necesarias para garantizar el bienestar del animal.
          </label>
        </div>

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <button type="submit" disabled={submitting}
          className="w-full flex items-center justify-center gap-2 text-white py-4 rounded-xl transition-colors disabled:opacity-60"
          style={{ backgroundColor: '#547792', fontWeight: 600 }}
          onMouseEnter={e => !submitting && (e.currentTarget.style.backgroundColor = '#3d6180')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#547792')}>
          {submitting
            ? <><Loader2 className="w-5 h-5 animate-spin" /> Enviando...</>
            : <><Send className="w-5 h-5" /> Enviar solicitud de adopción</>}
        </button>
      </form>
    </div>
  );
}