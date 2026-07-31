// cliente/src/app/pages/Home.tsx

import { Link } from 'react-router';
import { Star } from 'lucide-react';
import AnimalsForAdoption from '../components/AnimalsForAdoption';
import { useApp } from '../context/AppContext';

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

// TODO: cuando el backend tenga el concepto de "animal del mes",
// sustituir este ID hardcodeado por el que devuelva el endpoint correspondiente.
const ANIMAL_DEL_MES_ID: string | null = null;

export default function Home() {
  const { animals } = useApp();

  // Resolvemos el animal del mes: primero buscamos por ID configurado,
  // si no hay, usamos el primero disponible como demo visual.
  const animalDelMes =
    (ANIMAL_DEL_MES_ID
      ? animals.find((a) => a.id === ANIMAL_DEL_MES_ID)
      : animals[0]) ?? null;

  return (
    <div style={{ backgroundColor: '#f7f7f7' }}>
      {/* ── Hero ── */}
      <section className="py-16" style={{ backgroundColor: '#2e2e2e' }}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* Columna izquierda: texto y CTAs */}
          <div>
            <p className="mb-3 italic font-medium" style={{ color: '#f7e3b0' }}>
              Refugio Ayuda Animal Murcia
            </p>
            <h1
              className="text-3xl sm:text-5xl font-black leading-tight mb-5"
              style={{ color: '#ffffff' }}
            >
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

          {/* Columna derecha: Animal del mes */}
          <div className="hidden lg:flex flex-col items-center">
            {animalDelMes ? (
              /* ── Tarjeta con foto real ── */
              <div
                className="w-full max-w-sm rounded-3xl overflow-hidden"
                style={{ border: '1px solid #3f3f3f', backgroundColor: '#1c1c1c' }}
              >
                {/* Foto */}
                <div className="relative" style={{ aspectRatio: '4/3' }}>
                  <img
                    src={animalDelMes.imageUrl}
                    alt={`Foto de ${animalDelMes.name}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  {/* Badge Animal del mes */}
                  <div
                    className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: '#f7e3b0', color: '#2e2e2e' }}
                  >
                    <Star className="w-3 h-3" fill="#2e2e2e" />
                    Animal del mes
                  </div>
                </div>
                {/* Info */}
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-base" style={{ color: '#ffffff' }}>
                      {animalDelMes.name}
                    </p>
                    <p className="text-xs" style={{ color: '#727272' }}>
                      {animalDelMes.breed}
                    </p>
                  </div>
                  <Link
                    to={`/animals/${animalDelMes.id}`}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                    style={{ backgroundColor: '#f7e3b0', color: '#2e2e2e' }}
                  >
                    Ver ficha →
                  </Link>
                </div>
              </div>
            ) : (
              /* ── Placeholder cuando no hay animales aún ── */
              <div
                className="w-full max-w-sm rounded-3xl flex flex-col items-center justify-center gap-4"
                style={{
                  aspectRatio: '4/3',
                  border: '2px dashed #3f3f3f',
                  backgroundColor: '#1c1c1c',
                }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#2e2e2e', border: '2px dashed #3f3f3f' }}
                >
                  <Star className="w-7 h-7" style={{ color: '#f7e3b0' }} />
                </div>
                <div className="text-center px-6">
                  <p className="text-sm font-semibold" style={{ color: '#f7e3b0' }}>
                    Animal del mes
                  </p>
                  <p className="text-xs mt-1" style={{ color: '#727272' }}>
                    Próximamente aquí aparecerá el animal al que damos visibilidad especial este mes.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* ── Quiénes somos ── */}
      <section className="py-14" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-bold mb-3" style={{ color: '#2e2e2e' }}>Quiénes somos</h2>
            <p className="text-sm mb-3" style={{ color: '#727272' }}>
              Ayuda Animal Murcia nace del compromiso de un grupo de personas
              que no podían mirar hacia otro lado ante la realidad del abandono animal.
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
          <div
            className="rounded-2xl border p-6"
            style={{ backgroundColor: '#f7f7f7', borderColor: '#d9d9d9' }}
          >
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

      {/* ── Últimos animales en adopción ── */}
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

      {/* ── Últimas novedades ── */}
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
