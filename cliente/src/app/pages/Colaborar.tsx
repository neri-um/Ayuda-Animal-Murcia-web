
import { Link } from 'react-router';
import { Heart, Home, HandHeart, Gift, GraduationCap } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';

const opciones = [
  {
    to: '/colaborar/voluntariado',
    icono: <HandHeart className="w-6 h-6" />,
    titulo: 'Voluntariado',
    desc: 'Colabora en el día a día de la protectora: gestión de casos, redes sociales, eventos y mucho más.',
  },
  {
    to: '/colaborar/voluntariado-umu',
    icono: <GraduationCap className="w-6 h-6" />,
    titulo: 'Voluntariado UMU',
    desc: 'Si eres estudiante de la Universidad de Murcia, colabora con nosotros y consigue CRAU.',
  },
  {
    to: '/colaborar/acogida',
    icono: <Home className="w-6 h-6" />,
    titulo: 'Casa de acogida',
    desc: 'Ofrece tu hogar temporalmente a animales que necesitan un entorno seguro mientras encuentran familia.',
  },
  {
    to: '/colaborar/donativo',
    icono: <Gift className="w-6 h-6" />,
    titulo: 'Donativo',
    desc: 'Ayúdanos con una donación económica puntual o recurrente, o a través de nuestra lista de deseos.',
  },
];

export default function Colaborar() {
  usePageMeta({
    title: 'Colabora con nosotros | Ayuda Animal Murcia',
    description: 'Voluntariado, acogida, hogares de descanso y donaciones: descubre cómo ayudar a los animales de Murcia.',
    path: '/colaborar',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold mb-2" style={{ color: '#2e2e2e' }}>Formas de colaborar</h1>
      <p className="text-sm mb-8" style={{ color: '#727272' }}>
        Tu ayuda es fundamental para que podamos seguir cuidando y encontrando hogar a los animales que rescatamos.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {opciones.map(o => (
          <Link
            key={o.to}
            to={o.to}
            className="group rounded-2xl border p-6 text-left transition-all hover:-translate-y-1 hover:shadow-md"
            style={{ backgroundColor: '#f7f7f7', borderColor: '#d9d9d9' }}
          >
            <div className="mb-3" style={{ color: '#547792' }}>{o.icono}</div>
            <h3 className="font-bold mb-1 flex items-center gap-1" style={{ color: '#2e2e2e' }}>
              {o.titulo}
              <span className="text-sm transition-transform group-hover:translate-x-1" style={{ color: '#547792' }}>→</span>
            </h3>
            <p className="text-sm" style={{ color: '#727272' }}>{o.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
