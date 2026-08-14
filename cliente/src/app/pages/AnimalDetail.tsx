import { useParams, Link, useNavigate } from 'react-router';
import {
  ArrowLeft, Heart, Calendar, Ruler, User2,
  CheckCircle, PawPrint, ChevronLeft, ChevronRight, ImageOff, Cat, Dog, Newspaper, ArrowRight, HeartHandshake,
  Share2, Facebook, Twitter, Send
} from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AnimalStatusBadge } from '../components/StatusBadge';
import JsonLd from '../components/JsonLd';
import { usePageMeta, SITE_URL } from '../hooks/usePageMeta';
import WhatsAppIcon from '../components/WhatsAppIcon';
import { formatEnum } from '../services/enums';
import { toSlug } from '../utils/slug';
import { getEntradasDeAnimal } from '../services/blog';
import type { EntradaBlog } from '../types';

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
  PEQUENO: 'Pequeño', MEDIANO: 'Mediano', GRANDE: 'Grande', ESTANDAR: 'Estándar',
};
const speciesLabel: Record<string, string> = {
  PERRO: 'Perro', GATO: 'Gato', CONEJO: 'Conejo', OTRO: 'Otro',
};
function cleanUrl(url?: string | null) {
  if (!url) return '';
  const match = String(url).match(/https?:\/\/[^\s\])"]+/i);
  return match ? match[0] : String(url).replace(/^\[|\]$/g, '');
}

function recortarTexto(texto: string, maxPalabras = 25): string {
  const palabras = texto.trim().split(/\s+/);
  if (palabras.length <= maxPalabras) return texto;
  return palabras.slice(0, maxPalabras).join(' ') + '…';
}

export default function AnimalDetail() {
  const { id: param } = useParams<{ id: string }>();
  const { animals } = useApp();
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const animal = animals.find(a => toSlug(a.name) === param || a.id === param);
  const [entradas, setEntradas] = useState<EntradaBlog[]>([]);
  const [blogLoading, setBlogLoading] = useState(false);
  useEffect(() => {
    if (!animal) return;
    setBlogLoading(true);
    getEntradasDeAnimal(animal.id)
      .then(setEntradas)
      .catch(() => setEntradas([]))
      .finally(() => setBlogLoading(false));
  }, [animal?.id]);
  const images = useMemo(() => {
    if (!animal) return [] as string[];
    const raw = [animal.imageUrl, ...(Array.isArray((animal as any).gallery) ? (animal as any).gallery : [])]
      .map(cleanUrl).filter(Boolean);
    return Array.from(new Set(raw));
  }, [animal]);
  useEffect(() => { setIndex(0); }, [param]);

  const species = speciesLabel[animal?.species ?? ''] ?? 'Animal';
  usePageMeta({
    title: animal
      ? `${animal.name} – ${species} en adopción en Murcia | Ayuda Animal Murcia`
      : 'Animal no encontrado | Ayuda Animal Murcia',
    description: animal
      ? recortarTexto(animal.description || '', 25)
      : 'Este animal ya no está disponible o no existe.',
    image: images[0] || undefined,
    path: animal ? `/animales/${toSlug(animal.name)}` : undefined,
  });

  if (!animal) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🐾</div>
        <h2 className="text-gray-700 mb-2">Animal no encontrado</h2>
        <p className="text-gray-500 mb-6 text-sm">Este animal ya no está disponible o no existe.</p>
        <Link to="/" className="inline-block text-sm px-6 py-2 rounded-xl transition-all hover:opacity-80" style={{ backgroundColor: '#f7e3b0', color: '#2e2e2e', fontWeight: 600 }}>Volver al inicio</Link>
      </div>
    );
  }

  const traits: { icon: React.ReactNode; label: string }[] = [
    ...(animal.needsMedication ? [{ icon: <CheckCircle className="w-3.5 h-3.5" style={{ color: '#e8a020' }} />, label: 'Necesita medicación' }] : []),
    ...(animal.needsSpecialCare ? [{ icon: <CheckCircle className="w-3.5 h-3.5" style={{ color: '#e8a020' }} />, label: 'Necesita cuidados especiales' }] : []),
    ...(animal.positivoLeucemia ? [{ icon: <CheckCircle className="w-3.5 h-3.5" style={{ color: '#e8a020' }} />, label: 'Positivo/a a leucemia' }] : []),
    ...(animal.positivoInmunodeficiencia ? [{ icon: <CheckCircle className="w-3.5 h-3.5" style={{ color: '#e8a020' }} />, label: 'Positivo/a a inmunodeficiencia' }] : []),
  ];
  const convivencia: { icon: React.ReactNode; label: string }[] = [
    ...(animal.goodWithCats ? [{ icon: <Cat className="w-3.5 h-3.5" />, label: 'Compatible con gatos' }] : []),
    ...(animal.goodWithDogs ? [{ icon: <Dog className="w-3.5 h-3.5" />, label: 'Compatible con perros' }] : []),
    ...(animal.goodWithDogsLarge ? [{ icon: <Dog className="w-3.5 h-3.5" />, label: 'Compatible con perros grandes' }] : []),
    ...(animal.goodWithDogsSmall ? [{ icon: <Dog className="w-3.5 h-3.5" />, label: 'Compatible con perros pequeños' }] : []),
    ...(animal.aptoGatoUnico ? [{ icon: <Cat className="w-3.5 h-3.5" />, label: 'Apto para ser gato único' }] : []),
    ...(animal.necesitaCompaneroFelino ? [{ icon: <Cat className="w-3.5 h-3.5" />, label: 'Necesita un compañero felino' }] : []),
    ...(animal.flexibleConvivenciaFelina ? [{ icon: <Cat className="w-3.5 h-3.5" />, label: 'Apto para gato único o con compañero felino' }] : []),
    ...(animal.adopcionConjunta ? [{ icon: <HeartHandshake className="w-3.5 h-3.5" />, label: 'Adopción conjunta' }] : []),
    ...(animal.goodWithKids ? [{ icon: <CheckCircle className="w-3.5 h-3.5" />, label: 'Bueno/a con niños' }] : []),
    ...(animal.canLiveInApartment ? [{ icon: <CheckCircle className="w-3.5 h-3.5" />, label: 'Puede vivir en piso' }] : []),
    ...(animal.canLiveOutside ? [{ icon: <CheckCircle className="w-3.5 h-3.5" />, label: 'Puede vivir en exterior' }] : []),
  ];
  const currentImage = images[index] || cleanUrl(animal.imageUrl) || '';
  const shareUrl = `${SITE_URL}/animales/${toSlug(animal.name)}`;
  const shareText = `Adopta a ${animal.name} en Ayuda Animal Murcia`;

  const badge = (label: string) => (
    <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border" style={{ backgroundColor: '#f0e8d0', color: '#2e2e2e', borderColor: '#d9d0b8' }}>
      <CheckCircle className="w-3.5 h-3.5" style={{ color: '#e8a020' }} />{label}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'Animal',
        name: animal.name,
        description: recortarTexto(animal.description || '', 25),
        image: images[0] || `${SITE_URL}/favicon.png`,
        url: `${SITE_URL}/animales/${toSlug(animal.name)}`,
        species,
        breed: animal.breed || undefined,
        gender: animal.gender === 'MACHO' ? 'Male' : 'Female',
      }} />
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm transition-colors"><ArrowLeft className="w-4 h-4" />Volver</button>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="flex flex-col gap-3">
          <div className="relative rounded-2xl overflow-hidden bg-gray-100 h-96 lg:h-[34rem]">
            {currentImage ? <img src={currentImage} alt={animal.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400"><div className="text-center"><ImageOff className="w-10 h-10 mx-auto mb-2" /><p className="text-sm">Sin imágenes</p></div></div>}
            <div className="absolute top-4 left-4"><AnimalStatusBadge status={animal.status} /></div>
            {images.length > 1 && <><button type="button" onClick={() => setIndex(prev => (prev - 1 + images.length) % images.length)} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-black/10 flex items-center justify-center text-gray-700 hover:bg-white transition-colors" aria-label="Imagen anterior"><ChevronLeft className="w-5 h-5" /></button><button type="button" onClick={() => setIndex(prev => (prev + 1) % images.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-black/10 flex items-center justify-center text-gray-700 hover:bg-white transition-colors" aria-label="Imagen siguiente"><ChevronRight className="w-5 h-5" /></button><div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">{images.map((_, i) => <button key={i} type="button" onClick={() => setIndex(i)} className={`w-2.5 h-2.5 rounded-full transition-all ${i === index ? 'bg-white scale-110' : 'bg-white/50'}`} aria-label={`Ir a imagen ${i + 1}`} />)}</div></>}
          </div>
          {images.length > 1 && <div className="grid grid-cols-4 gap-2">{images.map((img, i) => <button key={`${img}-${i}`} type="button" onClick={() => setIndex(i)} className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${i === index ? 'border-[#2e2e2e]' : 'border-gray-200'}`}><img src={img} alt={`${animal.name} ${i + 1}`} className="w-full h-full object-cover" /></button>)}</div>}
        </div>
        <div className="flex flex-col gap-5">
          <div><h1 className="text-gray-900" style={{ fontSize: '2rem' }}>{animal.name}</h1><p className="text-gray-500">{speciesLabel[animal.species] ?? animal.species}{animal.breed ? ` · ${animal.breed}` : ''}</p></div>
          <div className="grid grid-cols-3 gap-3">{[{ icon: <Calendar className="w-4 h-4" style={{ color: '#727272' }} />, label: 'Edad', value: calcAge(animal.birthDate) }, { icon: <Ruler className="w-4 h-4" style={{ color: '#727272' }} />, label: 'Tamaño', value: sizeLabel[animal.size] ?? animal.size ?? '—' }, { icon: <User2 className="w-4 h-4" style={{ color: '#727272' }} />, label: 'Sexo', value: animal.gender?.toUpperCase() === 'MACHO' ? 'Macho' : 'Hembra' }].map((info, i) => <div key={i} className="rounded-xl p-3 text-center" style={{ backgroundColor: '#f7f7f7', border: '1px solid #d9d9d9' }}><div className="flex justify-center mb-1">{info.icon}</div><div className="text-xs mb-0.5" style={{ color: '#727272' }}>{info.label}</div><div className="text-sm" style={{ color: '#2e2e2e', fontWeight: 500 }}>{info.value}</div></div>)}</div>
          {animal.description && <div><h3 className="text-gray-800 mb-2">Sobre {animal.name}</h3><p className="text-gray-600 text-sm leading-relaxed">{animal.description}</p></div>}
          {traits.length > 0 && <div><h3 className="text-gray-800 mb-3">Salud</h3><div className="flex flex-wrap gap-2">{traits.map(t => badge(t.label))}</div></div>}
          {convivencia.length > 0 && <div><h3 className="text-gray-800 mb-3">Convivencia</h3><div className="flex flex-wrap gap-2">{convivencia.map(c => badge(c.label))}</div></div>}
          {Array.isArray(animal.personality) && animal.personality.length > 0 && <div><h3 className="text-gray-800 mb-3">Carácter</h3><div className="flex flex-wrap gap-2">{animal.personality.map(c => badge(formatEnum(c)))}</div></div>}
          {animal.entryDate && <p className="text-xs text-gray-400 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />En la protectora desde {new Date(animal.entryDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>}
          {animal.status === 'EN_ADOPCION' && <div className="mt-2"><Link to={`/adopcion/${toSlug(animal.name)}`} className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl transition-all hover:opacity-80" style={{ backgroundColor: '#f7e3b0', color: '#2e2e2e', fontWeight: 600 }}><Heart className="w-5 h-5" />Quiero adoptar a {animal.name}</Link><p className="text-center text-xs text-gray-400 mt-2">Te contactaremos lo antes posible</p></div>}
          {animal.status === 'PRE_ADOPCION' && <div className="rounded-xl p-4 text-sm border" style={{ backgroundColor: '#f0e8d0', borderColor: '#d9d0b8', color: '#2e2e2e' }}><p style={{ fontWeight: 500 }}>🏠 En pre-adopción</p><p className="mt-1" style={{ color: '#727272' }}>Este animal está reservado temporalmente. Si te interesa, puedes consultarnos por su disponibilidad.</p></div>}
          {animal.status === 'ADOPTADO' && <div className="rounded-xl p-4 text-sm border" style={{ backgroundColor: '#f7f7f7', borderColor: '#d9d9d9', color: '#2e2e2e' }}><p style={{ fontWeight: 500 }}>🎉 ¡Ya tiene hogar!</p><p className="mt-1" style={{ color: '#727272' }}>Este animal ya fue adoptado. ¡Explora nuestros otros animales disponibles!</p><Link to="/adoptar" className="underline mt-2 block" style={{ color: '#2e2e2e' }}>Ver otros animales</Link></div>}
      </div>
      </div>

      {entradas.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-1 flex items-center gap-2" style={{ color: '#2e2e2e' }}>
            <Newspaper className="w-6 h-6" style={{ color: '#547792' }} />
            Historias de {animal.name}
          </h2>
          <p className="text-sm mb-6" style={{ color: '#727272' }}>Entradas del blog relacionadas con su llegada y evolución.</p>
          <div className={`grid gap-6 ${entradas.length === 1 ? 'grid-cols-1 max-w-2xl mx-auto' : 'grid-cols-1 md:grid-cols-2'}`}>
            {entradas.map(e => (
              <Link key={e.id} to={`/blog/${e.id}?origen=animal`} className="rounded-2xl border p-5 flex flex-col gap-3 transition-all hover:shadow-md hover:-translate-y-0.5" style={{ backgroundColor: '#f7f7f7', borderColor: '#d9d9d9' }}>
                {e.imagenUrl && <img src={e.imagenUrl} alt={e.titulo} className="rounded-xl w-full h-48 object-cover" loading="lazy" />}
                <p className="text-xs" style={{ color: '#727272' }}>
                  <Calendar className="w-3.5 h-3.5 inline-block mr-1" style={{ color: '#547792' }} />
                  {e.fecha ? new Date(e.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                </p>
                <h3 className="font-semibold" style={{ color: '#2e2e2e' }}>{e.titulo}</h3>
                {e.contenido && <p className="text-sm leading-relaxed flex-1" style={{ color: '#727272' }}>{recortarTexto(e.contenido)}</p>}
                {(e.etiquetas || []).length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {e.etiquetas.map(t => (
                      <span key={t} className="text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: '#f7e3b0', color: '#2e2e2e' }}>{t}</span>
                    ))}
                  </div>
                )}
                <span className="flex items-center gap-1 text-sm font-semibold" style={{ color: '#547792' }}>
                  Leer más <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
      {blogLoading && <p className="text-sm text-gray-400 text-center mt-12">Cargando historias...</p>}

      <div className="mt-12 flex flex-col items-center gap-3">
        <p className="text-sm font-semibold flex items-center gap-2" style={{ color: '#2e2e2e' }}>
          <Share2 className="w-4 h-4" style={{ color: '#547792' }} /> Compartir a {animal.name}
        </p>
        <div className="flex items-center gap-2.5">
          <a href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`} target="_blank" rel="noopener noreferrer" aria-label="Compartir por WhatsApp" className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-all hover:scale-110 hover:opacity-80" style={{ backgroundColor: '#25D366', color: '#ffffff' }}><WhatsAppIcon className="w-5 h-5" /></a>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" aria-label="Compartir en Facebook" className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-all hover:scale-110 hover:opacity-80" style={{ backgroundColor: '#1877F2', color: '#ffffff' }}><Facebook className="w-5 h-5" /></a>
          <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" aria-label="Compartir en X" className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-all hover:scale-110 hover:opacity-80" style={{ backgroundColor: '#000000', color: '#ffffff' }}><Twitter className="w-5 h-5" /></a>
          <a href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer" aria-label="Compartir en Telegram" className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-all hover:scale-110 hover:opacity-80" style={{ backgroundColor: '#229ED9', color: '#ffffff' }}><Send className="w-5 h-5" /></a>
        </div>
      </div>
    </div>
  );
}
