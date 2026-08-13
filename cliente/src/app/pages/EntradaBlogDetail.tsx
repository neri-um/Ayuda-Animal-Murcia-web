
import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import { ArrowLeft, CalendarDays, Newspaper, PawPrint } from 'lucide-react';
import { getEntradaBlog } from '../services/blog';
import { textoConEnlaces } from '../components/TextoConEnlaces';
import { usePageMeta } from '../hooks/usePageMeta';
import type { EntradaBlog } from '../types';

function resumen(texto?: string, max = 160): string {
  if (!texto) return 'Entrada del blog de Ayuda Animal Murcia.';
  return texto.replace(/\s+/g, ' ').trim().slice(0, max) + '…';
}

function formatFecha(fecha: string): string {
  if (!fecha) return '';
  const d = new Date(fecha);
  if (isNaN(d.getTime())) return fecha;
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function EntradaBlogDetail() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const desdeAnimal = searchParams.get('origen') === 'animal';
  const [entrada, setEntrada] = useState<EntradaBlog | null>(null);
  const [cargando, setCargando] = useState(true);
  const [noEncontrada, setNoEncontrada] = useState(false);

  useEffect(() => {
    if (!id) return;
    getEntradaBlog(id)
      .then(setEntrada)
      .catch(() => setNoEncontrada(true))
      .finally(() => setCargando(false));
  }, [id]);

  usePageMeta({
    title: entrada ? `${entrada.titulo} | Blog de Ayuda Animal Murcia` : 'Blog de Ayuda Animal Murcia',
    description: resumen(entrada?.contenido),
    image: entrada?.imagenUrl,
    path: entrada ? `/blog/${entrada.id}` : undefined,
    type: 'article',
  });

  if (cargando) {
    return <p className="max-w-2xl mx-auto px-4 py-20 text-center text-sm text-gray-400">Cargando entrada...</p>;
  }

  if (noEncontrada || !entrada) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 mb-4">Entrada no encontrada.</p>
        <Link to="/blog" className="text-sm underline" style={{ color: '#547792' }}>
          Volver al blog
        </Link>
      </div>
    );
  }

  const contenido = (
    <>
      <div className="mb-6">
        <div
          className="inline-flex items-center gap-1.5 text-xs mb-4 px-2.5 py-1 rounded-full"
          style={{ backgroundColor: '#f0ece6', color: '#727272' }}
        >
          <CalendarDays className="w-3.5 h-3.5" />
          {formatFecha(entrada.fecha)}
        </div>
        <h1 className="text-3xl sm:text-4xl font-black leading-tight" style={{ color: '#2e2e2e' }}>
          {entrada.titulo}
        </h1>
        {(entrada.etiquetas || []).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {entrada.etiquetas.map(t => (
              <Link
                key={t}
                to={`/blog?etiqueta=${encodeURIComponent(t)}`}
                className="text-xs px-2.5 py-1 rounded-full transition-opacity hover:opacity-80"
                style={{ backgroundColor: '#f7e3b0', color: '#2e2e2e' }}
              >
                {t}
              </Link>
            ))}
          </div>
        )}
      </div>

      <hr style={{ borderColor: '#d9d9d9', marginBottom: '2rem' }} />

      <article>
        <p className="text-base leading-relaxed whitespace-pre-line" style={{ color: '#4a4a4a' }}>
          {textoConEnlaces(entrada.contenido)}
        </p>
      </article>

      <div className="mt-10 pt-6 border-t flex items-center justify-between" style={{ borderColor: '#d9d9d9' }}>
        <Link to={desdeAnimal && entrada.animalId ? `/animales/${entrada.animalId}` : '/blog'} className="text-sm inline-flex items-center gap-1.5" style={{ color: '#547792' }}>
          {desdeAnimal ? <><PawPrint className="w-4 h-4" /> Volver al animal</> : <><Newspaper className="w-4 h-4" /> Volver al blog</>}
        </Link>
        {!desdeAnimal && entrada.animalId && (
          <Link to={`/animales/${entrada.animalId}`} className="text-sm underline" style={{ color: '#547792' }}>
            Ver al animal
          </Link>
        )}
      </div>
    </>
  );

  return (
    <div style={{ backgroundColor: '#f7f7f7', minHeight: '100vh' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
        <Link
          to={desdeAnimal && entrada.animalId ? `/animales/${entrada.animalId}` : '/blog'}
          className="inline-flex items-center gap-2 text-sm mb-8 transition-opacity hover:opacity-70"
          style={{ color: '#727272' }}
        >
          <ArrowLeft className="w-4 h-4" />
          {desdeAnimal ? 'Volver al animal' : 'Volver al blog'}
        </Link>

        {entrada.imagenUrl ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">
            <div className="order-2 lg:order-1">{contenido}</div>
            <div className="order-1 lg:order-2">
              <img
                src={entrada.imagenUrl}
                alt={entrada.titulo}
                className="w-full aspect-[4/3] object-cover rounded-2xl"
              />
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">{contenido}</div>
        )}
      </div>
    </div>
  );
}
