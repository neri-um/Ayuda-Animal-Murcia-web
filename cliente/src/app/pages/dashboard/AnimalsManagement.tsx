import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import { Plus, Search, Edit2, Trash2, Stethoscope, ChevronDown, ChevronUp, Star, Eye } from 'lucide-react';
import { useApp, useAuth } from '../../context/AppContext';
import { Animal } from '../../types';
import { AnimalStatusBadge } from '../../components/StatusBadge';
import { useEnums, formatEnum } from '../../hooks/useEnums';

const CELL_PAD = { py: '0.875rem', px: '1rem' };

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
    <tr className="hover:bg-gray-50 transition-colors">
      <td style={{ padding: `${CELL_PAD.py} 1.5rem ${CELL_PAD.py} 1.5rem` }}>
        <div className="flex items-center gap-3 min-w-0">
          {animal.imageUrl
            ? <img src={animal.imageUrl} alt={animal.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
            : <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center text-gray-400">🐾</div>
          }
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate flex items-center gap-1.5">
              <Link to={`/dashboard/animales/${animal.id}`} className="truncate hover:underline" style={{ color: '#2e2e2e' }}>
                {animal.name}
              </Link>
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
      </td>
      <td style={CELL_PAD} className="text-sm text-gray-600 whitespace-nowrap">{calcEdad(animal.birthDate)}</td>
      <td style={CELL_PAD} className="text-sm text-gray-600 whitespace-nowrap">{formatEnum(animal.gender)}</td>
      <td style={CELL_PAD}>
        {puedeEditar ? (
          <>
            <StatusDropdown animal={animal} statusOptions={statusOptions} onChange={onStatusChange} />
            <p className="text-xs text-gray-400 mt-1">Clic para cambiar</p>
          </>
        ) : (
          <AnimalStatusBadge status={animal.status} />
        )}
      </td>
      <td style={{ ...CELL_PAD, paddingRight: '1.5rem' }}>
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          {/* Botón Animal del mes — visible para todos; el servidor valida el permiso */}
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
          <Link to={`/dashboard/animales/${animal.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap border border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            <Eye className="w-3.5 h-3.5" /> Ficha
          </Link>
          <Link to={`/dashboard/animales/${animal.id}/appointments`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap"
            style={{ backgroundColor: '#dce8ed', color: '#213448' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#547792'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#dce8ed'; e.currentTarget.style.color = '#213448'; }}
          >
            <Stethoscope className="w-3.5 h-3.5" /> Protocolo
          </Link>
          {puedeEditar && (
            <Link to={`/dashboard/animales/${animal.id}/edit`}
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
      </td>
    </tr>
  );
}

function AnimalCard({ animal, puedeEditar, puedeEliminar, esAdmin, responsable, statusOptions, onStatusChange, onDelete, animalDelMesId, onSetAnimalDelMes }: {
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
    <div className="p-4">
      <div className="flex items-center gap-3">
        {animal.imageUrl
          ? <img src={animal.imageUrl} alt={animal.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
          : <div className="w-12 h-12 rounded-xl bg-gray-100 flex-shrink-0 flex items-center justify-center text-lg text-gray-400">🐾</div>
        }
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium text-gray-800 flex items-center gap-1.5 flex-wrap">
              <Link to={`/dashboard/animales/${animal.id}`} className="hover:underline" style={{ color: '#2e2e2e' }}>
                {animal.name}
              </Link>
              {esMes && (
                <span
                  className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: '#f7e3b0', color: '#2e2e2e' }}
                >
                  <Star className="w-2.5 h-2.5" fill="#2e2e2e" /> mes
                </span>
              )}
            </p>
            {puedeEditar ? (
              <StatusDropdown animal={animal} statusOptions={statusOptions} onChange={onStatusChange} />
            ) : (
              <AnimalStatusBadge status={animal.status} />
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap mt-1 text-xs">
            <span className="text-gray-400">{formatEnum(animal.species)}</span>
            <span className="text-gray-300">·</span>
            <span className="text-gray-600">{calcEdad(animal.birthDate)}</span>
            <span className="text-gray-300">·</span>
            <span className="text-gray-600">{formatEnum(animal.gender)}</span>
            {responsable && <span className="text-xs" style={{ color: '#547792' }}>👤 {responsable}</span>}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3">
        <Link to={`/dashboard/animales/${animal.id}`}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap border border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          <Eye className="w-3.5 h-3.5" /> Ficha
        </Link>
        <Link to={`/dashboard/animales/${animal.id}/appointments`}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap"
          style={{ backgroundColor: '#dce8ed', color: '#213448' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#547792'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#dce8ed'; e.currentTarget.style.color = '#213448'; }}
        >
          <Stethoscope className="w-3.5 h-3.5" /> Protocolo
        </Link>
        <button
          onClick={() => onSetAnimalDelMes(esMes ? null : animal.id)}
          title={esMes ? 'Quitar como animal del mes' : 'Marcar como animal del mes'}
          className="p-2.5 rounded-lg transition-colors"
          style={esMes
            ? { backgroundColor: '#f7e3b0', color: '#2e2e2e' }
            : { color: '#9ca3af' }
          }
        >
          <Star className="w-4 h-4" fill={esMes ? '#2e2e2e' : 'none'} />
        </button>
        {puedeEditar && (
          <Link to={`/dashboard/animales/${animal.id}/edit`}
            className="p-2.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors" title="Editar">
            <Edit2 className="w-4 h-4" />
          </Link>
        )}
        {puedeEliminar && (
          <button onClick={onDelete}
            className="p-2.5 rounded-lg text-red-300 hover:bg-red-50 hover:text-red-500 transition-colors" title="Eliminar">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function AnimalsManagement() {
  const { animalsTodos, animalsLoading, deleteAnimal, changeAnimalStatus, users, animalDelMesId, setAnimalDelMesId } = useApp();
  const { currentUser } = useAuth();
  const { enums } = useEnums();

  const speciesOptions = enums?.especies ?? [];
  const statusOptions  = enums?.estados  ?? [];

  const [search, setSearch]               = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('');
  const [statusFilter, setStatusFilter]   = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showOtros, setShowOtros]         = useState(false);
  const [errorMes, setErrorMes]           = useState<string | null>(null);

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
    esAdmin || (!!currentUser && String(a.volunteerId) === String(currentUser.id));

  const manejarAnimalDelMes = async (id: string | null) => {
    try {
      await setAnimalDelMesId(id);
      setErrorMes(null);
    } catch (e: any) {
      setErrorMes(e?.message ?? 'No se pudo cambiar el animal del mes.');
    }
  };

  const myAnimals    = animalsTodos.filter(a => String(a.volunteerId) === String(currentUser?.id) && matchFilter(a));
  const otherAnimals = animalsTodos.filter(a => String(a.volunteerId) !== String(currentUser?.id) && matchFilter(a));

  const headerRow = (
    <thead>
      <tr className="text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100">
        <th className="text-left font-medium py-3 pl-6 pr-4" style={{ width: '40%' }}>Animal</th>
        <th className="text-left font-medium py-3 px-4" style={{ width: '70px' }}>Edad</th>
        <th className="text-left font-medium py-3 px-4" style={{ width: '100px' }}>Sexo</th>
        <th className="text-left font-medium py-3 px-4" style={{ width: '160px' }}>Estado</th>
        <th className="text-left font-medium py-3 pl-4 pr-6" style={{ width: '220px' }}>Acciones</th>
      </tr>
    </thead>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-gray-900">Gestión de animales</h1>
          <p className="text-gray-500 text-sm mt-1">{animalsTodos.length} animales en total</p>
        </div>
        {(esAdmin || esVoluntario || esEncargado) && (
          <Link to="/dashboard/animales/nuevo"
            className="self-start sm:self-auto inline-flex items-center gap-2 text-white px-4 py-2 rounded-xl transition-colors text-sm"
            style={{ backgroundColor: '#547792' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#3d6180')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#547792')}
          >
            <Plus className="w-4 h-4" /> Añadir animal
          </Link>
        )}
      </div>

      {errorMes && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
          {errorMes}
        </div>
      )}

      {animalDelMesId && (() => {
        const adm = animalsTodos.find(a => a.id === animalDelMesId);
        return adm ? (
          <div
            className="flex items-center justify-between gap-3 rounded-2xl px-5 py-3 text-sm"
            style={{ backgroundColor: '#fef9ec', border: '1px solid #f7e3b0', color: '#2e2e2e' }}
          >
            <span className="flex items-center gap-2">
              <Star className="w-4 h-4" fill="#2e2e2e" />
              <strong>Animal del mes:</strong> {adm.name}
            </span>
            {(esAdmin) && (
              <button
                onClick={() => manejarAnimalDelMes(null)}
                className="text-xs underline opacity-60 hover:opacity-100 transition-opacity"
              >
                Quitar
              </button>
            )}
          </div>
        ) : null;
      })()}

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
        <div className="flex gap-3">
          <select value={speciesFilter} onChange={e => setSpeciesFilter(e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
            onFocus={e => (e.currentTarget.style.borderColor = '#547792')}
            onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}>
            <option value="">Todas las especies</option>
            {speciesOptions.map(s => <option key={s} value={s}>{formatEnum(s)}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
            onFocus={e => (e.currentTarget.style.borderColor = '#547792')}
            onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}>
            <option value="">Todos los estados</option>
            {statusOptions.map(s => <option key={s} value={s}>{formatEnum(s)}</option>)}
          </select>
        </div>
      </div>

      {animalsLoading ? (
        <div className="text-center py-16 text-gray-400">
          <div className="w-8 h-8 border-2 border-[#547792] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm">Cargando animales...</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-gray-800">Mis animales</h3>
              <span className="text-xs text-gray-400">{myAnimals.length} animal{myAnimals.length !== 1 ? 'es' : ''}</span>
            </div>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full table-fixed min-w-[42rem]">
                {headerRow}
                {myAnimals.length === 0 ? (
                  <tbody>
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-gray-400">
                        <span className="text-4xl block mb-2">🐾</span>
                        <p className="text-sm">No tienes animales asignados</p>
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody className="divide-y divide-gray-50">
                    {myAnimals.map(animal => (
                      <AnimalRow key={animal.id} animal={animal}
                        puedeEditar={puedeEditarAnimal(animal)}
                        puedeEliminar={esAdmin}
                        esAdmin={(esAdmin)}
                        statusOptions={statusOptions}
                        onStatusChange={s => changeAnimalStatus(animal.id, s)}
                        onDelete={() => setDeleteConfirm(animal.id)}
                        animalDelMesId={animalDelMesId}
                        onSetAnimalDelMes={manejarAnimalDelMes}
                      />
                    ))}
                  </tbody>
                )}
              </table>
            </div>
            <div className="md:hidden divide-y divide-gray-50">
              {myAnimals.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <span className="text-4xl block mb-2">🐾</span>
                  <p className="text-sm">No tienes animales asignados</p>
                </div>
              ) : (
                myAnimals.map(animal => (
                  <AnimalCard key={animal.id} animal={animal}
                    puedeEditar={puedeEditarAnimal(animal)}
                    puedeEliminar={esAdmin}
                    esAdmin={esAdmin}
                    statusOptions={statusOptions}
                    onStatusChange={s => changeAnimalStatus(animal.id, s)}
                    onDelete={() => setDeleteConfirm(animal.id)}
                    animalDelMesId={animalDelMesId}
                    onSetAnimalDelMes={manejarAnimalDelMes}
                  />
                ))
              )}
            </div>
          </div>

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
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full table-fixed min-w-[42rem]">
                    {headerRow}
                    {otherAnimals.length === 0 ? (
                      <tbody>
                        <tr>
                          <td colSpan={5} className="text-center py-10 text-gray-400">
                            <p className="text-sm">No hay otros animales</p>
                          </td>
                        </tr>
                      </tbody>
                    ) : (
                      <tbody className="divide-y divide-gray-50">
                        {otherAnimals.map(animal => (
                          <AnimalRow key={animal.id} animal={animal}
                            puedeEditar={puedeEditarAnimal(animal)}
                            puedeEliminar={esAdmin}
                            esAdmin={esAdmin}
                            responsable={getNombreResponsable(animal.volunteerId)}
                            statusOptions={statusOptions}
                            onStatusChange={s => changeAnimalStatus(animal.id, s)}
                            onDelete={() => setDeleteConfirm(animal.id)}
                            animalDelMesId={animalDelMesId}
                            onSetAnimalDelMes={manejarAnimalDelMes}
                          />
                        ))}
                      </tbody>
                    )}
                  </table>
                </div>
                <div className="md:hidden divide-y divide-gray-50">
                  {otherAnimals.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                      <p className="text-sm">No hay otros animales</p>
                    </div>
                  ) : (
                    otherAnimals.map(animal => (
                      <AnimalCard key={animal.id} animal={animal}
                        puedeEditar={puedeEditarAnimal(animal)}
                        puedeEliminar={esAdmin}
                        esAdmin={esAdmin}
                        responsable={getNombreResponsable(animal.volunteerId)}
                        statusOptions={statusOptions}
                        onStatusChange={s => changeAnimalStatus(animal.id, s)}
                        onDelete={() => setDeleteConfirm(animal.id)}
                        animalDelMesId={animalDelMesId}
                        onSetAnimalDelMes={manejarAnimalDelMes}
                      />
                    ))
                  )}
                </div>
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
