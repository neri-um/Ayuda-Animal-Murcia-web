
import { Link, useParams } from 'react-router';
import { ArrowLeft, ChevronRight, Heart, Home, HandHeart, Gift, GraduationCap } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import VoluntariadoForm from '../components/colaborar/VoluntariadoForm';
import VoluntariadoUmuForm from '../components/colaborar/VoluntariadoUmuForm';
import AcogidaForm from '../components/colaborar/AcogidaForm';

const panelCls = "rounded-2xl border p-6 sm:p-8 bg-white border-gray-100";

const OPCIONES = [
  { slug: 'voluntariado', titulo: 'Voluntariado', icono: <HandHeart className="w-5 h-5" /> },
  { slug: 'voluntariado-umu', titulo: 'Voluntariado UMU', icono: <GraduationCap className="w-5 h-5" /> },
  { slug: 'acogida', titulo: 'Casa de acogida', icono: <Home className="w-5 h-5" /> },
  { slug: 'donativo', titulo: 'Donativo', icono: <Gift className="w-5 h-5" /> },
];

function PanelDonativo() {
  return (
    <>
      <h2 className="text-xl font-bold mb-1 flex items-center gap-2" style={{ color: '#2e2e2e' }}>
        <Gift className="w-5 h-5" style={{ color: '#547792' }} />Haz un donativo
      </h2>
      <p className="text-sm mb-6" style={{ color: '#727272' }}>
        Cualquier aportación, por pequeña que sea, ayuda a cubrir veterinarios, alimento y cuidados.
      </p>
      <div className="space-y-3">
        <Link
          to="/donar"
          className="flex items-center gap-3 rounded-2xl border p-4 transition-all hover:shadow-md hover:-translate-y-0.5"
          style={{ backgroundColor: '#f7f7f7', borderColor: '#d9d9d9' }}
        >
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#f7e3b0' }}>
            <Heart className="w-5 h-5" style={{ color: '#2e2e2e' }} />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold" style={{ color: '#2e2e2e' }}>Donación económica</div>
            <div className="text-xs" style={{ color: '#727272' }}>Puntual o recurrente, directa en la página de donaciones.</div>
          </div>
          <span className="text-sm" style={{ color: '#547792' }}>→</span>
        </Link>
        <a
          href="https://www.amazon.es/hz/wishlist/ls/2RBU0YV8N3YSA?ref_=list_d_wl_ys_list_1&filter=unpurchased&sort=date-added&viewType=list"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-2xl border p-4 transition-all hover:shadow-md hover:-translate-y-0.5"
          style={{ backgroundColor: '#f7f7f7', borderColor: '#d9d9d9' }}
        >
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#f7e3b0' }}>
            <Gift className="w-5 h-5" style={{ color: '#2e2e2e' }} />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold" style={{ color: '#2e2e2e' }}>Lista de deseos de Amazon</div>
            <div className="text-xs" style={{ color: '#727272' }}>Compra pienso, mantas y accesorios directamente para los animales.</div>
          </div>
          <span className="text-sm" style={{ color: '#547792' }}>→</span>
        </a>
      </div>
    </>
  );
}

export default function ColaborarOpcion() {
  const { opcion } = useParams<{ opcion: string }>();
  const activa = OPCIONES.find(o => o.slug === opcion);

  usePageMeta({
    title: activa ? `${activa.titulo} – Colabora | Ayuda Animal Murcia` : 'Colabora | Ayuda Animal Murcia',
    description: activa
      ? `Colabora con Ayuda Animal Murcia a través de ${activa.titulo.toLowerCase()}.`
      : 'Formas de colaborar con Ayuda Animal Murcia.',
    path: `/colaborar/${opcion ?? ''}`,
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <Link
        to="/colaborar"
        className="inline-flex items-center gap-1.5 text-sm mb-4 transition-opacity hover:opacity-70"
        style={{ color: '#547792' }}
      >
        <ArrowLeft className="w-4 h-4" /> Todas las opciones
      </Link>

      <h1 className="text-3xl font-bold mb-6" style={{ color: '#2e2e2e' }}>
        {activa ? activa.titulo : 'Colabora con nosotros'}
      </h1>

      {!activa ? (
        <div className={panelCls}>
          <p className="text-sm mb-4" style={{ color: '#727272' }}>
            No hemos encontrado esa opción. Elige cómo quieres colaborar con Ayuda Animal Murcia.
          </p>
          <Link
            to="/colaborar"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all hover:opacity-90"
            style={{ backgroundColor: '#547792', color: '#ffffff' }}
          >
            Ver todas las opciones
          </Link>
        </div>
      ) : (
        <section className={panelCls}>
          {opcion === 'voluntariado' && <VoluntariadoForm />}
          {opcion === 'voluntariado-umu' && <VoluntariadoUmuForm />}
          {opcion === 'acogida' && <AcogidaForm />}
          {opcion === 'donativo' && <PanelDonativo />}
        </section>
      )}

      {activa && (
        <div className="mt-10">
          <h2 className="text-lg font-bold mb-4" style={{ color: '#2e2e2e' }}>
            ¿Prefieres otra forma de colaborar?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {OPCIONES.filter(o => o.slug !== opcion).map(o => (
              <Link
                key={o.slug}
                to={`/colaborar/${o.slug}`}
                className="group flex items-center gap-3 rounded-2xl border p-4 transition-all hover:shadow-md hover:-translate-y-0.5"
                style={{ backgroundColor: '#f7f7f7', borderColor: '#d9d9d9' }}
              >
                <div style={{ color: '#547792' }}>{o.icono}</div>
                <div className="flex-1 text-sm font-semibold" style={{ color: '#2e2e2e' }}>
                  {o.titulo}
                </div>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" style={{ color: '#547792' }} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
