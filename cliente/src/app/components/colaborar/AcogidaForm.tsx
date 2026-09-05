
import { useState } from 'react';
import { Send, AlertCircle, Home } from 'lucide-react';
import { CampoTexto, PreguntaOpciones } from './campos';
import { Seccion, AceptacionClausula, ExitoFormulario } from './comun';
import { crearAcogida } from '../../services/acogidas';

const ESTADO_EXTERIOR = ['Sí, completamente protegido/cercado', 'Sí, pero no está protegido/cercado', 'No tengo'];
const PROTECCIONES = ['Mosquiteras (deben estar en buen estado)', 'Malla', 'Red'];

export default function AcogidaForm() {
  const [datos, setDatos] = useState({
    correo: '',
    nombre: '',
    dni: '',
    telefono: '',
    domicilio: '',
    tipoVivienda: '',
    propiedad: '',
    caseroPermite: '',
    numPersonas: '',
    todosDeAcuerdo: '',
    alguienEnContra: '',
    vehiculo: '',
    jardin: '',
    patio: '',
    balcon: '',
    proteccionesVentanas: '',
    tipoProtecciones: '',
    dispuestoProteger: '',
    horasSolo: '',
    otrosAnimales: '',
    gatosTestados: '',
    cuarentena: '',
    vacunados: '',
    tiempoAcogida: '',
    tipoAnimal: '',
    comportamiento: '',
    animalConcreto: '',
    comentario: '',
  });
  const [acepta, setAcepta] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);

  const set = (k: keyof typeof datos) => (v: string) => setDatos(d => ({ ...d, [k]: v }));

  const reiniciar = () => {
    setDatos({
      correo: '', nombre: '', dni: '', telefono: '', domicilio: '', tipoVivienda: '', propiedad: '',
      caseroPermite: '', numPersonas: '', todosDeAcuerdo: '', alguienEnContra: '', vehiculo: '',
      jardin: '', patio: '', balcon: '', proteccionesVentanas: '', tipoProtecciones: '', dispuestoProteger: '',
      horasSolo: '', otrosAnimales: '', gatosTestados: '', cuarentena: '', vacunados: '',
      tiempoAcogida: '', tipoAnimal: '', comportamiento: '', animalConcreto: '', comentario: '',
    });
    setAcepta(false);
    setEnviado(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!datos.tipoProtecciones) {
      setError('Marca al menos una opción en "Indique qué tipo de protecciones tiene (en relación con la respuesta anterior)"');
      return;
    }
    setEnviando(true);
    try {
      const respuestas: Record<string, string> = {
        'Nombre completo': datos.nombre,
        'Email': datos.correo,
        'DNI': datos.dni,
        'Teléfono de contacto': datos.telefono,
        'Domicilio': datos.domicilio,
        'Tipo de vivienda': datos.tipoVivienda,
        'Vivienda propia o de alquiler': datos.propiedad,
        '¿El casero permite animales?': datos.caseroPermite || 'No procede (vivienda propia)',
        'Número de personas en la vivienda': datos.numPersonas,
        '¿Todos los habitantes están de acuerdo?': datos.todosDeAcuerdo,
        '¿Hay alguien en contra?': datos.alguienEnContra || 'No',
        'Vehículo propio y disponibilidad para transportar': datos.vehiculo,
        'Jardín (¿cercado/protegido?)': datos.jardin || 'No tengo',
        'Patio (¿cercado/protegido?)': datos.patio || 'No tengo',
        'Balcón (¿cercado/protegido?)': datos.balcon || 'No tengo',
        '¿Protecciones en ventanas?': datos.proteccionesVentanas,
        'Tipo de protecciones': datos.tipoProtecciones || '—',
        '¿Dispuesto a poner protecciones?': datos.dispuestoProteger,
        'Horas solo al día': datos.horasSolo,
        'Otros animales en casa': datos.otrosAnimales || 'No hay',
        'Gatos testados de Leucemia/Inmunodeficiencia': datos.gatosTestados,
        'Cuarentena de 2 meses antes del test': datos.cuarentena,
        '¿Vacunados anualmente (rabia y polivalente)?': datos.vacunados,
        'Tiempo como casa de acogida': datos.tiempoAcogida || 'Tiempo indefinido (hasta la adopción)',
        'Tipo de animal a acoger': datos.tipoAnimal,
        '¿Dispuesto a trabajar comportamientos inadecuados?': datos.comportamiento,
        'Animal en concreto': datos.animalConcreto || '—',
        'Comentario adicional': datos.comentario || '—',
      };
      await crearAcogida({
        nombre: datos.nombre,
        apellidos: '',
        telefono: datos.telefono,
        email: datos.correo,
        direccion: datos.domicilio,
        especie: null,
        respuestas,
      });
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
        texto="Gracias por ofrecer tu hogar a un animal. Te contactaremos lo antes posible."
        onReiniciar={reiniciar}
      />
    );
  }

  return (
    <>
      <h2 className="text-xl font-bold mb-1 flex items-center gap-2" style={{ color: '#2e2e2e' }}>
        <Home className="w-5 h-5" style={{ color: '#547792' }} />
        Solicitud para casa de acogida temporal
      </h2>
      <p className="text-sm mb-6" style={{ color: '#727272' }}>
        Este formulario recopila información esencial para solicitar ser el hogar temporal de un animal de la protectora Ayuda Animal Murcia.
      </p>

      <form onSubmit={handleSubmit}>
        <Seccion titulo="Datos personales" descripcion="Así podremos ponernos en contacto contigo.">
          <CampoTexto label="Correo" required type="email" placeholder="tucorreo@ejemplo.com" value={datos.correo} onChange={set('correo')} />
          <CampoTexto label="Nombre completo" required placeholder="Tu nombre completo" value={datos.nombre} onChange={set('nombre')} />
          <CampoTexto label="DNI" required placeholder="12345678A" value={datos.dni} onChange={set('dni')} />
          <CampoTexto label="Número de teléfono de contacto" required type="tel" placeholder="600 000 000" value={datos.telefono} onChange={set('telefono')} />
        </Seccion>

        <Seccion titulo="Hogar" descripcion="Cuéntanos cómo es tu vivienda para encontrar el animal adecuado.">
          <CampoTexto label="Domicilio" required placeholder="Calle, número, ciudad..." value={datos.domicilio} onChange={set('domicilio')} />
          <CampoTexto label="Tipo de vivienda" required placeholder="Piso, casa adosada, chalé..." value={datos.tipoVivienda} onChange={set('tipoVivienda')} />
          <PreguntaOpciones label="¿La vivienda es propia o de alquiler?" required opciones={['Propia', 'Alquiler']} value={datos.propiedad} onChange={set('propiedad')} />
          <PreguntaOpciones label="En caso de ser alquiler, ¿el casero permite que habiten animales?" required conOtro opciones={['Sí', 'No', 'No procede (vivienda propia)']} value={datos.caseroPermite} onChange={set('caseroPermite')} />
          <CampoTexto label="Número de personas que habitan en la vivienda" required type="number" placeholder="2" value={datos.numPersonas} onChange={set('numPersonas')} />
          <PreguntaOpciones label="¿Todos los habitantes de la vivienda están de acuerdo?" required opciones={['Sí', 'No']} value={datos.todosDeAcuerdo} onChange={set('todosDeAcuerdo')} />
          <PreguntaOpciones label="¿Hay alguien en contra?" required opciones={['Sí', 'No']} value={datos.alguienEnContra} onChange={set('alguienEnContra')} />
          <PreguntaOpciones label="¿Tiene vehículo propio y disponibilidad para transportar al animal en caso de urgencia o visita veterinaria?" required conOtro opciones={['Sí', 'No']} value={datos.vehiculo} onChange={set('vehiculo')} />
        </Seccion>

        <Seccion titulo="El exterior y las ventanas" descripcion="¿Cómo es el acceso al exterior y la seguridad del hogar?">
          <PreguntaOpciones label="Jardín" multiple opciones={ESTADO_EXTERIOR} value={datos.jardin} onChange={set('jardin')} />
          <PreguntaOpciones label="Patio" multiple opciones={ESTADO_EXTERIOR} value={datos.patio} onChange={set('patio')} />
          <PreguntaOpciones label="Balcón" multiple opciones={ESTADO_EXTERIOR} value={datos.balcon} onChange={set('balcon')} />
          <PreguntaOpciones label="¿Su vivienda dispone de protecciones en ventanas (importante si acoge un gato)?" required conOtro opciones={['Sí, en todas las ventanas accesibles', 'Sí, en algunas ventanas', 'No']} value={datos.proteccionesVentanas} onChange={set('proteccionesVentanas')} />
          <div>
            <PreguntaOpciones label="Indique qué tipo de protecciones tiene (en relación con la respuesta anterior)" required multiple conOtro opciones={PROTECCIONES} value={datos.tipoProtecciones} onChange={set('tipoProtecciones')} />
          </div>
          <PreguntaOpciones label="En caso de no disponer de protecciones, ¿estaría dispuesto a ponerlas?" required conOtro opciones={['Sí', 'No']} value={datos.dispuestoProteger} onChange={set('dispuestoProteger')} />
        </Seccion>

        <Seccion titulo="Convivencia con otros animales" descripcion="Para cuidar la salud de todos.">
          <CampoTexto label="¿Cuántas horas al día pasaría el animal solo en casa aproximadamente?" required type="number" placeholder="8" value={datos.horasSolo} onChange={set('horasSolo')} />
          <div>
            <CampoTexto label="¿Hay más animales en casa? Cuéntanos sobre ellos" required multiline placeholder="Especie, edad, carácter..." value={datos.otrosAnimales} onChange={set('otrosAnimales')} />
          </div>
          <PreguntaOpciones label="En caso de tener otros gatos, ¿están testados de Leucemia e Inmunodeficiencia?" required conOtro opciones={['Sí, con resultado negativo', 'No se les ha realizado el test de enfermedades']} value={datos.gatosTestados} onChange={set('gatosTestados')} />
          <PreguntaOpciones label="¿El animal estuvo en cuarentena 2 meses (sin más gatos o con gatos testados correctamente) antes de realizar ese test?" required conOtro opciones={['Sí', 'No']} value={datos.cuarentena} onChange={set('cuarentena')} />
          <PreguntaOpciones label="¿Están vacunados anualmente los animales que habitan en su casa de la rabia y de la polivalente?" required conOtro opciones={['Sí', 'No']} value={datos.vacunados} onChange={set('vacunados')} />
        </Seccion>

        <Seccion titulo="Sobre la acogida" descripcion="Cuéntanos qué tipo de animal y durante cuánto tiempo podrías acoger.">
          <PreguntaOpciones label="¿Cuánto tiempo podría ofrecerse como casa de acogida para un animal? (El tiempo puede variar según la necesidad del animal)" conOtro opciones={['Tiempo indefinido (hasta la adopción)']} value={datos.tiempoAcogida} onChange={set('tiempoAcogida')} />
          <PreguntaOpciones label="¿Qué tipo de animal le gustaría acoger?" required conOtro opciones={['Perro', 'Gato']} value={datos.tipoAnimal} onChange={set('tipoAnimal')} />
          <PreguntaOpciones label="¿Estaría dispuesto a trabajar algún comportamiento inadecuado?" required conOtro opciones={['Sí', 'No']} value={datos.comportamiento} onChange={set('comportamiento')} />
          <CampoTexto label="¿Se ofrece para un animal en concreto? Si es así, escribe su nombre" placeholder="Nombre del animal" value={datos.animalConcreto} onChange={set('animalConcreto')} />
          <div>
            <CampoTexto label="¿Quieres comentar alguna cosa adicional?" multiline placeholder="Cuéntanos lo que necesites..." value={datos.comentario} onChange={set('comentario')} />
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
