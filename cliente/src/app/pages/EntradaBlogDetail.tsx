
import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router';
import { ArrowLeft, CalendarDays, ChevronLeft, ChevronRight, Newspaper, PawPrint } from 'lucide-react';
import { getEntradaBlog, getEntradasGenerales } from '../services/blog';
import { textoConEnlaces } from '../components/TextoConEnlaces';
import { usePageMeta } from '../hooks/usePageMeta';
import { toSlug } from '../utils/slug';
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

function limpiarUrl(url?: string | null): string {
  if (!url) return '';
  const m = String(url).match(/https?:\/\/[^\s\])"]+/i);
  return m ? m[0] : String(url).replace(/^\[|\]$/g, '');
}

export default function EntradaBlogDetail() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const desdeAnimal = searchParams.get('origen') === 'animal';
  const [entrada, setEntrada] = useState<EntradaBlog | null>(null);
  const [cargando, setCargando] = useState(true);
  const [noEncontrada, setNoEncontrada] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => { setIndex(0); }, [id]);

  const images = useMemo(() => {
    if (!entrada) return [] as string[];
    const raw = [entrada.imagenUrl, ...(entrada.galeria || [])].map(limpiarUrl).filter(Boolean);
    return Array.from(new Set(raw));
  }, [entrada]);

  useEffect(() => {
    if (!id) return;
    setCargando(true);
    if (/^\d+$/.test(id)) {
      getEntradaBlog(id)
        .then(setEntrada)
        .catch(() => setNoEncontrada(true))
        .finally(() => setCargando(false));
    } else {
      getEntradasGenerales()
        .then(lista => {
          const e = lista.find(x => x && x.titulo && toSlug(x.titulo) === id.toLowerCase());
          if (e) setEntrada(e);
          else setNoEncontrada(true);
        })
        .catch(() => setNoEncontrada(true))
        .finally(() => setCargando(false));
    }
  }, [id]);

  usePageMeta({
    title: entrada ? `${entrada.titulo} | Blog de Ayuda Animal Murcia` : 'Blog de Ayuda Animal Murcia',
    description: resumen(entrada?.contenido),
    image: entrada?.imagenUrl,
    path: entrada ? `/blog/${toSlug(entrada.titulo)}` : undefined,
    type: 'article',
  });

  const currentImage = images[index] || '';

  if (cargando) {
    return <p className="max-w-2xl mx-auto px-4 py-20 text-center text-sm text-gray-400">Cargando entrada...</p>;
  }

  if (entrada && id !== toSlug(entrada.titulo)) {
    return <Navigate to={`/blog/${toSlug(entrada.titulo)}`} replace />;
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

        {images.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">
            <div className="order-2 lg:order-1">{contenido}</div>
            <div className="order-1 lg:order-2 flex flex-col gap-3">
              <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-[4/3]">
                {currentImage ? (
                  <img src={currentImage} alt={entrada.titulo} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Sin imágenes</div>
                )}
                {images.length > 1 && <>
                  <button type="button" onClick={() => setIndex(prev => (prev - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm border border-black/10 flex items-center justify-center text-gray-700 hover:bg-white transition-colors" aria-label="Imagen anterior"><ChevronLeft className="w-4 h-4" /></button>
                  <button type="button" onClick={() => setIndex(prev => (prev + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm border border-black/10 flex items-center justify-center text-gray-700 hover:bg-white transition-colors" aria-label="Imagen siguiente"><ChevronRight className="w-4 h-4" /></button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">{images.map((_, i) => <button key={i} type="button" onClick={() => setIndex(i)} className={`w-2.5 h-2.5 rounded-full transition-all ${i === index ? 'bg-white scale-110' : 'bg-white/50'}`} aria-label={`Ir a imagen ${i + 1}`} />)}</div>
                </>}
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((img, i) => (
                    <button key={`${img}-${i}`} type="button" onClick={() => setIndex(i)} className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${i === index ? 'border-[#2e2e2e]' : 'border-gray-200'}`}>
                      <img src={img} alt={`${entrada.titulo} ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">{contenido}</div>
        )}
      </div>
    </div>
  );
}
