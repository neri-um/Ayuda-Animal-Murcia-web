// cliente/src/app/pages/Home.tsx

import { Link } from 'react-router';
import AnimalsForAdoption from '../components/AnimalsForAdoption';

type Novedad = {
  id: number;
  titulo: string;
  fecha: string;
  resumen: string;
};

const NOVEDADES: Novedad[] = [
  {
    id: 1,
    titulo: 'Nueva campaña de adopción en verano',
    fecha: 'Julio 2026',
    resumen:
      'Ampliamos horarios y actividades para facilitar las adopciones durante los meses de verano.',
  },
  {
    id: 2,
    titulo: 'Gracias a nuestros voluntarios',
    fecha: 'Junio 2026',
    resumen:
      'Reconocemos el trabajo de quienes apoyan cada día al refugio y hacen posible nuestra labor.',
  },
];

export default function Home() {
  return (
    <div style={{ backgroundColor: '#f7f7f7' }} className="text-negroCarbon">
      {/* Hero */}
      <section className="py-16" style={{ backgroundColor: '#2e2e2e' }}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="mb-3 italic font-medium" style={{ color: '#f7e3b0' }}>
              Refugio Ayuda Animal Murcia
            </p>
            <h1 className="text-3xl sm:text-5xl font-black leading-tight mb-5" style={{ color: '#ffffff' }}>
              Cada animal merece
              <br />
              <span style={{ color: '#f7e3b0' }}>una segunda oportunidad</span>
            </h1>
            <p className="text-sm sm:text-base mb-6" style={{ color: '#d9d9d9' }}>
              Somos una asociación sin ánimo de lucro dedicada al rescate,
              cuidado y adopción responsable de animales en Murcia.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/adoptar"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-90"
                style={{ backgroundColor: '#f7e3b0', color: '#2e2e2e' }}
              >
                Ver animales en adopción
              </Link>
              <Link
                to="/colaborar"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:bg-white/10"
                style={{ border: '1px solid #f7e3b0', color: '#f7e3b0' }}
              >
                Formas de colaborar
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="rounded-3xl p-6" style={{ border: '1px solid #3f3f3f', backgroundColor: '#3a3a3a' }}>
              <p className="text-sm mb-2" style={{ color: '#727272' }}>Nuestra misión</p>
              <p className="text-base" style={{ color: '#d9d9d9' }}>
                Trabajamos cada día para que perros, gatos y otros animales
                abandonados encuentren un hogar donde recibir el cariño y el
                cuidado que merecen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quiénes somos */}
      <section className="py-14" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-bold mb-3" style={{ color: '#2e2e2e' }}>Quiénes somos</h2>
            <p className="text-sm mb-3" style={{ color: '#727272' }}>
              Ayuda Animal Murcia nace del compromiso de un grupo de personas
              que no podían mirar hacia otro lado ante la realidad del abandono
              animal.
            </p>
            <p className="text-sm mb-3" style={{ color: '#727272' }}>
              Nuestro trabajo se basa en el rescate, la atención veterinaria,
              la recuperación emocional y la búsqueda de familias responsables
              que quieran compartir su vida con ellos.
            </p>
            <p className="text-sm" style={{ color: '#727272' }}>
              Gracias a donaciones, voluntariado y colaboraciones, podemos
              seguir ofreciendo una nueva oportunidad a cada animal.
            </p>
          </div>
          <div className="rounded-2xl border p-6" style={{ backgroundColor: '#f7f7f7', borderColor: '#d9d9d9' }}>
            <h3 className="text-base font-semibold mb-2" style={{ color: '#2e2e2e' }}>Qué hacemos</h3>
            <ul className="text-sm space-y-2" style={{ color: '#727272' }}>
              <li>• Rescate y acogida de animales abandonados o maltratados.</li>
              <li>• Atención veterinaria y seguimiento de cada caso.</li>
              <li>• Fomento de la adopción responsable.</li>
              <li>• Programas de apadrinamiento y casas de acogida.</li>
              <li>• Educación y sensibilización sobre bienestar animal.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Últimos animales en adopción */}
      <section className="py-14" style={{ backgroundColor: '#f7f7f7' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1" style={{ color: '#2e2e2e' }}>
                Últimos animales en adopción
              </h2>
              <p className="text-sm" style={{ color: '#727272' }}>
                Estos son algunos de los animales que han llegado recientemente al refugio.
              </p>
            </div>
            <Link
              to="/adoptar"
              className="text-sm font-semibold transition-colors hover:opacity-70"
              style={{ color: '#2e2e2e' }}
            >
              Ver todos →
            </Link>
          </div>
          <AnimalsForAdoption variant="home" />
        </div>
      </section>

      {/* Últimas novedades */}
      <section className="py-14" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-1" style={{ color: '#2e2e2e' }}>Últimas novedades</h2>
          <p className="text-sm mb-6" style={{ color: '#727272' }}>
            Noticias, campañas y pequeños grandes logros del refugio.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {NOVEDADES.map((novedad) => (
              <article
                key={novedad.id}
                className="rounded-2xl border p-5"
                style={{ backgroundColor: '#f7f7f7', borderColor: '#d9d9d9' }}
              >
                <p className="text-xs mb-1" style={{ color: '#727272' }}>{novedad.fecha}</p>
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#2e2e2e' }}>{novedad.titulo}</h3>
                <p className="text-sm" style={{ color: '#727272' }}>{novedad.resumen}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
