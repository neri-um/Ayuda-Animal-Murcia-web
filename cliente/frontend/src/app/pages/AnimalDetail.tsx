import { useParams, Link, useNavigate } from 'react-router';
import {
  ArrowLeft, Heart, Syringe, Shield, Cpu, Calendar, Ruler, User2,
  CheckCircle, PawPrint, ChevronLeft, ChevronRight, ImageOff, Cat, Dog
} from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AnimalStatusBadge } from '../components/StatusBadge';

function calcAge(birthDate?: string | null): string {
  if (!birthDate) return 'Desconocida';
  const diff = Date.now() - new Date(birthDate).getTime();
  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44));
  if (months <= 0) return 'Recién llegado';
  if (months < 12) return `${months} ${months === 1 ? 'mes' : 'meses'}`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (rem === 0) return `${years} ${years === 1 ? 'año' : 'años'}`;
  return `${years}a ${rem}m`;
}

const sizeLabel: Record<string, string> = {
  PEQUENO: 'Pequeño',
  MEDIANO: 'Mediano',
  GRANDE: 'Grande',
  ESTANDAR: 'Estándar',
};

const speciesLabel: Record<string, string> = {
  PERRO: 'Perro',
  GATO: 'Gato',
  CONEJO: 'Conejo',
  OTRO: 'Otro',
};

function cleanUrl(url?: string | null) {
  if (!url) return '';
  const match = String(url).match(/https?:\/\/[^\s\])"]+/i);
  return match ? match[0] : String(url).replace(/^\[|\]$/g, '');
}

export default function AnimalDetail() {
  const { id } = useParams<{ id: string }>();
  const { animals } = useApp();
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  const animal = animals.find(a => a.id === id);

  const images = useMemo(() => {
    if (!animal) return [] as string[];
    const raw = [
      animal.imageUrl,
      ...(Array.isArray((animal as any).gallery) ? (animal as any).gallery : []),
    ]
      .map(cleanUrl)
      .filter(Boolean);
    return Array.from(new Set(raw));
  }, [animal]);

  useEffect(() => { setIndex(0); }, [id]);

  if (!animal) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🐾</div>
        <h2 className="text-gray-700 mb-2">Animal no encontrado</h2>
        <p className="text-gray-500 mb-6 text-sm">Este animal ya no está disponible o no existe.</p>
        <Link to="/" className="text-white px-6 py-2 rounded-xl transition-colors inline-block" style={{ backgroundColor: '#547792' }}>
          Volver al inicio
        </Link>
      </div>
    );
  }

  const traits: { icon: React.ReactNode; label: string }[] = [
    ...(animal.vaccinated  ? [{ icon: <Syringe  className="w-3.5 h-3.5" />, label: 'Vacunado' }]        : []),
    ...(animal.sterilized  ? [{ icon: <Shield   className="w-3.5 h-3.5" />, label: 'Esterilizado' }]    : []),
    ...(animal.microchip   ? [{ icon: <Cpu      className="w-3.5 h-3.5" />, label: 'Microchip' }]       : []),
    ...((animal as any).goodWithCats  ? [{ icon: <Cat    className="w-3.5 h-3.5" />, label: 'Compatible con gatos' }]   : []),
    ...((animal as any).goodWithDogs  ? [{ icon: <Dog    className="w-3.5 h-3.5" />, label: 'Compatible con perros' }]  : []),
  ];

  const currentImage = images[index] || cleanUrl(animal.imageUrl) || '';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Volver
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Galería */}
        <div className="flex flex-col gap-3">
          <div className="relative rounded-2xl overflow-hidden bg-gray-100 h-96 lg:h-[34rem]">
            {currentImage ? (
              <img src={currentImage} alt={animal.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <ImageOff className="w-10 h-10 mx-auto mb-2" />
                  <p className="text-sm">Sin imágenes</p>
                </div>
              </div>
            )}
            <div className="absolute top-4 left-4">
              <AnimalStatusBadge status={animal.status} />
            </div>
            {images.length > 1 && (
              <>
                <button type="button" onClick={() => setIndex(prev => (prev - 1 + images.length) % images.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-black/10 flex items-center justify-center text-gray-700 hover:bg-white transition-colors" aria-label="Imagen anterior">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button type="button" onClick={() => setIndex(prev => (prev + 1) % images.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-black/10 flex items-center justify-center text-gray-700 hover:bg-white transition-colors" aria-label="Imagen siguiente">
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, i) => (
                    <button key={i} type="button" onClick={() => setIndex(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${i === index ? 'bg-white scale-110' : 'bg-white/50'}`}
                      aria-label={`Ir a imagen ${i + 1}`} />
                  ))}
                </div>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((img, i) => (
                <button key={`${img}-${i}`} type="button" onClick={() => setIndex(i)}
                  className={`relative rounded-xl overflow-hidden aspect-square border transition-all ${i === index ? 'border-[#547792] ring-2 ring-[#547792]/30' : 'border-gray-200'}`}>
                  <img src={img} alt={`${animal.name} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          <div>
            <h1 className="text-gray-900" style={{ fontSize: '2rem' }}>{animal.name}</h1>
            <p className="text-gray-500">
              {speciesLabel[animal.species] ?? animal.species}{animal.breed ? ` · ${animal.breed}` : ''}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: <Calendar className="w-4 h-4" style={{ color: '#547792' }} />, label: 'Edad',   value: calcAge(animal.birthDate) },
              { icon: <Ruler    className="w-4 h-4" style={{ color: '#547792' }} />, label: 'Tamaño', value: sizeLabel[animal.size] ?? animal.size ?? '—' },
              { icon: <User2    className="w-4 h-4" style={{ color: '#547792' }} />, label: 'Sexo',   value: animal.gender?.toUpperCase() === 'MACHO' ? 'Macho' : 'Hembra' },
            ].map((info, i) => (
              <div key={i} className="rounded-xl p-3 text-center" style={{ backgroundColor: '#dce8ed' }}>
                <div className="flex justify-center mb-1">{info.icon}</div>
                <div className="text-xs text-gray-400 mb-0.5">{info.label}</div>
                <div className="text-sm text-gray-700" style={{ fontWeight: 500 }}>{info.value}</div>
              </div>
            ))}
          </div>

          {animal.description && (
            <div>
              <h3 className="text-gray-800 mb-2">Sobre {animal.name}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{animal.description}</p>
            </div>
          )}

          {traits.length > 0 && (
            <div>
              <h3 className="text-gray-800 mb-3">Características</h3>
              <div className="flex flex-wrap gap-2">
                {traits.map((t, i) => (
                  <div key={i}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border"
                    style={{ backgroundColor: '#dce8ed', color: '#213448', borderColor: '#b5cdd8' }}>
                    <CheckCircle className="w-3.5 h-3.5" style={{ color: '#547792' }} />
                    {t.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {animal.entryDate && (
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              En la protectora desde{' '}
              {new Date(animal.entryDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          )}

          {animal.status === 'EN_ADOPCION' && (
            <div className="mt-2">
              <Link to={`/adopt/${animal.id}`}
                className="flex items-center justify-center gap-2 w-full text-white py-3.5 rounded-xl transition-colors"
                style={{ backgroundColor: '#547792', fontWeight: 600 }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#3d6180')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#547792')}>
                <Heart className="w-5 h-5" />
                Quiero adoptar a {animal.name}
              </Link>
              <p className="text-center text-xs text-gray-400 mt-2">Te contactaremos en menos de 48h</p>
            </div>
          )}

          {animal.status === 'PRE_ADOPCION' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-700">
              <p style={{ fontWeight: 500 }}>🏠 En pre-adopción</p>
              <p className="mt-1 text-yellow-600">Este animal está reservado temporalmente. Si te interesa, puedes consultarnos por su disponibilidad.</p>
            </div>
          )}

          {animal.status === 'ADOPTADO' && (
            <div className="rounded-xl p-4 text-sm border" style={{ backgroundColor: '#d0e4f0', borderColor: '#a8c8e0', color: '#1e4d6e' }}>
              <p style={{ fontWeight: 500 }}>🎉 ¡Ya tiene hogar!</p>
              <p className="mt-1" style={{ color: '#2e5c7e' }}>Este animal ya fue adoptado. ¡Explora nuestros otros animales disponibles!</p>
              <Link to="/" className="underline mt-2 block" style={{ color: '#547792' }}>Ver otros animales</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
