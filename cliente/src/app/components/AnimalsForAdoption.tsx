// cliente/src/app/components/AnimalsForAdoption.tsx

import { useState, useMemo } from 'react';
import { Link } from 'react-router';
import {
  Heart, Search, SlidersHorizontal, X, PawPrint,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  Animal, AnimalSize, AnimalGender, Species, AnimalStatus,
} from '../data/mockData';
import { AnimalStatusBadge } from '../components/StatusBadge';
import { useInView } from '../hooks/useInView';

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

const GENDER_LABEL: Record<string, string> = {
  MACHO: 'Macho',
  HEMBRA: 'Hembra',
};

function FadeUp({
  children, delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(2rem)',
        transition: `opacity 0.7s ${delay}ms ease, transform 0.7s ${delay}ms ease`,
      }}
    >
      {children}
    </div>
  );
}

function AnimalCard({ animal }: { animal: Animal }) {
  const genderSymbol = animal.gender?.toUpperCase() === 'MACHO' ? '♂' : '♀';
  const genderLabel =
    GENDER_LABEL[animal.gender?.toUpperCase() ?? ''] ?? animal.gender;

  return (
    <Link
      to={`/animals/${animal.id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
    >
      <div className="relative h-52 overflow-hidden bg-gray-100 flex-shrink-0">
        {animal.imageUrl ? (
          <img
            src={animal.imageUrl}
            alt={animal.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <PawPrint className="w-10 h-10" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <AnimalStatusBadge status={animal.status} />
        </div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-gray-600">
          {genderSymbol} {genderLabel}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-gray-900">{animal.name}</h3>
            <p className="text-sm text-gray-500">{animal.breed}</p>
          </div>
          <span
            className="text-xs px-2 py-1 rounded-full border flex-shrink-0 ml-2"
            style={{
              backgroundColor: '#dce8ed',
              color: '#213448',
              borderColor: '#b5cdd8',
            }}
          >
            {calcAge(animal.birthDate)}
          </span>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed flex-1">
          {animal.description}
        </p>
        {animal.status === 'EN_ADOPCION' && (
          <div
            className="mt-3 flex items-center gap-1.5 text-sm"
            style={{ fontWeight: 500, color: '#547792' }}
          >
            <Heart className="w-4 h-4" /> ¡Quiero adoptarlo!
          </div>
        )}
      </div>
    </Link>
  );
}

type Variant = 'home' | 'full';

export default function AnimalsForAdoption({ variant = 'full' }: { variant?: Variant }) {
  const { animals } = useApp();

  const [search, setSearch] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState<Species | ''>('');
  const [sizeFilter, setSizeFilter] = useState<AnimalSize | ''>('');
  const [genderFilter, setGenderFilter] = useState<AnimalGender | ''>('');
  const [statusFilter, setStatusFilter] = useState<AnimalStatus | ''>('');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(
    () =>
      animals.filter((a) => {
        const q = search.toLowerCase();
        if (
          search &&
          !a.name.toLowerCase().includes(q) &&
          !a.breed.toLowerCase().includes(q)
        )
          return false;
        if (speciesFilter && a.species !== speciesFilter) return false;
        if (sizeFilter && a.size !== sizeFilter) return false;
        if (genderFilter && a.gender !== genderFilter) return false;
        if (statusFilter && a.status !== statusFilter) return false;
        return true;
      }),
    [animals, search, speciesFilter, sizeFilter, genderFilter, statusFilter],
  );

  const activeFilterCount = [
    speciesFilter,
    sizeFilter,
    genderFilter,
    statusFilter,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearch('');
    setSpeciesFilter('');
    setSizeFilter('');
    setGenderFilter('');
    setStatusFilter('');
  };

  // En home: los 3 últimos por orden de entrada (último primero)
  const visibleAnimals =
    variant === 'home'
      ? [...animals].reverse().slice(0, 3)
      : filtered;

  const selectClass =
    'w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#547792]/30 bg-white text-gray-700';

  return (
    <div>
      {variant === 'full' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-8">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o raza..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#547792]/30 text-sm bg-white"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-sm text-gray-700"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtros
              {activeFilterCount > 0 && (
                <span
                  className="rounded-full w-5 h-5 flex items-center justify-center text-xs text-white"
                  style={{ backgroundColor: '#547792' }}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>
            {(activeFilterCount > 0 || search) && (
              <button
                onClick={clearFilters}
                className="p-2.5 rounded-xl border border-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Limpiar filtros"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Especie</label>
                <select
                  value={speciesFilter}
                  onChange={(e) => setSpeciesFilter(e.target.value as Species | '')}
                  className={selectClass}
                >
                  <option value="">Todas</option>
                  <option value="PERRO">Perro</option>
                  <option value="GATO">Gato</option>
                  <option value="CONEJO">Conejo</option>
                  <option value="OTRO">Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Tamaño</label>
                <select
                  value={sizeFilter}
                  onChange={(e) => setSizeFilter(e.target.value as AnimalSize | '')}
                  className={selectClass}
                >
                  <option value="">Todos</option>
                  <option value="PEQUENO">Pequeño</option>
                  <option value="MEDIANO">Mediano</option>
                  <option value="GRANDE">Grande</option>
                  <option value="ESTANDAR">Estándar</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Género</label>
                <select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value as AnimalGender | '')}
                  className={selectClass}
                >
                  <option value="">Todos</option>
                  <option value="MACHO">Macho</option>
                  <option value="HEMBRA">Hembra</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Estado</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as AnimalStatus | '')}
                  className={selectClass}
                >
                  <option value="">Todos</option>
                  <option value="EN_ADOPCION">En adopción</option>
                  <option value="PRE_ADOPCION">Pre-adopción</option>
                  <option value="ADOPTADO">Adoptado</option>
                  <option value="EN_TRATAMIENTO">En tratamiento</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}

      {variant === 'full' && (
        <p className="text-sm text-gray-500 mb-4">
          {filtered.length}{' '}
          {filtered.length === 1 ? 'animal encontrado' : 'animales encontrados'}
        </p>
      )}

      {visibleAnimals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {visibleAnimals.map((animal, i) => (
            <FadeUp key={animal.id} delay={(i % 4) * 60}>
              <AnimalCard animal={animal} />
            </FadeUp>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <PawPrint className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-gray-700 mb-2 font-semibold">
            {variant === 'home' ? 'Aún no hay animales registrados' : 'No encontramos animales'}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {variant === 'home'
              ? 'En breve se añadirán los primeros animales del refugio.'
              : 'Prueba con otros filtros o amplía tu búsqueda'}
          </p>
          {variant === 'full' && (
            <button
              onClick={clearFilters}
              className="text-sm underline"
              style={{ color: '#547792' }}
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
}
