
import { useState } from 'react';
import { Send, AlertCircle, Heart } from 'lucide-react';
import { CampoTexto, PreguntaOpciones } from './campos';
import { Seccion, AceptacionClausula, ExitoFormulario } from './comun';
import { enviarColaboracion, type TipoColaboracion } from '../../services/colaboracion';

const TAREAS = [
  'Gestionar animales en adopción',
  'Difusión en redes sociales',
  'Transporte de animales (visitas veterinarias, recogidas, etc.)',
  'Ayuda en eventos, recaudación de fondos, mercadillos (...)',
  'Tareas administrativas',
  'Control de colonias felinas (CER)',
  'Acogida temporal',
];

export default function VoluntariadoForm({
  titulo = 'Solicitud de voluntariado',
  descripcion = '¡Únete al equipo! Puedes inscribirte rellenando el siguiente cuestionario, te contactaremos lo antes posible.',
  tipo = 'VOLUNTARIADO',
  esUmu = false,
  nota = null,
}: {
  titulo?: string;
  descripcion?: string;
  tipo?: TipoColaboracion;
  esUmu?: boolean;
  nota?: React.ReactNode;
}) {
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
