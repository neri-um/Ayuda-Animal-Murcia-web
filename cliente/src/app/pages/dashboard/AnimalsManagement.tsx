import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import { Plus, Search, Edit2, Trash2, Stethoscope, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { useApp, useAuth } from '../../context/AppContext';
import { Animal } from '../../data/mockData';
import { AnimalStatusBadge } from '../../components/StatusBadge';
import { useEnums, formatEnum } from '../../hooks/useEnums';

const ROW_STYLE: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '2fr 70px 100px 160px auto',
  alignItems: 'center',
  justifyItems: 'start',
  gap: '1rem',
  paddingLeft: '1.5rem',
  paddingRight: '1.5rem',
};

function calcEdad(birthDate: string): string {
  if (!birthDate) return '—';
  const diff = Date.now() - new Date(birthDate).getTime();
  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44));
  if (months < 12) return `${months}m`;
  return `${Math.floor(months / 12)}a`;
}

function StatusDropdown({ animal, statusOptions, onChange }: {
  animal: Animal;
  statusOptions: string[];
  onChange: (s: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const handleOpen = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + window.scrollY + 4, left: rect.left + window.scrollX });
    }
    setOpen(v => !v);
  };

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener('scroll', close, true);
    return () => window.removeEventListener('scroll', close, true);
  }, [open]);

  return (
    <div>
      <button ref={btnRef} onClick={handleOpen} className="focus:outline-none">
        <AnimalStatusBadge status={animal.status} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="fixed z-50 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-[11rem]" style={{ top: pos.top, left: pos.left }}>
            {statusOptions.map(s => (
              <button key={s} onClick={() => { onChange(s); setOpen(false); }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                style={s === animal.status ? { color: '#547792', fontWeight: 500 } : { color: '#374151' }}
              >{formatEnum(s)}</button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function AnimalRow({ animal, puedeEditar, puedeEliminar, esAdmin, responsable, statusOptions, onStatusChange, onDelete, animalDelMesId, onSetAnimalDelMes }: {
  animal: Animal;
  puedeEditar: boolean;
  puedeEliminar: boolean;
  esAdmin: boolean;
  responsable?: string;
  statusOptions: string[];
  onStatusChange: (s: string) => void;
  onDelete: () => void;
  animalDelMesId: string | null;
  onSetAnimalDelMes: (id: string | null) => void;
}) {
  const esMes = animalDelMesId === animal.id;

  return (
    <div style={{ ...ROW_STYLE, paddingTop: '0.875rem', paddingBottom: '0.875rem' }} className="hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        {animal.imageUrl
          ? <img src={animal.imageUrl} alt={animal.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
          : <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center text-gray-400">🐾</div>
        }
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-800 truncate flex items-center gap-1.5">
            {animal.name}
            {esMes && (
              <span
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs font-semibold"
                style={{ backgroundColor: '#f7e3b0', color: '#2e2e2e' }}
              >
                <Star className="w-2.5 h-2.5" fill="#2e2e2e" /> mes
              </span>
            )}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-xs text-gray-400">{formatEnum(animal.species)}</p>
            {responsable && <span className="text-xs" style={{ color: '#547792' }}>· 👤 {responsable}</span>}
          </div>
        </div>
      </div>
      <span className="text-sm text-gray-600">{calcEdad(animal.birthDate)}</span>
      <span className="text-sm text-gray-600">{formatEnum(animal.gender)}</span>
      <div>
        {puedeEditar ? (
          <>
            <StatusDropdown animal={animal} statusOptions={statusOptions} onChange={onStatusChange} />
            <p className="text-xs text-gray-400 mt-1">Clic para cambiar</p>
          </>
        ) : (
          <AnimalStatusBadge status={animal.status} />
        )}
      </div>
      <div className="flex items-center gap-1.5">
        {/* Botón Animal del mes — solo ADMIN o ENCARGADO */}
        {esAdmin && (
          <button
            onClick={() => onSetAnimalDelMes(esMes ? null : animal.id)}
            title={esMes ? 'Quitar como animal del mes' : 'Marcar como animal del mes'}
            className="p-2 rounded-lg transition-colors"
            style={esMes
              ? { backgroundColor: '#f7e3b0', color: '#2e2e2e' }
              : { color: '#9ca3af' }
            }
            onMouseEnter={e => {
              if (!esMes) {
                e.currentTarget.style.backgroundColor = '#fef9ec';
                e.currentTarget.style.color = '#2e2e2e';
              }
            }}
            onMouseLeave={e => {
              if (!esMes) {
                e.currentTarget.style.backgroundColor = '';
                e.currentTarget.style.color = '#9ca3af';
              }
            }}
          >
            <Star className="w-4 h-4" fill={esMes ? '#2e2e2e' : 'none'} />
          </button>
        )}
        <Link to={`/dashboard/animals/${animal.id}/appointments`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap"
          style={{ backgroundColor: '#dce8ed', color: '#213448' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#547792'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#dce8ed'; e.currentTarget.style.color = '#213448'; }}
        >
          <Stethoscope className="w-3.5 h-3.5" /> Protocolo
        </Link>
        {puedeEditar && (
          <Link to={`/dashboard/animals/${animal.id}/edit`}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors" title="Editar">
            <Edit2 className="w-4 h-4" />
          </Link>
        )}
        {puedeEliminar && (
          <button onClick={onDelete}
            className="p-2 rounded-lg text-red-300 hover:bg-red-50 hover:text-red-500 transition-colors" title="Eliminar">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function AnimalsManagement() {
  const { animals, animalsLoading, deleteAnimal, changeAnimalStatus, users, animalDelMesId, setAnimalDelMesId } = useApp();
  const { currentUser } = useAuth();
  const { enums } = useEnums();

  const speciesOptions = enums?.especies ?? [];
  const statusOptions  = enums?.estados  ?? [];

  const [search, setSearch]               = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('');
  const [statusFilter, setStatusFilter]   = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showOtros, setShowOtros]         = useState(false);

  const rol = (currentUser?.role ?? '').toUpperCase();
  const esAdmin      = rol === 'ADMIN';
  const esEncargado  = rol === 'ENCARGADO';
  const esVoluntario = rol === 'VOLUNTARIO';

  const getNombreResponsable = (volunteerId: string | undefined): string | undefined => {
    if (!volunteerId) return undefined;
    const u = users?.find((u: any) => String(u.id) === String(volunteerId));
    if (!u) return undefined;
    return u.name + ((u as any).apellidos ? ' ' + (u as any).apellidos : '');
  };

  const matchFilter = (a: Animal) => {
    if (search && !a.name.toLowerCase().includes(search.toLowerCase()) &&
        !a.breed.toLowerCase().includes(search.toLowerCase())) return false;
    if (speciesFilter && a.species !== speciesFilter) return false;
    if (statusFilter  && a.status  !== statusFilter)  return false;
    return true;
  };

  const puedeEditarAnimal = (a: Animal) =>
    esAdmin || (esVoluntario && !!currentUser && String(a.volunteerId) === String(currentUser.id));

  const myAnimals    = animals.filter(a => String(a.volunteerId) === String(currentUser?.id) && matchFilter(a));
  const otherAnimals = animals.filter(a => String(a.volunteerId) !== String(currentUser?.id) && matchFilter(a));

  const headerRow = (
    <div style={{ ...ROW_STYLE, paddingTop: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid #f3f4f6' }}
      className="text-xs text-gray-500 uppercase tracking-wide">
      <span>Animal</span><span>Edad</span><span>Sexo</span><span>Estado</span><span>Acciones</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-gray-900">Gestión de animales</h1>
          <p className="text-gray-500 text-sm mt-1">{animals.length} animales en total</p>
        </div>
        {(esAdmin || esVoluntario) && (
          <Link to="/dashboard/animals/new"
            className="inline-flex items-center gap-2 text-white px-5 py-2.5 rounded-xl transition-colors text-sm"
            style={{ backgroundColor: '#547792' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#3d6180')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#547792')}
          >
            <Plus className="w-4 h-4" /> Añadir animal
          </Link>
        )}
      </div>

      {/* Aviso de animal del mes activo */}
      {animalDelMesId && (() => {
        const adm = animals.find(a => a.id === animalDelMesId);
        return adm ? (
          <div
            className="flex items-center justify-between gap-3 rounded-2xl px-5 py-3 text-sm"
            style={{ backgroundColor: '#fef9ec', border: '1px solid #f7e3b0', color: '#2e2e2e' }}
          >
            <span className="flex items-center gap-2">
              <Star className="w-4 h-4" fill="#2e2e2e" />
              <strong>Animal del mes:</strong> {adm.name}
            </span>
            {(esAdmin || esEncargado) && (
              <button
                onClick={() => setAnimalDelMesId(null)}
                className="text-xs underline opacity-60 hover:opacity-100 transition-opacity"
              >
                Quitar
              </button>
            )}
          </div>
        ) : null;
      })()}

      {/* Filtros */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Buscar por nombre o raza..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none"
            onFocus={e => (e.currentTarget.style.borderColor = '#547792')}
            onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
          />
        </div>
        <select value={speciesFilter} onChange={e => setSpeciesFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
          onFocus={e => (e.currentTarget.style.borderColor = '#547792')}
          onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}>
          <option value="">Todas las especies</option>
          {speciesOptions.map(s => <option key={s} value={s}>{formatEnum(s)}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
          onFocus={e => (e.currentTarget.style.borderColor = '#547792')}
          onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}>
          <option value="">Todos los estados</option>
          {statusOptions.map(s => <option key={s} value={s}>{formatEnum(s)}</option>)}
        </select>
      </div>

      {animalsLoading ? (
        <div className="text-center py-16 text-gray-400">
          <div className="w-8 h-8 border-2 border-[#547792] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm">Cargando animales...</p>
        </div>
      ) : (
        <>
          {/* Mis animales */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-gray-800">Mis animales</h3>
              <span className="text-xs text-gray-400">{myAnimals.length} animal{myAnimals.length !== 1 ? 'es' : ''}</span>
            </div>
            {headerRow}
            {myAnimals.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <span className="text-4xl block mb-2">🐾</span>
                <p className="text-sm">No tienes animales asignados</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {myAnimals.map(animal => (
                  <AnimalRow key={animal.id} animal={animal}
                    puedeEditar={puedeEditarAnimal(animal)}
                    puedeEliminar={esAdmin}
                    esAdmin={esAdmin || esEncargado}
                    statusOptions={statusOptions}
                    onStatusChange={s => changeAnimalStatus(animal.id, s)}
                    onDelete={() => setDeleteConfirm(animal.id)}
                    animalDelMesId={animalDelMesId}
                    onSetAnimalDelMes={setAnimalDelMesId}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Otros animales — toggle */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <button
              onClick={() => setShowOtros(v => !v)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-gray-800">Otros animales de la protectora</h3>
              <div className="flex items-center gap-2 text-sm" style={{ color: '#547792' }}>
                <span>{otherAnimals.length} animal{otherAnimals.length !== 1 ? 'es' : ''}</span>
                {showOtros ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>
            {showOtros && (
              <>
                {headerRow}
                {otherAnimals.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    <p className="text-sm">No hay otros animales</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {otherAnimals.map(animal => (
                      <AnimalRow key={animal.id} animal={animal}
                        puedeEditar={puedeEditarAnimal(animal)}
                        puedeEliminar={esAdmin}
                        esAdmin={esAdmin || esEncargado}
                        responsable={getNombreResponsable(animal.volunteerId)}
                        statusOptions={statusOptions}
                        onStatusChange={s => changeAnimalStatus(animal.id, s)}
                        onDelete={() => setDeleteConfirm(animal.id)}
                        animalDelMesId={animalDelMesId}
                        onSetAnimalDelMes={setAnimalDelMesId}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <div className="text-center mb-4">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-gray-800">¿Eliminar animal?</h3>
              <p className="text-gray-500 text-sm mt-2">Esta acción es irreversible.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">Cancelar</button>
              <button onClick={() => { deleteAnimal(deleteConfirm); setDeleteConfirm(null); }}
                className="flex-1 bg-red-500 text-white py-2.5 rounded-xl text-sm hover:bg-red-600 transition-colors">Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
