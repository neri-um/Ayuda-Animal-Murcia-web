import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Calendar, Newspaper, ArrowRight } from 'lucide-react';
import { getEntradasGenerales } from '../services/blog';
import { textoConEnlaces } from '../components/TextoConEnlaces';
import { usePageMeta } from '../hooks/usePageMeta';
import { toSlug } from '../utils/slug';
import type { EntradaBlog } from '../types';

function formatFecha(fecha: string): string {
  if (!fecha) return '';
  const d = new Date(fecha);
  if (isNaN(d.getTime())) return fecha;
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

const RESUMEN_LEN = 320;

export default function Blog() {
  const [todas, setTodas] = useState<EntradaBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [etiquetaActiva, setEtiquetaActiva] = useState(searchParams.get('etiqueta') ?? '');

  useEffect(() => {
    getEntradasGenerales()
      .then(setTodas)
      .catch(() => setTodas([]))
      .finally(() => setLoading(false));
  }, []);

  usePageMeta({
    title: 'Blog – Consejos y noticias | Ayuda Animal Murcia',
    description: 'Consejos de cuidado, historias de los animales y noticias del refugio Ayuda Animal Murcia.',
    path: '/blog',
  });

  const cambiarEtiqueta = (t: string) => {
    setEtiquetaActiva(t);
    setSearchParams(t ? { etiqueta: t } : {}, { replace: true });
  };

  const etiquetas = useMemo(() => {
    const set = new Set<string>();
    todas.forEach(e => (e.etiquetas || []).forEach(t => set.add(t)));
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [todas]);

  const visibles = useMemo(
    () => (etiquetaActiva ? todas.filter(e => (e.etiquetas || []).includes(etiquetaActiva)) : todas),
    [todas, etiquetaActiva],
  );

  const grupos = useMemo(() => {
    const map = new Map<string, EntradaBlog[]>();
    for (const e of visibles) {
      const year = (e.fecha || '').slice(0, 4) || 'Sin fecha';
      if (!map.has(year)) map.set(year, []);
      map.get(year)!.push(e);
    }
    return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, [visibles]);

  const chipCls = (activa: boolean) =>
    `text-sm px-4 py-1.5 rounded-full transition-all ${
      activa ? 'font-semibold' : 'hover:opacity-70'
    }`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2" style={{ color: '#2e2e2e' }}>
          <Newspaper className="w-7 h-7" style={{ color: '#547792' }} />
          Blog
        </h1>
        <p className="text-sm" style={{ color: '#727272' }}>
          Eventos, campañas y novedades de la asociación, año a año.
        </p>
      </div>

      {etiquetas.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => cambiarEtiqueta('')}
            className={chipCls(etiquetaActiva === '')}
            style={etiquetaActiva === '' ? { backgroundColor: '#f7e3b0', color: '#2e2e2e' } : { color: '#547792' }}
          >
            Todas
          </button>
          {etiquetas.map(t => (
            <button
              key={t}
              onClick={() => cambiarEtiqueta(etiquetaActiva === t ? '' : t)}
              className={chipCls(etiquetaActiva === t)}
              style={etiquetaActiva === t ? { backgroundColor: '#f7e3b0', color: '#2e2e2e' } : { color: '#547792' }}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-400 py-10 text-center">Cargando blog...</p>
      ) : visibles.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">📰</p>
          <p className="text-gray-500">Aún no hay entradas de blog.</p>
        </div>
      ) : (
        grupos.map(([year, entradas]) => (
          <section key={year} className="mb-10">
            <h2 className="text-xl font-bold mb-5 pb-2 border-b" style={{ color: '#2e2e2e', borderColor: '#d9d9d9' }}>
              {year}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {entradas.map(e => {
                const largo = (e.contenido || '').length > RESUMEN_LEN;
                const texto = largo ? e.contenido.slice(0, RESUMEN_LEN) + '…' : e.contenido;
                return (
                  <article
                    key={e.id}
                    className="rounded-2xl border p-5 flex flex-col gap-3 transition-shadow hover:shadow-md"
                    style={{ backgroundColor: '#f7f7f7', borderColor: '#d9d9d9' }}
                  >
                    {e.imagenUrl && (
                      <Link to={`/blog/${toSlug(e.titulo)}`} className="block overflow-hidden rounded-xl">
                        <img src={e.imagenUrl} alt={e.titulo} className="w-full aspect-[4/3] object-cover transition-transform hover:scale-105" loading="lazy" />
                      </Link>
                    )}
                    <p className="text-xs flex items-center gap-1" style={{ color: '#727272' }}>
                      <Calendar className="w-3.5 h-3.5" />{formatFecha(e.fecha)}
                    </p>
                    <Link to={`/blog/${toSlug(e.titulo)}`} className="hover:underline">
                      <h3 className="text-lg font-semibold" style={{ color: '#2e2e2e' }}>{e.titulo}</h3>
                    </Link>
                    {texto && <p className="text-sm whitespace-pre-line flex-1" style={{ color: '#727272' }}>{textoConEnlaces(texto)}</p>}
                    <Link
                      to={`/blog/${toSlug(e.titulo)}`}
                      className="inline-flex items-center gap-1 text-sm font-medium self-start hover:gap-2 transition-all"
                      style={{ color: '#547792' }}
                    >
                      Leer la entrada completa <ArrowRight className="w-4 h-4" />
                    </Link>
                    {(e.etiquetas || []).length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {e.etiquetas.map(t => (
                          <button
                            key={t}
                            onClick={() => cambiarEtiqueta(etiquetaActiva === t ? '' : t)}
                            className="text-xs px-2.5 py-1 rounded-full transition-opacity hover:opacity-80"
                            style={{ backgroundColor: '#f7e3b0', color: '#2e2e2e' }}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
