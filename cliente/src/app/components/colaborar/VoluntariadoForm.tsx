import { useState, useEffect } from 'react';
import { Send, AlertCircle, Heart } from 'lucide-react';
import { CampoTexto, PreguntaOpciones } from './campos';
import { Seccion, AceptacionClausula, ExitoFormulario } from './comun';
import { enviarColaboracion, type TipoColaboracion } from '../../services/colaboracion';
import { API_BASE as BASE } from '../../services/api';

export const TAREAS = [
  'Gestionar animales en adopción',
  'Difusión en redes sociales',
  'Transporte de animales (visitas veterinarias, recogidas, etc.)',
  'Ayuda en eventos, recaudación de fondos, mercadillos (...)',
  'Tareas administrativas',
  'Control de colonias felinas (CER)',
  'Acogida temporal',
];

interface PreguntaVol {
  id: string;
  pregunta: string;
  tipo: string;
  obligatoria?: boolean;
  placeholder?: string;
  conOtro?: boolean;
  soloUmu?: boolean;
  opciones?: { value: string; label: string }[];
}

interface SeccionVol {
  nro?: number;
  titulo: string;
  descripcion?: string;
  preguntas: PreguntaVol[];
}

interface SchemaVol {
  titulo?: string;
  descripcion?: string;
  secciones: SeccionVol[];
}

interface Props {
  titulo?: string;
  descripcion?: string;
  tipo?: TipoColaboracion;
  esUmu?: boolean;
  nota?: React.ReactNode;
}

const DEFAULTS = {
  titulo: 'Solicitud de voluntariado',
  descripcion:
    '¡Únete al equipo! Puedes inscribirte rellenando el siguiente cuestionario, te contactaremos lo antes posible.',
};

const textoOpcion = (o: { value: string; label: string }) => o.label ?? o.value;

/**
 * Formulario dinámico: se construye a partir del cuestionario (JSON)
 * configurado desde el dashboard. Los valores se envían indexados por el
 * texto de la pregunta para mantener la compatibilidad con el panel.
 */
function FormularioDinamico({ schema, tipo = 'VOLUNTARIADO', esUmu = false, nota }: Props & { schema: SchemaVol }) {
  const [valores, setValores] = useState<Record<string, string>>({});
  const [acepta, setAcepta] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);

  const visibles = (p: PreguntaVol) => !p.soloUmu || esUmu;
  const set = (id: string) => (v: string) => setValores(prev => ({ ...prev, [id]: v }));

  const reiniciar = () => {
    setValores({});
    setAcepta(false);
    setEnviado(false);
  };

  const renderPregunta = (p: PreguntaVol) => {
    const val = valores[p.id] ?? '';
    const onChange = set(p.id);
    const tipoP = (p.tipo || 'text').toLowerCase();
    const opciones = (p.opciones ?? []).map(o => textoOpcion(o));

    if (tipoP === 'textarea' || tipoP === 'paragraph') {
      return <CampoTexto label={p.pregunta} required={p.obligatoria} multiline placeholder={p.placeholder} value={val} onChange={onChange} />;
    }
    if (tipoP === 'select') {
      return (
        <div>
          <span className="block text-sm mb-1.5" style={{ color: '#2e2e2e', fontWeight: 600 }}>
            {p.pregunta} {p.obligatoria && <span style={{ color: '#b91c1c' }}>*</span>}
          </span>
          <select
            required={p.obligatoria}
            value={val}
            onChange={e => onChange(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none"
          >
            <option value="">Selecciona una opción</option>
            {opciones.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      );
    }
    if (tipoP === 'radio' || tipoP === 'opciones') {
      return <PreguntaOpciones label={p.pregunta} required={p.obligatoria} conOtro={p.conOtro} opciones={opciones} value={val} onChange={onChange} />;
    }
    if (tipoP === 'checkbox' || tipoP === 'multiple' || tipoP === 'multiple_choice') {
      return <PreguntaOpciones label={p.pregunta} required={p.obligatoria} multiple conOtro={p.conOtro} opciones={opciones} value={val} onChange={onChange} />;
    }
    const type = tipoP === 'email' || tipoP === 'tel' || tipoP === 'number' ? tipoP : 'text';
    return <CampoTexto label={p.pregunta} required={p.obligatoria} type={type} placeholder={p.placeholder} value={val} onChange={onChange} />;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const preguntas = schema.secciones.flatMap(s => s.preguntas).filter(visibles);
    for (const p of preguntas) {
      if (p.obligatoria && !(valores[p.id] ?? '').trim()) {
        setError(`Completa este campo: "${p.pregunta}"`);
        return;
      }
    }

    const email = valores['email'] ?? valores['correo'] ?? '';
    if (!email.trim()) {
      setError('Falta un correo de contacto.');
      return;
    }

    const respuestas: Record<string, string> = {};
    for (const p of preguntas) {
      respuestas[p.pregunta] = (valores[p.id] ?? '').trim() || '—';
    }

    setEnviando(true);
    try {
      await enviarColaboracion(tipo, email.trim(), respuestas);
      setEnviado(true);
    } catch (err: any) {
      setError(err?.message ?? 'No se pudo enviar la solicitud. Inténtalo de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  if (enviado) {
    return (
      <ExitoFormulario
        titulo="¡Solicitud enviada!"
        texto="Gracias por querer colaborar. Te contactaremos lo antes posible."
        onReiniciar={reiniciar}
      />
    );
  }

  return (
    <>
      <h2 className="text-xl font-bold mb-1 flex items-center gap-2" style={{ color: '#2e2e2e' }}>
        <Heart className="w-5 h-5" style={{ color: '#547792' }} />
        {schema.titulo || DEFAULTS.titulo}
      </h2>
      <p className="text-sm mb-6" style={{ color: '#727272' }}>
        {schema.descripcion || DEFAULTS.descripcion}
      </p>

      {nota}

      <form onSubmit={handleSubmit}>
        {schema.secciones.map((seccion, i) => (
          <Seccion key={seccion.nro ?? i} titulo={seccion.titulo} descripcion={seccion.descripcion}>
            {seccion.preguntas.filter(visibles).map(p => (
              <div key={p.id}>{renderPregunta(p)}</div>
            ))}
          </Seccion>
        ))}

        <Seccion titulo="Protección de datos">
          <div>
            <AceptacionClausula acepta={acepta} onChange={setAcepta} />
          </div>
        </Seccion>

        {error && (
          <div
            className="flex items-start gap-2 rounded-xl border px-4 py-3 text-sm mb-4"
            style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca', color: '#991b1b' }}
          >
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={enviando || !acepta}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#547792', color: '#ffffff' }}
        >
          {enviando ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Enviar solicitud
            </>
          )}
        </button>
      </form>
    </>
  );
}

/**
 * Formulario "por defecto" (hardcodeado). Se usa cuando todavía no hay un
 * cuestionario configurado para el tipo en el dashboard.
 */
function FormularioEstatico({
  titulo = 'Solicitud de voluntariado',
  descripcion = DEFAULTS.descripcion,
  tipo = 'VOLUNTARIADO',
  esUmu = false,
  nota = null,
}: Props) {
  const [datos, setDatos] = useState({
    correo: '',
    correoUniversidad: '',
    nombre: '',
    telefono: '',
    edad: '',
    localidad: '',
    vehiculo: '',
    tareas: '',
    comentario: '',
  });
  const [acepta, setAcepta] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);

  const set = (k: keyof typeof datos) => (v: string) => setDatos(d => ({ ...d, [k]: v }));

  const reiniciar = () => {
    setDatos({
      correo: '',
      correoUniversidad: '',
      nombre: '',
      telefono: '',
      edad: '',
      localidad: '',
      vehiculo: '',
      tareas: '',
      comentario: '',
    });
    setAcepta(false);
    setEnviado(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!datos.tareas) {
      setError('Marca al menos una opción en "¿Qué tipo de tareas te interesaría realizar en la protectora?"');
      return;
    }
    setEnviando(true);
    try {
      const respuestas: Record<string, string> = {
        'Nombre': datos.nombre,
        'Email': datos.correo,
        ...(esUmu ? { 'Correo universitario': datos.correoUniversidad } : {}),
        'Teléfono de contacto': datos.telefono,
        'Edad': datos.edad,
        'Localidad de residencia': datos.localidad,
        '¿Dispone de vehículo propio?': datos.vehiculo || 'No',
        'Tareas de interés': datos.tareas,
        'Comentario adicional': datos.comentario || '—',
      };
      await enviarColaboracion(tipo, datos.correo, respuestas);
      setEnviado(true);
    } catch (err: any) {
      setError(err?.message ?? 'No se pudo enviar la solicitud. Inténtalo de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  if (enviado) {
    return (
      <ExitoFormulario
        titulo="¡Solicitud enviada!"
        texto="Gracias por querer colaborar. Te contactaremos lo antes posible."
        onReiniciar={reiniciar}
      />
    );
  }

  return (
    <>
      <h2 className="text-xl font-bold mb-1 flex items-center gap-2" style={{ color: '#2e2e2e' }}>
        <Heart className="w-5 h-5" style={{ color: '#547792' }} />
        {titulo}
      </h2>
      <p className="text-sm mb-6" style={{ color: '#727272' }}>
        {descripcion}
      </p>

      {nota}

      <form onSubmit={handleSubmit}>
        <Seccion titulo="Tus datos">
          <CampoTexto label="Correo" required type="email" placeholder="tucorreo@ejemplo.com" value={datos.correo} onChange={set('correo')} />
          {esUmu && (
            <CampoTexto label="Correo universitario" required type="email" placeholder="usuario@um.es" value={datos.correoUniversidad} onChange={set('correoUniversidad')} />
          )}
          <CampoTexto label="Nombre" required placeholder="Tu nombre completo" value={datos.nombre} onChange={set('nombre')} />
          <CampoTexto label="Teléfono de contacto" required type="tel" placeholder="600 000 000" value={datos.telefono} onChange={set('telefono')} />
          <CampoTexto label="Edad" required type="number" placeholder="Tu edad" value={datos.edad} onChange={set('edad')} />
          <CampoTexto label="¿En qué localidad resides?" required placeholder="Murcia, Molina de Segura..." value={datos.localidad} onChange={set('localidad')} />
          <PreguntaOpciones label="¿Dispones de vehículo propio?" required opciones={['Sí', 'No']} value={datos.vehiculo} onChange={set('vehiculo')} />
        </Seccion>

        <Seccion titulo="Tu participación" descripcion="Marca todas las tareas que te interesen.">
          <div>
            <PreguntaOpciones
              label="¿Qué tipo de tareas te interesaría realizar en la protectora?"
              required
              multiple
              conOtro
              opciones={TAREAS}
              value={datos.tareas}
              onChange={set('tareas')}
            />
          </div>
          <div>
            <CampoTexto
              label="¿Algún comentario adicional que debamos saber?"
              multiline
              placeholder="Cuéntanos cualquier cosa que quieras que sepamos..."
              value={datos.comentario}
              onChange={set('comentario')}
            />
          </div>
        </Seccion>

        <Seccion titulo="Protección de datos">
          <div>
            <AceptacionClausula acepta={acepta} onChange={setAcepta} />
          </div>
        </Seccion>

        {error && (
          <div
            className="flex items-start gap-2 rounded-xl border px-4 py-3 text-sm mb-4"
            style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca', color: '#991b1b' }}
          >
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={enviando || !acepta}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#547792', color: '#ffffff' }}
        >
          {enviando ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Enviar solicitud
            </>
          )}
        </button>
      </form>
    </>
  );
}

export default function VoluntariadoForm(props: Props) {
  const { titulo = 'Solicitud de voluntariado', descripcion = DEFAULTS.descripcion, tipo = 'VOLUNTARIADO', esUmu = false, nota = null } = props;
  const [schema, setSchema] = useState<SchemaVol | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;
    fetch(`${BASE}/formularios/voluntariado/publico?tipo=${tipo}`)
      .then(async res => {
        if (!activo) return;
        if (res.status === 204 || !res.ok) return;
        const data = await res.json().catch(() => null);
        let preg = data?.preguntas;
        if (typeof preg === 'string') {
          try { preg = JSON.parse(preg); } catch { preg = null; }
        }
        const secciones = preg?.secciones;
        if (Array.isArray(secciones) && secciones.length > 0) {
          setSchema({ titulo: preg.titulo, descripcion: preg.descripcion, secciones });
        }
      })
      .catch(() => { /* sin cuestionario configurado */ })
      .finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
  }, [tipo]);

  if (cargando) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-400 gap-3">
        <span className="w-4 h-4 border-2 border-[#547792] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Cargando cuestionario...</span>
      </div>
    );
  }

  if (schema) {
    return <FormularioDinamico schema={schema} tipo={tipo} esUmu={esUmu} nota={nota} />;
  }
  return <FormularioEstatico titulo={titulo} descripcion={descripcion} tipo={tipo} esUmu={esUmu} nota={nota} />;
}