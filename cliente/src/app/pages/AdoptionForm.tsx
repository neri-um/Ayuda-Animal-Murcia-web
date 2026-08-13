import { useParams, Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Heart, Send, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { usePageMeta } from '../hooks/usePageMeta';
import type { SolicitudAdopcionRequest } from '../types/adoption';
import { toSlug } from '../utils/slug';

import { API_BASE as BASE } from '../services/api';

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
  const tituloCuestionario = raw?.formulario?.titulo ?? raw?.titulo ?? tituloFormulario ?? 'Cuestionario';
  const esDatosPersonales = (t: string) => t.trim().toLowerCase() === 'datos personales';
  const normalizarPreguntas = (preguntas: any[]) =>
    preguntas
      .filter((p: any) => !IDS_PERSONALES.has(p.id))
      .map((p: any, i: number) => ({
        ...p,
        pregunta: (p.pregunta ?? '').replace(/^\s*\d+\s*[.-]+\s*/, `${i + 1}.- `),
      }));
  const secciones: any[] | undefined = raw?.formulario?.secciones ?? raw?.secciones;
  if (secciones && Array.isArray(secciones)) {
    return secciones
      .map((s: any) => ({
        nro: s.nro,
        titulo: esDatosPersonales(s.titulo ?? '') ? tituloCuestionario : (s.titulo ?? ''),
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

function CondicionesDeAdopcion() {
  return (
    <div className="space-y-4 text-sm text-gray-700">
      <p>
        Nuestras adopciones tienen una serie de condiciones, que así se han consensuado para asegurar lo máximo posible el bienestar de los animales que damos en adopción y que son nuestra responsabilidad 🐶🐱.
      </p>
      <p>
        En primer lugar, pasamos un cuestionario para ver cómo es la familia 👨‍👩‍👧‍👦 que desea adoptar al animal, hacemos visita previa si hace falta y en última instancia nosotros decidimos qué familia es la más indicada para el animal.
      </p>
      <p className="font-semibold" style={{ color: '#2e2e2e' }}>
        Por otro lado, los animales se entregan:
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Desparasitación (interna y externa).</li>
        <li>Microchip y pasaporte.</li>
        <li>
          Vacunación completa (según edad):
          <ul className="list-disc pl-5 mt-1 space-y-0.5">
            <li>Perros adultos: 1 dosis de rabia y 2 dosis de polivalente.</li>
            <li>Perros cachorros: 3 dosis de polivalente.</li>
            <li>Gatos adultos: 2 dosis de trivalente.</li>
            <li>Gatos cachorros: 2 dosis de polivalente.</li>
          </ul>
        </li>
        <li>
          Test de enfermedades:
          <ul className="list-disc pl-5 mt-1 space-y-0.5">
            <li>Perros adultos: test de leishmania.</li>
            <li>Gatos y gatitos: test de inmunodeficiencia (VIF) y leucemia (FeLV).</li>
          </ul>
        </li>
        <li>
          Esterilización: todos nuestros animales adultos se entregan esterilizados. Los cachorros que aún no tienen la edad se entregan con un contrato de compromiso de esterilización, que se deberá realizar obligatoriamente en nuestra clínica veterinaria asociada cuando el animal alcance la edad adecuada (coste ya incluido en la tasa).
        </li>
      </ul>
      <p className="font-semibold" style={{ color: '#2e2e2e' }}>
        Parte de estos gastos veterinarios los debe abonar el adoptante, por medio de una tasa de:
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>🐈 En el caso de gatos, 180 €.</li>
        <li>🐕 En el caso de perros, 200 €.</li>
      </ul>
      <p>Ya que una persona que adopta debe entender y comprender el gasto que conlleva un animal ❤.</p>
    </div>
  );
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
  const [condicionesAceptadas, setCondicionesAceptadas] = useState(false);
  const [aceptaCondiciones, setAceptaCondiciones] = useState(false);

const animal = animals.find(
  a => toSlug(a.name) === id || String(a.id) === id
);

usePageMeta({
  title: animal ? `Solicitud de adopción de ${animal.name} | Ayuda Animal Murcia` : 'Solicitud de adopción | Ayuda Animal Murcia',
  description: animal
    ? `Formulario para adoptar a ${animal.name}, ${formatEspecie(animal.species)}${animal.breed ? ` ${animal.breed}` : ''}. Cuéntanos quién eres y por qué quieres adoptar.`
    : 'Formulario de solicitud de adopción de Ayuda Animal Murcia.',
  path: `/adopcion/${id ?? ''}`,
});

useEffect(() => {
  if (!id || !animal) {
    if (animals.length > 0) {
      setLoadingForm(false);
    }
    return;
  }

  setLoadingForm(true);

  fetch(`${BASE}/adopciones/formulario/${animal.id}`)
    .then(res => {
      if (!res.ok) {
        throw new Error(`Error HTTP ${res.status}`);
      }

      return res.json();
    })
    .then(data => {
      const nombre = data.nombre ?? 'Cuestionario de adopción';

      setNombreFormulario(nombre);

      const rawPreguntas = typeof data.preguntas === 'string'
        ? JSON.parse(data.preguntas ?? '{}')
        : data.preguntas ?? {};

      setSecciones(extraerSecciones(rawPreguntas, nombre));
    })
    .catch(() => {
      setSecciones([]);
    })
    .finally(() => {
      setLoadingForm(false);
    });
}, [id, animal?.id, animals.length]);

  if (!animal) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🐾</div>
        <h2 className="text-gray-700 mb-4">Animal no encontrado</h2>
        <Link to="/" className="inline-block text-sm px-6 py-2 rounded-xl transition-all hover:opacity-80"
          style={{ backgroundColor: '#f7e3b0', color: '#2e2e2e', fontWeight: 600 }}>
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
        <Link to="/" className="inline-block text-sm px-6 py-2 rounded-xl transition-all hover:opacity-80"
          style={{ backgroundColor: '#f7e3b0', color: '#2e2e2e', fontWeight: 600 }}>
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
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: '#f7e3b0' }}>
          <CheckCircle className="w-10 h-10" style={{ color: '#2e2e2e' }} />
        </div>
        <h2 className="text-gray-900 mb-3">¡Solicitud enviada con éxito!</h2>
        <p className="text-gray-600 mb-2">
          Gracias, <strong>{personal.name}</strong>. Hemos recibido tu solicitud de adopción para <strong>{animal.name}</strong>.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          Nuestro equipo revisará tu formulario y se pondrá en contacto contigo lo antes posible <strong>{personal.email}</strong>.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="inline-block text-sm px-6 py-3 rounded-xl transition-all hover:opacity-80"
            style={{ backgroundColor: '#f7e3b0', color: '#2e2e2e', fontWeight: 600 }}>
            Ver más animales
          </Link>
         <Link to={`/animales/${toSlug(animal.name)}`}
            className="border border-gray-200 text-gray-600 px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm">
            Volver a la ficha
          </Link>
        </div>
      </div>
    );
  }

  const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.currentTarget.style.borderColor = '#2e2e2e');
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
                  style={{ accentColor: '#2e2e2e' }} />
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

  const sectionBadge = (titulo: string) => (
    <span className="text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full"
      style={{ backgroundColor: '#f7e3b0', color: '#2e2e2e' }}>
      {titulo}
    </span>
  );

  const datosPersonalesSection = (
    <section className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-100">
        {sectionBadge('Datos personales')}
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
              className={baseClass}
              onFocus={focusStyle} onBlur={blurStyle} />
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {!condicionesAceptadas && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5" style={{ color: '#e8a020' }} />
              <h2 className="text-lg font-bold uppercase tracking-wide" style={{ color: '#2e2e2e' }}>
                Condiciones de adopción
              </h2>
            </div>
            <CondicionesDeAdopcion />
            <label
              className="flex items-start gap-3 cursor-pointer rounded-xl border p-4 transition-colors"
              style={{
                borderColor: aceptaCondiciones ? '#547792' : '#e5e7eb',
                backgroundColor: aceptaCondiciones ? '#f4f8fa' : '#fafafa',
              }}
            >
              <input
                type="checkbox"
                checked={aceptaCondiciones}
                onChange={e => setAceptaCondiciones(e.target.checked)}
                className="mt-0.5 w-4 h-4"
                style={{ accentColor: '#547792' }}
              />
              <span className="text-sm text-gray-700">
                He leído y acepto las condiciones de adopción, y entiendo que la decisión final corresponde a la asociación.
              </span>
            </label>
            <button
              onClick={() => setCondicionesAceptadas(true)}
              disabled={!aceptaCondiciones}
              className="w-full py-3 rounded-xl transition-all hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#f7e3b0', color: '#2e2e2e', fontWeight: 600 }}
            >
              Aceptar y continuar
            </button>
            <button
              onClick={() => navigate(-1)}
              className="w-full text-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Volver a la ficha
            </button>
          </div>
        </div>
      )}

      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm transition-colors">
        <ArrowLeft className="w-4 h-4" /> Volver a la ficha
      </button>

      <div className="rounded-2xl p-6 mb-8 flex items-center gap-5 border"
        style={{ backgroundColor: '#f0e8d0', borderColor: '#d9d0b8' }}>
        <img src={animal.imageUrl} alt={animal.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-4 h-4" style={{ color: '#e8a020' }} />
            <span className="text-sm" style={{ color: '#2e2e2e' }}>Formulario de adopción</span>
          </div>
          <h2 className="text-gray-900">Adoptar a {animal.name}</h2>
          <p className="text-gray-500 text-sm mt-0.5">
            {formatEspecie(animal.species)} · {calcAge(animal.birthDate)}
          </p>
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
                  {sectionBadge(seccion.titulo)}
                </div>
                {seccion.descripcion && (
                  <p className="text-sm text-gray-500 mb-4">{seccion.descripcion}</p>
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
              {idx === 0 && datosPersonalesSection}
            </div>
          ))
        ) : (
          datosPersonalesSection
        )}

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 border border-red-200">{error}</p>
        )}

        <button type="submit" disabled={submitting}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl transition-all hover:opacity-80 disabled:opacity-50"
          style={{ backgroundColor: '#f7e3b0', color: '#2e2e2e', fontWeight: 600 }}>
          {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          {submitting ? 'Enviando...' : 'Enviar solicitud de adopción'}
        </button>
      </form>
    </div>
  );
}
