import { useParams, Link, useNavigate } from 'react-router';
import { ArrowLeft, Edit2, Stethoscope } from 'lucide-react';
import { useApp, useAuth } from '../../context/AppContext';
import { AnimalStatusBadge } from '../../components/StatusBadge';

const speciesLabel: Record<string, string> = { PERRO: 'Perro', GATO: 'Gato', CONEJO: 'Conejo', ROEDOR: 'Roedor', OTRO: 'Otro' };
const genderLabel: Record<string, string>  = { MACHO: 'Macho', HEMBRA: 'Hembra' };
const sizeLabel: Record<string, string>    = { PEQUENO: 'Pequeño', MEDIANO: 'Mediano', GRANDE: 'Grande', ESTANDAR: 'Estándar' };

function calcEdad(birthDate: string): string {
  if (!birthDate) return '—';
  const diff = Date.now() - new Date(birthDate).getTime();
  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44));
  if (months < 12) return `${months} meses`;
  const years = Math.floor(months / 12);
  const rem   = months % 12;
  return rem > 0 ? `${years} año${years > 1 ? 's' : ''} y ${rem} mes${rem > 1 ? 'es' : ''}` : `${years} año${years > 1 ? 's' : ''}`;
}

export default function AnimalDetailDashboard() {
  const { id } = useParams<{ id: string }>();
  const { animals, users } = useApp();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const animal = animals.find(a => a.id === id);
  if (!animal) {
    return (
      <div className="text-center py-20 text-gray-400">
        <div className="text-5xl mb-3">🐾</div>
        <p>Animal no encontrado</p>
        <Link to="/dashboard/animals" className="text-sm underline mt-4 block" style={{ color: '#547792' }}>Volver a animales</Link>
      </div>
    );
  }

  const rol = (currentUser?.role ?? '').toUpperCase();
  const esAdmin      = rol === 'ADMIN';
  const puedeEditar  = esAdmin || String(animal.volunteerId) === String(currentUser?.id);

  // El contexto ya mapea: nombre (backend) → name (frontend), id como string
  const responsable = users?.find((u: any) => String(u.id) === String(animal.volunteerId));
  const nombreResponsable = responsable
    ? `${responsable.name}${(responsable as any).apellidos ? ' ' + (responsable as any).apellidos : ''}`
    : (animal.volunteerId ? 'Sin asignar' : 'Sin asignar');

  const chip = (label: string, active: boolean) => (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
      active ? 'bg-[#dce8ed] text-[#213448]' : 'bg-gray-100 text-gray-400 line-through'
    }`}>
      {active ? '✓' : '✗'} {label}
    </span>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Cabecera */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-gray-900 truncate">{animal.name}</h1>
          <p className="text-gray-500 text-sm">{speciesLabel[animal.species] ?? animal.species} · {animal.breed}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            to={`/dashboard/animals/${id}/appointments`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{ backgroundColor: '#dce8ed', color: '#213448' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#547792'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#dce8ed'; e.currentTarget.style.color = '#213448'; }}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            Protocolo
          </Link>
          {puedeEditar && (
            <Link
              to={`/dashboard/animals/${id}/edit`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-all"
              style={{ backgroundColor: '#547792' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#3d6180')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#547792')}
            >
              <Edit2 className="w-3.5 h-3.5" />
              Editar
            </Link>
          )}
        </div>
      </div>

      {/* Foto + estado */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {animal.imageUrl ? (
          <img src={animal.imageUrl} alt={animal.name} className="w-full h-64 object-cover" />
        ) : (
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-6xl">🐾</div>
        )}
        <div className="p-5 flex items-center justify-between">
          <AnimalStatusBadge status={animal.status} />
          <span className="text-xs text-gray-400">Entrada: {animal.entryDate ? new Date(animal.entryDate).toLocaleDateString('es-ES') : '—'}</span>
        </div>
      </div>

      {/* Info */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: 'Edad',       value: calcEdad(animal.birthDate) },
          { label: 'Sexo',       value: genderLabel[animal.gender] ?? animal.gender },
          { label: 'Tamaño',     value: sizeLabel[animal.size] ?? animal.size },
          { label: 'Especie',    value: speciesLabel[animal.species] ?? animal.species },
          { label: 'Raza',       value: animal.breed },
          { label: 'Responsable', value: nombreResponsable },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-xs text-gray-400 mb-0.5">{label}</p>
            <p className="text-sm font-medium text-gray-800">{value}</p>
          </div>
        ))}
      </div>

      {/* Descripción */}
      {animal.description && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-gray-800 mb-3">Descripción</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{animal.description}</p>
        </div>
      )}

      {/* Salud */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="text-gray-800 mb-4">Salud y características</h3>
        <div className="flex flex-wrap gap-2">
          {chip('Vacunado/a',      Boolean(animal.vaccinated))}
          {chip('Esterilizado/a',  Boolean(animal.sterilized))}
          {chip('Microchip',       Boolean(animal.microchip))}
          {chip('Compatible gatos',  Boolean(animal.goodWithCats))}
          {chip('Compatible perros', Boolean(animal.goodWithDogs))}
        </div>
      </div>

      {/* Galería */}
      {(animal.gallery ?? []).length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-gray-800 mb-4">Galería</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {(animal.gallery ?? []).map((url, i) => (
              <img key={i} src={url} alt={`${animal.name} ${i + 1}`}
                className="aspect-square rounded-xl object-cover w-full" loading="lazy" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
