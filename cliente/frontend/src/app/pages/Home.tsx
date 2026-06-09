import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router';
import {
  Heart, Search, SlidersHorizontal, X, PawPrint, ArrowRight,
  CheckCircle2, Dog, Cat, Rabbit, Squirrel, HandHeart,
  Home as HomeIcon, Users, Gift, ChevronDown, Star, Award,
  MapPin, Clock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Animal, AnimalSize, AnimalGender, Species, AnimalStatus } from '../data/mockData';
import { AnimalStatusBadge } from '../components/StatusBadge';
import { SITE_CONFIG } from '../data/siteConfig';
import { useInView, useCounter } from '../hooks/useInView';

// ── Helpers ───────────────────────────────────────────────────────────────────

function calcAge(birthDate?: string | null): string {
  if (!birthDate) return 'Desconocida';
  const diff = Date.now() - new Date(birthDate).getTime();
  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44));
  if (months <= 0) return 'Recién llegado';
  if (months < 12) return `${months} ${months === 1 ? 'mes' : 'meses'}`;
  const y = Math.floor(months / 12);
  const m = months % 12;
  return m === 0 ? `${y} ${y === 1 ? 'año' : 'años'}` : `${y}a ${m}m`;
}

const GENDER_LABEL: Record<string, string> = { MACHO: 'Macho', HEMBRA: 'Hembra' };

// ── Animation wrapper ─────────────────────────────────────────────────────────

function FadeUp({
  children, delay = 0, className = '',
}: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(2rem)',
      transition: `opacity 0.7s ${delay}ms ease, transform 0.7s ${delay}ms ease`,
    }}>
      {children}
    </div>
  );
}

// ── Wave dividers ─────────────────────────────────────────────────────────────

function WaveDown({ fill, bg }: { fill: string; bg: string }) {
  return (
    <div style={{ backgroundColor: bg, lineHeight: 0 }}>
      <svg viewBox="0 0 1440 56" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
        style={{ display: 'block', width: '100%', height: '56px' }}>
        <path d="M0 0L48 5.3C96 10.7 192 21.3 288 26.7C384 32 480 32 576 26.7C672 21.3 768 10.7 864 10.7C960 10.7 1056 21.3 1152 26.7C1248 32 1344 32 1392 32L1440 32V56H1392C1344 56 1248 56 1152 56C1056 56 960 56 864 56C768 56 672 56 576 56C480 56 384 56 288 56C192 56 96 56 48 56L0 56Z" fill={fill} />
      </svg>
    </div>
  );
}

function WaveUp({ fill, bg }: { fill: string; bg: string }) {
  return (
    <div style={{ backgroundColor: bg, lineHeight: 0 }}>
      <svg viewBox="0 0 1440 56" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
        style={{ display: 'block', width: '100%', height: '56px' }}>
        <path d="M0 56L48 50.7C96 45.3 192 34.7 288 29.3C384 24 480 24 576 29.3C672 34.7 768 45.3 864 45.3C960 45.3 1056 34.7 1152 29.3C1248 24 1344 24 1392 24L1440 24V0H1392C1344 0 1248 0 1152 0C1056 0 960 0 864 0C768 0 672 0 576 0C480 0 384 0 288 0C192 0 96 0 48 0L0 0Z" fill={fill} />
      </svg>
    </div>
  );
}

// ── Static data ───────────────────────────────────────────────────────────────

const HERO_IMAGES = [
  'https://i.ibb.co/v6TMccF3/Sin-t-tulo.jpg',
  'https://i.ibb.co/V1qHhCz/100-0079.jpg',
  'https://i.ibb.co/dwtF44L8/100-90.jpg',
];

const TIMELINE = [
  { year: '2019', title: 'Nace la protectora', desc: 'Todo comenzó con el rescate de cinco perros abandonados en el extrarradio de Murcia. Un grupo de voluntarios decidió que ya era hora de actuar y fundaron Ayuda Animal Murcia.' },
  { year: '2020', title: 'Primeras 50 adopciones', desc: 'En apenas un año, 50 animales encontraron hogar. Se creó el primer formulario de adopción y se formalizó la red de voluntarios con más de 10 personas comprometidas.' },
  { year: '2021', title: 'Red de acogida temporal', desc: 'Se lanzó el programa de familias acogedoras, permitiendo dar cobijo temporal a los animales mientras esperan su hogar definitivo.' },
  { year: '2022', title: 'Protocolos veterinarios', desc: 'Implementamos protocolos médicos estandarizados para garantizar que cada animal llegue sano, vacunado y esterilizado a su nueva familia adoptante.' },
  { year: '2023', title: '100 adopciones: hito histórico', desc: 'Un momento para celebrar: 100 animales encontraron su hogar definitivo. El equipo celebró con una jornada de puertas abiertas en Murcia.' },
  { year: '2024', title: 'Plataforma digital', desc: 'Lanzamos esta plataforma para modernizar la gestión interna y digitalizar el proceso de adopción.' },
];

const HELP_CARDS = [
  { icon: Heart,    title: 'Adopta',              desc: 'Dale un hogar permanente. El proceso es sencillo y te acompañamos en cada paso.',                   href: '#animales',      cta: 'Ver animales',       isAnchor: true  },
  { icon: HomeIcon, title: 'Acoger temporalmente', desc: 'Abre tu casa mientras el animal espera su familia definitiva. Una semana cambia una vida.',           href: '/contacto',      cta: 'Más información',    isAnchor: false },
  { icon: Users,    title: 'Hazte voluntario/a',   desc: 'Ayúdanos a cuidar y socializar a los animales. Cualquier hora que puedas dedicar es bienvenida.',     href: '/contacto',      cta: 'Apúntate',           isAnchor: false },
  { icon: Gift,     title: 'Dona',                 desc: 'Tu aportación cubre veterinario, alimentación y refugio. Cada euro llega directamente a los animales.', href: '/contacto',     cta: 'Cómo donar',         isAnchor: false },
];

// ── Overlap stat item ─────────────────────────────────────────────────────────

function OverlapStat({ target, suffix = '+', label, color, delay = 0 }: {
  target: number; suffix?: string; label: string; color: string; delay?: number;
}) {
  const { ref, inView } = useInView(0.3);
  const count = useCounter(target, 2000, inView);
  return (
    <div ref={ref} className="text-center py-7 px-4"
      style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(1rem)', transition: `all 0.6s ${delay}ms ease` }}>
      <div style={{ fontSize: '2.4rem', fontWeight: 800, lineHeight: 1, color }}>
        +{count}{suffix !== '+' ? suffix : ''}
      </div>
      <div className="text-gray-500 text-sm mt-1.5 font-medium">{label}</div>
    </div>
  );
}

// ── Animal card ───────────────────────────────────────────────────────────────

function AnimalCard({ animal }: { animal: Animal }) {
  const genderSymbol = animal.gender?.toUpperCase() === 'MACHO' ? '♂' : '♀';
  const genderLabel  = GENDER_LABEL[animal.gender?.toUpperCase() ?? ''] ?? animal.gender;
  return (
    <Link to={`/animals/${animal.id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
      <div className="relative h-52 overflow-hidden bg-gray-100 flex-shrink-0">
        <img src={animal.imageUrl} alt={animal.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-3 left-3"><AnimalStatusBadge status={animal.status} /></div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-gray-600">
          {genderSymbol} {genderLabel}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-gray-900">{animal.name}</h3>
            <p className="text-sm text-gray-500">{animal.breed}</p>
          </div>
          <span className="text-xs px-2 py-1 rounded-full border flex-shrink-0 ml-2"
            style={{ backgroundColor: '#dce8ed', color: '#213448', borderColor: '#b5cdd8' }}>
            {calcAge(animal.birthDate)}
          </span>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed flex-1">{animal.description}</p>
        {animal.status === 'EN_ADOPCION' && (
          <div className="mt-3 flex items-center gap-1.5 text-sm" style={{ fontWeight: 500, color: '#547792' }}>
            <Heart className="w-4 h-4" /> ¡Quiero adoptarlo!
          </div>
        )}
      </div>
    </Link>
  );
}

// ── Timeline item ─────────────────────────────────────────────────────────────

function TimelineItem({ item, index }: { item: typeof TIMELINE[number]; index: number }) {
  const isLeft = index % 2 === 0;
  const { ref, inView } = useInView(0.2);
  const card = (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-md inline-block mb-3"
        style={{ backgroundColor: '#dce8ed', color: '#547792' }}>
        {item.year}
      </span>
      <h4 className="text-gray-900 mb-2" style={{ fontWeight: 700 }}>{item.title}</h4>
      <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
    </div>
  );
  return (
    <div ref={ref} className="relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-8 items-center"
      style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(2rem)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}>
      <div className={isLeft ? 'block' : 'hidden md:block'}>{isLeft && card}</div>
      <div className="hidden md:flex flex-col items-center">
        <div className="w-4 h-4 rounded-full border-4 border-white shadow-lg z-10" style={{ backgroundColor: '#547792' }} />
      </div>
      <div className={!isLeft ? 'block' : 'hidden md:block'}>{!isLeft && card}</div>
      <div className="md:hidden">{isLeft && <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-md inline-block mb-3" style={{ backgroundColor: '#dce8ed', color: '#547792' }}>{item.year}</span>
        <h4 className="text-gray-900 mb-2" style={{ fontWeight: 700 }}>{item.title}</h4>
        <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
      </div>}</div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Home() {
  const { animals } = useApp();

  const [heroImg, setHeroImg]             = useState(0);
  const [search, setSearch]               = useState('');
  const [speciesFilter, setSpeciesFilter] = useState<Species | ''>('');
  const [sizeFilter, setSizeFilter]       = useState<AnimalSize | ''>('');
  const [genderFilter, setGenderFilter]   = useState<AnimalGender | ''>('');
  const [statusFilter, setStatusFilter]   = useState<AnimalStatus | ''>('');
  const [showFilters, setShowFilters]     = useState(false);
  const [timelineExpanded, setTimelineExpanded] = useState(false);

  // Auto-advance carousel
  useEffect(() => {
    const t = setInterval(() => setHeroImg(i => (i + 1) % HERO_IMAGES.length), 4500);
    return () => clearInterval(t);
  }, []);

  const stats = useMemo(() => {
    const adoptedInApp  = animals.filter(a => a.status === 'ADOPTADO').length;
    const total         = adoptedInApp + SITE_CONFIG.ADOPTED_BEFORE_APP;
    const available     = animals.filter(a => a.status === 'EN_ADOPCION').length;
    const yearsExp      = new Date().getFullYear() - SITE_CONFIG.FOUNDING_YEAR;
    const thisYear      = adoptedInApp > 0 ? adoptedInApp : SITE_CONFIG.ADOPTED_THIS_YEAR;
    return { adopted: total || SITE_CONFIG.ADOPTED_BEFORE_APP, available, yearsExp, thisYear };
  }, [animals]);

  const filtered = useMemo(() => animals.filter(a => {
    const q = search.toLowerCase();
    if (search && !a.name.toLowerCase().includes(q) && !a.breed.toLowerCase().includes(q)) return false;
    if (speciesFilter && a.species !== speciesFilter) return false;
    if (sizeFilter    && a.size    !== sizeFilter)    return false;
    if (genderFilter  && a.gender  !== genderFilter)  return false;
    if (statusFilter  && a.status  !== statusFilter)  return false;
    return true;
  }), [animals, search, speciesFilter, sizeFilter, genderFilter, statusFilter]);

  const activeFilterCount = [speciesFilter, sizeFilter, genderFilter, statusFilter].filter(Boolean).length;
  const clearFilters = () => { setSearch(''); setSpeciesFilter(''); setSizeFilter(''); setGenderFilter(''); setStatusFilter(''); };
  const visibleTimeline = timelineExpanded ? TIMELINE : TIMELINE.slice(0, 3);

  return (
    <div>

      {/* ══ 1. HERO — split layout ════════════════════════════════════════════ */}
      <section style={{ backgroundColor: '#EAE0CF', minHeight: '92vh' }}
        className="flex flex-col justify-center">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* ── Left: text ── */}
            <div>
              <p className="text-gray-500 mb-5 italic" style={{ fontSize: '1.05rem' }}>
                Refugio para el rescate y cuidado de animales
              </p>

              <h1 style={{
                fontSize: 'clamp(2.8rem, 5.5vw, 4.6rem)',
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                color: '#1c3043',
              }}>
                Cada animal<br />
                merece un hogar
              </h1>

              <p className="mt-6 mb-10 text-gray-600 leading-relaxed"
                style={{ fontSize: '1.1rem', maxWidth: '460px' }}>
                En Ayuda Animal Murcia rescatamos, rehabilitamos y encontramos familia para los animales
                más vulnerables de la Región de Murcia. Más de{' '}
                <strong style={{ color: '#213448' }}>{stats.adopted} vidas</strong> transformadas
                desde {SITE_CONFIG.FOUNDING_YEAR}.
              </p>

              <a href="#animales"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-white font-bold transition-all hover:opacity-90 hover:shadow-xl hover:-translate-y-0.5"
                style={{ backgroundColor: '#547792', fontSize: '1rem' }}>
                <PawPrint className="w-5 h-5" />
                Ver animales en adopción
              </a>

              <div className="mt-10 flex items-center gap-8">
                {[
                  { n: `${stats.thisYear}+`, label: 'Adoptados este año' },
                  { n: `${stats.available}`, label: 'Disponibles ahora' },
                ].map((s, i) => (
                  <div key={i}>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#213448', lineHeight: 1 }}>{s.n}</div>
                    <div className="text-gray-500 text-xs mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: image carousel ── */}
            <div className="relative">
              {/* Main image card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl"
                style={{ height: 'clamp(360px, 50vw, 580px)', boxShadow: '0 32px 64px rgba(33,52,72,0.2)' }}>
                {HERO_IMAGES.map((src, i) => (
                  <div key={i} className="absolute inset-0 transition-opacity duration-700"
                    style={{ opacity: i === heroImg ? 1 : 0 }}>
                    <img src={src} alt="Animales de la protectora" className="w-full h-full object-cover" />
                  </div>
                ))}

                {/* Dot navigation */}
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                  {HERO_IMAGES.map((_, i) => (
                    <button key={i} onClick={() => setHeroImg(i)} aria-label={`Imagen ${i + 1}`}
                      className="rounded-full transition-all duration-300"
                      style={{
                        width: i === heroImg ? '28px' : '10px',
                        height: '10px',
                        backgroundColor: i === heroImg ? 'white' : 'rgba(255,255,255,0.45)',
                      }} />
                  ))}
                </div>

                {/* Arrow controls */}
                <button onClick={() => setHeroImg(i => (i - 1 + HERO_IMAGES.length) % HERO_IMAGES.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:bg-white transition-colors shadow"
                  aria-label="Anterior">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <button onClick={() => setHeroImg(i => (i + 1) % HERO_IMAGES.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:bg-white transition-colors shadow"
                  aria-label="Siguiente">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>

              {/* Floating "este año" badge */}
              <div className="absolute -bottom-5 -left-4 bg-white rounded-2xl px-4 py-3 shadow-xl border border-gray-100 hidden lg:flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#dce8ed' }}>
                  <Heart className="w-4 h-4 fill-current" style={{ color: '#547792' }} />
                </div>
                <div>
                  <div className="text-xs text-gray-400">Este año</div>
                  <div className="text-sm font-bold text-gray-900">{stats.thisYear}+ adoptados 🎉</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══ 2. STATS BAR — overlapping ═══════════════════════════════════════ */}
      <div className="relative z-10 -mt-8 px-4 sm:px-6 lg:px-8 pb-2 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
            <OverlapStat target={stats.adopted}  label="Animales rescatados"  color="#213448" delay={0}   />
            <OverlapStat target={stats.yearsExp} label="Años de experiencia"  color="#547792" delay={120} />
            <OverlapStat target={22}             label="Voluntarios activos"  color="#94B4C1" delay={240} />
          </div>
        </div>
      </div>

      {/* ══ 3. ABOUT / MISSION ═══════════════════════════════════════════════ */}
      <section className="py-24 bg-white mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            <FadeUp>
              <div className="relative">
                <div className="relative h-[420px] rounded-3xl overflow-hidden shadow-2xl">
                  <img src="https://i.ibb.co/dwtF44L8/100-90.jpg" alt="Animales en la protectora"
                    className="w-full h-full object-cover" />
                  <div className="absolute inset-0 rounded-3xl" style={{ background: 'linear-gradient(to top, rgba(33,52,72,0.3), transparent)' }} />
                </div>
                <div className="absolute -bottom-6 -right-4 bg-white rounded-2xl px-5 py-4 shadow-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#dce8ed' }}>
                      <Award className="w-5 h-5" style={{ color: '#547792' }} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Fundada en</div>
                      <div className="text-gray-900 font-bold">{SITE_CONFIG.FOUNDING_YEAR} · Murcia</div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={150}>
              <div className="inline-flex items-center gap-2 rounded-lg px-4 py-1.5 text-sm mb-6"
                style={{ backgroundColor: '#dce8ed', color: '#213448' }}>
                <Heart className="w-4 h-4" /> Quiénes somos
              </div>
              <h2 className="text-gray-900 mb-6" style={{ fontWeight: 700, fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', lineHeight: 1.25 }}>
                Llevamos {stats.yearsExp} años<br />cuidando vidas
              </h2>
              <p className="text-gray-600 leading-relaxed mb-5">
                <strong>Ayuda Animal Murcia</strong> nació con una misión clara: dar una segunda oportunidad
                a los animales que más lo necesitan. Desde {SITE_CONFIG.FOUNDING_YEAR} hemos acogido,
                rehabilitado y encontrado hogar para más de <strong>{stats.adopted} animales</strong>.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Creemos en la <strong>adopción responsable</strong>: informamos con honestidad sobre cada
                animal y acompañamos a las familias después de la adopción para garantizar una convivencia feliz.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Revisión veterinaria completa antes de cada adopción',
                  'Animales socializados y evaluados por comportamiento',
                  'Seguimiento post-adopción durante 3 meses',
                  'Proceso transparente, sin presiones',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#547792' }} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/quienes-somos"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white transition-all hover:shadow-lg hover:opacity-90"
                style={{ backgroundColor: '#547792', fontWeight: 600 }}>
                Conoce nuestra historia <ArrowRight className="w-4 h-4" />
              </Link>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ══ 4. HOW TO HELP ═══════════════════════════════════════════════════ */}
      <WaveDown fill="#f0f6f9" bg="white" />
      <section style={{ backgroundColor: '#f0f6f9' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <FadeUp className="text-center mb-16">
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#547792' }}>Súmate a la causa</p>
            <h2 className="text-gray-900 mb-3" style={{ fontWeight: 700, fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)' }}>
              ¿Cómo puedes ayudar?
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Hay muchas formas de marcar la diferencia. Cada contribución, grande o pequeña, cambia vidas.
            </p>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HELP_CARDS.map((card, i) => {
              const Icon = card.icon;
              const inner = (
                <div className="group h-full bg-white rounded-2xl p-7 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col cursor-pointer border border-gray-100">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: '#dce8ed' }}>
                    <Icon className="w-6 h-6" style={{ color: '#547792' }} />
                  </div>
                  <h3 className="text-gray-900 mb-3" style={{ fontWeight: 700 }}>{card.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1">{card.desc}</p>
                  <div className="flex items-center gap-1.5 mt-6 text-sm font-semibold group-hover:gap-3 transition-all" style={{ color: '#547792' }}>
                    {card.cta} <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              );
              return (
                <FadeUp key={i} delay={i * 80}>
                  {card.isAnchor
                    ? <a href={card.href} className="block h-full">{inner}</a>
                    : <Link to={card.href} className="block h-full">{inner}</Link>}
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>
      <WaveUp fill="#f0f6f9" bg="white" />

      {/* ══ 5. TIMELINE ══════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-16">
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#547792' }}>Nuestra historia</p>
            <h2 className="text-gray-900 mb-3" style={{ fontWeight: 700, fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)' }}>El camino recorrido</h2>
            <p className="text-gray-500 max-w-md mx-auto">Desde los primeros rescates hasta hoy: los hitos que han marcado nuestra trayectoria.</p>
          </FadeUp>
          <div className="relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2" style={{ backgroundColor: '#dce8ed' }} />
            <div className="space-y-10">
              {visibleTimeline.map((item, i) => <TimelineItem key={item.year} item={item} index={i} />)}
            </div>
          </div>
          {TIMELINE.length > 3 && (
            <FadeUp className="text-center mt-12">
              <button onClick={() => setTimelineExpanded(v => !v)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 transition-all hover:shadow-md text-sm font-semibold"
                style={{ borderColor: '#547792', color: '#547792' }}>
                {timelineExpanded
                  ? <>Mostrar menos <ChevronDown className="w-4 h-4 rotate-180" /></>
                  : <>Ver toda la historia <ChevronDown className="w-4 h-4" /></>}
              </button>
            </FadeUp>
          )}
        </div>
      </section>

      {/* ══ 6. ANIMALES ══════════════════════════════════════════════════════ */}
      <WaveDown fill="#EAE0CF" bg="white" />
      <section id="animales" style={{ backgroundColor: '#EAE0CF' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <FadeUp className="text-center mb-10">
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#547792' }}>Encuentra tu compañero</p>
            <h2 className="text-gray-900 mb-3" style={{ fontWeight: 700, fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)' }}>Animales en adopción</h2>
            <p className="text-gray-500 max-w-md mx-auto">Todos esperan una familia. ¿Será la tuya?</p>
          </FadeUp>

          {/* Search + filters */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-8">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Buscar por nombre o raza..." value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm"
                  onFocus={e => (e.currentTarget.style.borderColor = '#547792')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')} />
              </div>
              <button onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-colors text-sm"
                style={showFilters || activeFilterCount > 0
                  ? { backgroundColor: '#547792', color: '#fff', borderColor: '#547792' }
                  : { borderColor: '#e5e7eb', color: '#4b5563' }}>
                <SlidersHorizontal className="w-4 h-4" />
                Filtros
                {activeFilterCount > 0 && (
                  <span className="bg-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    style={{ fontWeight: 700, color: '#547792' }}>{activeFilterCount}</span>
                )}
              </button>
              {(activeFilterCount > 0 || search) && (
                <button onClick={clearFilters}
                  className="p-2.5 rounded-xl border border-gray-200 text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Especie', value: speciesFilter, setter: (v: string) => setSpeciesFilter(v as Species | ''), options: [['','Todas'],['PERRO','Perro'],['GATO','Gato'],['CONEJO','Conejo'],['OTRO','Otro']] },
                  { label: 'Tamaño', value: sizeFilter,    setter: (v: string) => setSizeFilter(v as AnimalSize | ''),   options: [['','Todos'],['PEQUENO','Pequeño'],['MEDIANO','Mediano'],['GRANDE','Grande']] },
                  { label: 'Sexo',   value: genderFilter,  setter: (v: string) => setGenderFilter(v as AnimalGender | ''), options: [['','Todos'],['MACHO','Macho'],['HEMBRA','Hembra']] },
                  { label: 'Estado', value: statusFilter,  setter: (v: string) => setStatusFilter(v as AnimalStatus | ''), options: [['','Todos'],['EN_ADOPCION','En adopción'],['PRE_ADOPCION','Pre-adopción'],['ADOPTADO','Adoptado'],['EN_TRATAMIENTO','En tratamiento']] },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-xs text-gray-500 mb-1">{f.label}</label>
                    <select value={f.value} onChange={e => f.setter(e.target.value)}
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none"
                      onFocus={e => (e.currentTarget.style.borderColor = '#547792')}
                      onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}>
                      {f.options.map(([val, lbl]) => <option key={val} value={val}>{lbl}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>

          <p className="text-sm text-gray-500 mb-4">
            {filtered.length} {filtered.length === 1 ? 'animal encontrado' : 'animales encontrados'}
          </p>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((animal, i) => (
                <FadeUp key={animal.id} delay={i % 4 * 60}>
                  <AnimalCard animal={animal} />
                </FadeUp>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <PawPrint className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-gray-700 mb-2">No encontramos animales</h3>
              <p className="text-gray-500 text-sm mb-4">Prueba con otros filtros o amplía tu búsqueda</p>
              <button onClick={clearFilters} className="text-sm underline" style={{ color: '#547792' }}>Limpiar filtros</button>
            </div>
          )}
        </div>
      </section>
      <WaveUp fill="#EAE0CF" bg="white" />

      {/* ══ 7. CTA BANNER ════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="relative rounded-3xl overflow-hidden text-center text-white"
              style={{ background: 'linear-gradient(135deg, #213448 0%, #2d4a64 50%, #213448 100%)' }}>
              <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
                <PawPrint style={{ width: '16rem', height: '16rem', transform: 'rotate(15deg) translate(2rem,-2rem)' }} />
              </div>
              <div className="absolute bottom-0 left-0 opacity-5 pointer-events-none">
                <PawPrint style={{ width: '10rem', height: '10rem', transform: 'rotate(-20deg) translate(-1rem,1rem)' }} />
              </div>
              <div className="relative z-10 px-8 py-16 sm:px-14 sm:py-20">
                <div className="text-5xl mb-5">🐾</div>
                <h2 className="text-white mb-4"
                  style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 800, lineHeight: 1.2 }}>
                  ¿Tienes un animal que necesita ayuda?
                </h2>
                <p className="text-white/65 mb-10 max-w-2xl mx-auto leading-relaxed" style={{ fontSize: '1.05rem' }}>
                  Si has encontrado un animal abandonado o necesitas entregarlo en buenas manos,
                  escríbenos. Siempre encontramos una solución juntos.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link to="/contacto"
                    className="inline-flex items-center gap-2 bg-white px-8 py-4 rounded-2xl transition-all hover:shadow-2xl hover:scale-105"
                    style={{ fontWeight: 700, color: '#213448', fontSize: '1rem' }}>
                    <HandHeart className="w-5 h-5" /> Contactar ahora
                  </Link>
                  <a href="#animales"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border text-white transition-all hover:bg-white/10"
                    style={{ borderColor: 'rgba(255,255,255,0.3)', fontWeight: 500, fontSize: '1rem' }}>
                    <PawPrint className="w-5 h-5" /> Ver animales
                  </a>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ══ CONTACT STRIP ════════════════════════════════════════════════════ */}
      <section className="py-12" style={{ backgroundColor: '#f8fbfc' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: MapPin, label: 'Ubicación', value: 'Región de Murcia' },
              { icon: Clock,  label: 'Horario',   value: 'Lun–Vie 9:00–18:00 · Sáb 10:00–14:00' },
              { icon: Heart,  label: 'Contacto',  value: 'info@ayudaanimalmurcia.org' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <FadeUp key={i} delay={i * 80}>
                  <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#dce8ed' }}>
                      <Icon className="w-5 h-5" style={{ color: '#547792' }} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-0.5">{item.label}</div>
                      <div className="text-sm text-gray-800 font-medium">{item.value}</div>
                    </div>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
