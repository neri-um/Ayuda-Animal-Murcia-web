// cliente/src/app/pages/NovedadDetail.tsx
import { useParams, Link } from 'react-router';
import { ArrowLeft, CalendarDays } from 'lucide-react';

type Novedad = {
  id: number;
  titulo: string;
  fecha: string;
  resumen: string;
  /** Contenido completo en párrafos (cada string = un <p>) */
  contenido: string[];
};

// ─── Edita aquí el contenido completo de cada entrada ────────────────────────
const NOVEDADES: Novedad[] = [
  {
    id: 1,
    titulo: 'Catfetería ya es una realidad',
    fecha: 'Julio 2026',
    resumen:
      '¡El juego ya está terminado! Rellena el formulario que encontrarás abajo para poder escoger un punto de recogida o envío.',
    contenido: [
      '¡Por fin podemos anunciarlo! Catfetería, nuestro juego de mesa solidario, ya está listo para llegar a vuestras manos.',
      'Durante meses hemos estado trabajando en este proyecto con mucho cariño, y ahora que está terminado queremos compartirlo con todos vosotros. Cada copia vendida contribuye directamente a los cuidados de los animales del refugio.',
      'Para haceros con vuestra copia, rellena el formulario que encontraréis en la página de colaboración. Podéis elegir entre recogida en punto presencial o envío a domicilio.',
      '¡Muchas gracias a todos los que habéis apoyado el proyecto desde el principio!',
    ],
  },
  {
    id: 2,
    titulo: 'Gracias a nuestros voluntarios',
    fecha: 'Junio 2026',
    resumen:
      'Reconocemos el trabajo de quienes apoyan cada día al refugio y hacen posible nuestra labor.',
    contenido: [
      'Cada día, un grupo de personas increíbles dedica su tiempo libre a cuidar, pasear, socializar y querer a los animales de nuestro refugio.',
      'Sin vosotros, nada de esto sería posible. Gracias por aparecer cuando más se os necesita, por no rendiros y por tratarlos como merecen: con amor, paciencia y respeto.',
      'Este mes queremos hacer una mención especial a todos los voluntarios que han estado presentes durante las jornadas de adopción de verano. Habéis sido fundamentales.',
      'Si quieres unirte al equipo de voluntarios, puedes escribirnos a través de la sección de contacto. ¡Siempre hay sitio para más corazones grandes!',
    ],
  },
];
// ─────────────────────────────────────────────────────────────────────────────

export default function NovedadDetail() {
  const { id } = useParams<{ id: string }>();
  const novedad = NOVEDADES.find((n) => n.id === Number(id));

  if (!novedad) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 mb-4">Entrada no encontrada.</p>
        <Link to="/" className="text-sm underline" style={{ color: '#547792' }}>
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f7f7f7', minHeight: '100vh' }}>
      <div className="max-w-2xl mx-auto px-4 py-14">

        {/* Volver */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm mb-10 transition-opacity hover:opacity-70"
          style={{ color: '#727272' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        {/* Cabecera */}
        <header className="mb-8">
          <div
            className="inline-flex items-center gap-1.5 text-xs mb-4 px-2.5 py-1 rounded-full"
            style={{ backgroundColor: '#f0ece6', color: '#727272' }}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            {novedad.fecha}
          </div>
          <h1
            className="text-3xl font-black leading-tight"
            style={{ color: '#2e2e2e' }}
          >
            {novedad.titulo}
          </h1>
        </header>

        {/* Separador */}
        <hr style={{ borderColor: '#d9d9d9', marginBottom: '2rem' }} />

        {/* Contenido */}
        <article className="space-y-5">
          {novedad.contenido.map((parrafo, i) => (
            <p key={i} className="text-base leading-relaxed" style={{ color: '#4a4a4a' }}>
              {parrafo}
            </p>
          ))}
        </article>

      </div>
    </div>
  );
}
