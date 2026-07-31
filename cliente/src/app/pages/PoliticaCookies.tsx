// cliente/src/app/pages/PoliticaCookies.tsx
// Política de Cookies conforme a la LSSI-CE y Guía de Cookies de la AEPD

import { useState } from 'react';

type CookieRow = {
  nombre: string;
  proveedor: string;
  tipo: string;
  duracion: string;
  finalidad: string;
};

const COOKIES: CookieRow[] = [
  {
    nombre: 'session_id',
    proveedor: 'ayudaanimalmurcia.org',
    tipo: 'Técnica · Sesión',
    duracion: 'Sesión',
    finalidad: 'Mantener la sesión autenticada del usuario registrado.',
  },
  {
    nombre: 'csrf_token',
    proveedor: 'ayudaanimalmurcia.org',
    tipo: 'Técnica · Seguridad',
    duracion: 'Sesión',
    finalidad: 'Proteger los formularios contra ataques CSRF.',
  },
  {
    nombre: '_ga',
    proveedor: 'Google Analytics',
    tipo: 'Analítica',
    duracion: '2 años',
    finalidad: 'Distinguir usuarios únicos para estadísticas de uso del sitio.',
  },
  {
    nombre: '_ga_XXXXXX',
    proveedor: 'Google Analytics',
    tipo: 'Analítica',
    duracion: '2 años',
    finalidad: 'Mantener el estado de la sesión de Google Analytics.',
  },
  {
    nombre: 'cookie_consent',
    proveedor: 'ayudaanimalmurcia.org',
    tipo: 'Técnica · Preferencias',
    duracion: '1 año',
    finalidad: 'Almacenar la preferencia de consentimiento del usuario sobre cookies.',
  },
];

export default function PoliticaCookies() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div style={{ backgroundColor: '#f7f7f7' }} className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Cabecera */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: '#727272' }}>
            Información legal
          </p>
          <h1 className="text-3xl font-black mb-2" style={{ color: '#2e2e2e' }}>
            Política de Cookies
          </h1>
          <p className="text-sm" style={{ color: '#727272' }}>
            Última actualización: julio de 2026
          </p>
        </div>

        <div className="space-y-10 text-sm leading-relaxed" style={{ color: '#727272' }}>

          {/* 1 */}
          <section>
            <h2 className="text-base font-bold mb-3" style={{ color: '#2e2e2e' }}>
              1. ¿Qué son las cookies?
            </h2>
            <p>
              Las cookies son pequeños archivos de texto que un sitio web coloca en el dispositivo
              del usuario cuando este lo visita. Permiten recordar sus preferencias, mantener su
              sesión activa y obtener información estadística sobre el uso del sitio.
            </p>
            <p className="mt-3">
              La presente Política de Cookies se elabora conforme a lo exigido por el art. 22.2
              de la Ley 34/2002 (LSSI-CE), la Guía sobre el uso de las cookies de la AEPD
              (actualización 2023) y el Reglamento (UE) 2016/679 (RGPD).
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-base font-bold mb-3" style={{ color: '#2e2e2e' }}>
              2. Tipos de cookies que utilizamos
            </h2>
            <p className="mb-4">
              A continuación se detalla cada cookie utilizada en este sitio web:
            </p>
            {/* Tabla desktop */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr style={{ backgroundColor: '#2e2e2e', color: '#f7e3b0' }}>
                    <th className="text-left p-3 font-semibold">Nombre</th>
                    <th className="text-left p-3 font-semibold">Proveedor</th>
                    <th className="text-left p-3 font-semibold">Tipo</th>
                    <th className="text-left p-3 font-semibold">Duración</th>
                    <th className="text-left p-3 font-semibold">Finalidad</th>
                  </tr>
                </thead>
                <tbody>
                  {COOKIES.map((c, i) => (
                    <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#f7f7f7', borderBottom: '1px solid #d9d9d9' }}>
                      <td className="p-3 font-mono">{c.nombre}</td>
                      <td className="p-3">{c.proveedor}</td>
                      <td className="p-3">{c.tipo}</td>
                      <td className="p-3">{c.duracion}</td>
                      <td className="p-3">{c.finalidad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Acordeón mobile */}
            <div className="sm:hidden space-y-2">
              {COOKIES.map((c, i) => (
                <div
                  key={i}
                  className="rounded-xl border"
                  style={{ backgroundColor: '#ffffff', borderColor: '#d9d9d9' }}
                >
                  <button
                    className="w-full flex items-center justify-between p-4 text-left"
                    onClick={() => setExpanded(expanded === i ? null : i)}
                  >
                    <span className="font-mono font-semibold" style={{ color: '#2e2e2e' }}>{c.nombre}</span>
                    <span className="text-xs" style={{ color: '#727272' }}>{expanded === i ? '▲' : '▼'}</span>
                  </button>
                  {expanded === i && (
                    <div className="px-4 pb-4 space-y-1 text-xs" style={{ color: '#727272' }}>
                      <p><strong style={{ color: '#2e2e2e' }}>Proveedor:</strong> {c.proveedor}</p>
                      <p><strong style={{ color: '#2e2e2e' }}>Tipo:</strong> {c.tipo}</p>
                      <p><strong style={{ color: '#2e2e2e' }}>Duración:</strong> {c.duracion}</p>
                      <p><strong style={{ color: '#2e2e2e' }}>Finalidad:</strong> {c.finalidad}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-base font-bold mb-3" style={{ color: '#2e2e2e' }}>
              3. Base jurídica
            </h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>
                <strong style={{ color: '#2e2e2e' }}>Cookies técnicas y de sesión:</strong> no requieren
                consentimiento previo al ser estrictamente necesarias para la prestación del servicio
                solicitado por el usuario (art. 22.2 LSSI-CE, excepción).
              </li>
              <li>
                <strong style={{ color: '#2e2e2e' }}>Cookies analíticas (Google Analytics):</strong> se
                instalan únicamente tras la obtención del consentimiento libre, específico, informado e
                inequívoco del usuario (art. 6.1.a RGPD y art. 22.2 LSSI-CE).
              </li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-base font-bold mb-3" style={{ color: '#2e2e2e' }}>
              4. Cómo gestionar o desactivar las cookies
            </h2>
            <p className="mb-3">
              Puedes configurar tu navegador para aceptar, rechazar o eliminar cookies en cualquier momento.
              Ten en cuenta que desactivar ciertas cookies puede afectar al funcionamiento de algunas
              funcionalidades del sitio.
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li>
                <strong style={{ color: '#2e2e2e' }}>Google Chrome:</strong>{' '}
                Configuración → Privacidad y seguridad → Cookies y otros datos de sitios.
              </li>
              <li>
                <strong style={{ color: '#2e2e2e' }}>Mozilla Firefox:</strong>{' '}
                Opciones → Privacidad y seguridad → Cookies y datos del sitio.
              </li>
              <li>
                <strong style={{ color: '#2e2e2e' }}>Safari:</strong>{' '}
                Preferencias → Privacidad → Gestión de datos de sitios web.
              </li>
              <li>
                <strong style={{ color: '#2e2e2e' }}>Microsoft Edge:</strong>{' '}
                Configuración → Privacidad, búsqueda y servicios → Cookies.
              </li>
            </ul>
            <p className="mt-3">
              Además, puedes optar por salir del seguimiento de Google Analytics en todos los sitios web
              instalando el{' '}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#2e2e2e', textDecoration: 'underline' }}
              >
                complemento de inhabilitación de Google Analytics
              </a>.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-base font-bold mb-3" style={{ color: '#2e2e2e' }}>
              5. Renovación del consentimiento y actualizaciones
            </h2>
            <p>
              El usuario puede retirar su consentimiento en cualquier momento a través del panel de
              preferencias de cookies disponible en el banner que se muestra al acceder al sitio por
              primera vez, o borrando las cookies almacenadas desde su navegador.
            </p>
            <p className="mt-3">
              Nos reservamos el derecho a actualizar esta política cuando se produzcan cambios
              normativos o en el uso de cookies. La fecha de última actualización aparece en el
              encabezado de este documento.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-base font-bold mb-3" style={{ color: '#2e2e2e' }}>
              6. Contacto
            </h2>
            <p>
              Para cualquier consulta relacionada con el uso de cookies, puedes contactar con nosotros
              en{' '}
              <strong style={{ color: '#2e2e2e' }}>privacidad@ayudaanimalmurcia.org</strong>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
