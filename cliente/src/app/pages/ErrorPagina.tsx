import { Link, useRouteError, isRouteErrorResponse } from 'react-router';
import { usePageMeta } from '../hooks/usePageMeta';
import { ArrowLeft } from 'lucide-react';

export default function ErrorPagina() {
  const error = useRouteError();
  const es404 = !error || (isRouteErrorResponse(error) && error.status === 404);

  usePageMeta({
    title: es404 ? 'Página no encontrada | Ayuda Animal Murcia' : 'Error | Ayuda Animal Murcia',
    description: es404
      ? 'La página que buscas no existe o se ha movido.'
      : 'Ha habido un problema al cargar esta página.',
    path: '/404',
    noindex: true,
  });

  return (
    <div style={{ backgroundColor: '#f7f7f7', minHeight: '100vh' }} className="flex items-center justify-center">
      <div className="text-center px-4">
        <p className="text-7xl font-black mb-2" style={{ color: '#f7e3b0' }}>{es404 ? '404' : '¡Ups!'}</p>
        <h1 className="text-2xl font-bold mb-2" style={{ color: '#2e2e2e' }}>
          {es404 ? 'Uy, esta página se ha perdido' : 'Uy, algo ha ido mal'}
        </h1>
        <p className="text-sm mb-6" style={{ color: '#727272' }}>
          {es404
            ? 'La dirección que has escrito no existe o la hemos movido. Prueba a volver al inicio.'
            : 'Ha habido un problema al cargar esta página. Vuelve al inicio o inténtalo en un momento.'}
        </p>
        <Link to="/" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-opacity hover:opacity-80" style={{ backgroundColor: '#f7e3b0', color: '#2e2e2e' }}>
          <ArrowLeft className="w-4 h-4" /> Volver al inicio
        </Link>
      </div>
    </div>
  );
}
