import { Link } from 'react-router';
import {
  Heart, Users, Shield, Award, Clock, MapPin,
  PawPrint, CheckCircle2, ArrowRight, Star, Handshake
} from 'lucide-react';
import { SITE_CONFIG } from '../data/siteConfig';
import { useApp } from '../context/AppContext';
import { useMemo } from 'react';

const VALUES = [
  {
    icon: Heart,
    title: 'Amor incondicional',
    desc: 'Cada animal que llega a nuestra protectora recibe cuidados, afecto y toda la atención que necesita mientras espera su hogar.',
  },
  {
    icon: Shield,
    title: 'Bienestar garantizado',
    desc: 'Contamos con protocolos veterinarios rigurosos y revisamos el estado de salud de todos los animales antes de darlos en adopción.',
  },
  {
    icon: Users,
    title: 'Equipo comprometido',
    desc: 'Somos un equipo de voluntarios y profesionales que dedica tiempo y esfuerzo diario al cuidado y socialización de los animales.',
  },
  {
    icon: Handshake,
    title: 'Adopción responsable',
    desc: 'Acompañamos a las familias en todo el proceso para asegurar que la convivencia sea feliz tanto para la familia como para el animal.',
  },
  {
    icon: Award,
    title: 'Seguimiento continuo',
    desc: 'Tras la adopción, mantenemos contacto con las familias para garantizar una adaptación exitosa y resolver cualquier duda.',
  },
  {
    icon: Star,
    title: 'Transparencia total',
    desc: 'Informamos con honestidad sobre el carácter, historial y necesidades especiales de cada animal antes de la adopción.',
  },
];

const TEAM_ROLES = [
  { role: 'Coordinadora general', name: 'Dirección de la protectora', emoji: '👩\u200d💼' },
  { role: 'Veterinaria', name: 'Salud y protocolos médicos', emoji: '🩺' },
  { role: 'Voluntarios activos', name: '+20 personas comprometidas', emoji: '🤝' },
  { role: 'Red de acogida', name: 'Familias acogedoras', emoji: '🏡' },
];

export default function QuienesSomos() {
  const { animals } = useApp();

  const stats = useMemo(() => {
    const adoptedInApp = animals.filter(a => a.status === 'ADOPTADO').length;
    const total = adoptedInApp + SITE_CONFIG.ADOPTED_BEFORE_APP;
    const available = animals.filter(a => a.status === 'EN_ADOPCION').length;
    const years = new Date().getFullYear() - SITE_CONFIG.FOUNDING_YEAR;
    return {
      adopted: total > 0 ? `${total}+` : `${SITE_CONFIG.ADOPTED_BEFORE_APP}+`,
      available: String(available),
      years: `${years}`,
      volunteers: '20+',
    };
  }, [animals]);

  return (
    <div>
      {/* Hero */}
      <section className="relative py-24 overflow-hidden" style={{ backgroundColor: '#2e2e2e' }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <PawPrint className="absolute" style={{ width: '20rem', height: '20rem', top: '-2rem', right: '-2rem', transform: 'rotate(20deg)', color: 'rgba(255,255,255,0.04)' }} />
          <PawPrint className="absolute" style={{ width: '10rem', height: '10rem', bottom: '2rem', left: '-1rem', transform: 'rotate(-15deg)', color: 'rgba(255,255,255,0.03)' }} />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm mb-6" style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: '#f0e8d0' }}>
            <Heart className="w-4 h-4" style={{ fill: '#f0e8d0', color: '#f0e8d0' }} />
            Nuestra historia
          </div>
          <h1 className="mb-6" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, lineHeight: 1.2, color: '#f0e8d0' }}>
            Llevamos {stats.years} años dando<br />
            <span style={{ color: '#e8a020' }}>segundas oportunidades</span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(240,232,208,0.75)' }}>
            Ayuda Animal Murcia nació en {SITE_CONFIG.FOUNDING_YEAR} con una misión clara: rescatar, cuidar y encontrar hogar para los animales que más lo necesitan en la Región de Murcia.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 50L1440 50L1440 15C1200 50 900 0 720 15C540 30 240 0 0 15L0 50Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: stats.adopted, label: 'Animales adoptados', icon: Heart },
              { value: stats.available, label: 'Disponibles ahora', icon: PawPrint },
              { value: stats.years, label: 'Años de experiencia', icon: Star },
              { value: stats.volunteers, label: 'Voluntarios activos', icon: Users },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="text-center p-6 rounded-2xl border border-gray-100 shadow-sm" style={{ backgroundColor: '#faf7f0' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#f0e8d0' }}>
                    <Icon className="w-6 h-6" style={{ color: '#2e2e2e' }} />
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#2e2e2e' }}>{s.value}</div>
                  <div className="text-gray-500 text-sm mt-1">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Misión */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div className="relative h-96 lg:h-[440px] rounded-3xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800"
                alt="Perros en la protectora"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(46,46,46,0.4), transparent)' }} />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm mb-4" style={{ backgroundColor: '#f0e8d0', color: '#2e2e2e' }}>
                <Heart className="w-4 h-4" />
                Nuestra misión
              </div>
              <h2 className="text-gray-900 mb-5" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700 }}>
                Rescatamos, cuidamos<br />y encontramos hogares
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                En Ayuda Animal Murcia recogemos animales abandonados, maltratados o en situación de riesgo en la Región de Murcia. Cada animal recibe atención veterinaria, un espacio seguro y todo el cariño que necesita mientras esperamos el hogar perfecto para él.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed mb-8">
                Creemos firmemente en la adopción responsable: valoramos las solicitudes con cuidado, informamos honestamente sobre cada animal y acompañamos a las familias después de la adopción.
              </p>
              <ul className="space-y-3">
                {[
                  'Revisión veterinaria completa antes de cada adopción',
                  'Animales socializados y evaluados por comportamiento',
                  'Proceso de adopción transparente y sin presiones',
                  'Seguimiento post-adopción durante 3 meses',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#e8a020' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-gray-900 mb-2">Nuestros valores</h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">Los principios que guían cada decisión que tomamos</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow" style={{ backgroundColor: '#faf7f0' }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#f0e8d0' }}>
                    <Icon className="w-5 h-5" style={{ color: '#2e2e2e' }} />
                  </div>
                  <h4 className="text-gray-900 mb-2" style={{ fontWeight: 600 }}>{v.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section className="py-20" style={{ backgroundColor: '#f0e8d0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="mb-2" style={{ color: '#2e2e2e' }}>¿Quién hay detrás?</h2>
            <p className="text-sm max-w-md mx-auto" style={{ color: '#5a5a5a' }}>Un equipo de personas que dedica su tiempo libre a mejorar la vida de los animales</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-14">
            {TEAM_ROLES.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-white/60">
                <div className="text-4xl mb-3">{t.emoji}</div>
                <div className="text-sm text-gray-900 mb-1" style={{ fontWeight: 600 }}>{t.role}</div>
                <div className="text-xs text-gray-500">{t.name}</div>
              </div>
            ))}
          </div>

          {/* Voluntariado CTA */}
          <div className="max-w-3xl mx-auto rounded-3xl p-10 text-center" style={{ backgroundColor: '#2e2e2e' }}>
            <div className="text-3xl mb-3">🐾</div>
            <h3 className="mb-3" style={{ fontWeight: 700, fontSize: '1.4rem', color: '#f0e8d0' }}>¿Quieres unirte a nuestro equipo?</h3>
            <p className="text-sm mb-6 max-w-xl mx-auto leading-relaxed" style={{ color: 'rgba(240,232,208,0.7)' }}>
              Si quieres ayudar como voluntario, acogida temporal o simplemente contribuir a nuestra causa, escríbenos. Cada mano cuenta.
            </p>
            <Link
              to="/contacto"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm transition-all hover:shadow-lg"
              style={{ fontWeight: 600, backgroundColor: '#f0e8d0', color: '#2e2e2e' }}
            >
              Contáctanos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Horario y ubicación */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4 p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#f0e8d0' }}>
                <Clock className="w-6 h-6" style={{ color: '#2e2e2e' }} />
              </div>
              <div>
                <h4 className="text-gray-900 mb-3" style={{ fontWeight: 600 }}>Horario de visitas</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>Lunes a Viernes: 9:00 – 18:00</li>
                  <li>Sábados: 10:00 – 14:00</li>
                  <li>Domingos y festivos: Cerrado</li>
                </ul>
                <p className="text-xs text-gray-400 mt-2">Se recomienda visita concertada previamente</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#f0e8d0' }}>
                <MapPin className="w-6 h-6" style={{ color: '#2e2e2e' }} />
              </div>
              <div>
                <h4 className="text-gray-900 mb-3" style={{ fontWeight: 600 }}>Dónde estamos</h4>
                <p className="text-sm text-gray-600">Región de Murcia</p>
                <Link to="/contacto" className="inline-flex items-center gap-1 text-sm mt-3" style={{ color: '#2e2e2e', fontWeight: 500 }}>
                  Ver cómo llegar <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA adoptar */}
      <section className="py-16" style={{ backgroundColor: '#f0e8d0' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mb-4" style={{ fontWeight: 700, fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: '#2e2e2e' }}>
            ¿Listo para adoptar?
          </h2>
          <p className="text-sm mb-8 max-w-xl mx-auto" style={{ color: '#5a5a5a' }}>
            Explora nuestros animales disponibles y encuentra a tu compañero ideal. El proceso es sencillo y estamos aquí para ayudarte en cada paso.
          </p>
          <Link
            to="/adoptar"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl transition-all hover:shadow-lg hover:opacity-90"
            style={{ backgroundColor: '#2e2e2e', color: '#f0e8d0', fontWeight: 600 }}
          >
            <PawPrint className="w-5 h-5" />
            Ver animales disponibles
          </Link>
        </div>
      </section>
    </div>
  );
}
