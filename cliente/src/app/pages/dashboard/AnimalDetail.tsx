import { useParams, Link, useNavigate } from 'react-router';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Edit2, Stethoscope, Newspaper, Plus, X, Save, Calendar, ImagePlus, PawPrint } from 'lucide-react';
import { useApp, useAuth } from '../../context/AppContext';
import { AnimalStatusBadge } from '../../components/StatusBadge';
import { formatEnum } from '../../services/enums';
import { getEntradasDeAnimal, crearEntradaBlog } from '../../services/blog';
import { uploadToImgBB } from '../../services/imgbb';
import type { EntradaBlog } from '../../types';

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
  const { animalsTodos, users } = useApp();
  const { currentUser, token } = useAuth();
  const navigate = useNavigate();

  const [entradas, setEntradas] = useState<EntradaBlog[]>([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState({ titulo: '', fecha: new Date().toISOString().slice(0, 10), etiquetas: '', contenido: '', imagenUrl: '' });
  const [error, setError] = useState('');
  const [subiendoImg, setSubiendoImg] = useState(false);
  const imgInputRef = useRef<HTMLInputElement>(null);

  const cargarEntradas = async (animalId: string) => {
    try {
      setEntradas(await getEntradasDeAnimal(animalId));
    } catch {
      setEntradas([]);
    }
  };

  const animal = animalsTodos.find(a => a.id === id);

  useEffect(() => {
    if (animal) cargarEntradas(animal.id);
  }, [animal?.id]);

  if (!animal) {
    return (
      <div className="text-center py-20 text-gray-400">
        <PawPrint className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p>Animal no encontrado</p>
        <Link to="/dashboard/animales" className="text-sm underline mt-4 block" style={{ color: '#547792' }}>Volver a animales</Link>
      </div>
    );
  }

  const rol = (currentUser?.role ?? '').toUpperCase();
  const esAdmin      = rol === 'ADMIN';
  const puedeEditar  = esAdmin || String(animal.volunteerId) === String(currentUser?.id);
  const puedePublicar = esAdmin || rol === 'ENCARGADO' || rol === 'VOLUNTARIO';

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

  const crearEntrada = async () => {
    if (!animal) return;
    if (!form.titulo.trim()) { setError('El título es obligatorio'); return; }
    if (!form.fecha) { setError('La fecha es obligatoria'); return; }
    setError('');
    try {
      await crearEntradaBlog({
        titulo: form.titulo.trim(),
        contenido: form.contenido.trim(),
        fecha: form.fecha,
        imagenUrl: form.imagenUrl || undefined,
        etiquetas: form.etiquetas.split(',').map(s => s.trim()).filter(Boolean),
        animalId: Number(animal.id),
      }, token);
      setMostrarForm(false);
      setForm({ titulo: '', fecha: new Date().toISOString().slice(0, 10), etiquetas: '', contenido: '', imagenUrl: '' });
      await cargarEntradas(animal.id);
    } catch (e: any) {
      setError(e?.message ?? 'No se pudo guardar la entrada');
    }
  };

  const inputCls = "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none";
  const labelCls = "block text-sm text-gray-700 mb-1";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
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
            to={`/dashboard/animales/${id}/appointments`}
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
              to={`/dashboard/animales/${id}/edit`}
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

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {animal.imageUrl ? (
          <img src={animal.imageUrl} alt={animal.name} className="w-full h-64 object-cover" />
        ) : (
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center"><PawPrint className="w-16 h-16 text-gray-300" /></div>
        )}
        <div className="p-5 flex items-center justify-between">
          <AnimalStatusBadge status={animal.status} />
          <span className="text-xs text-gray-400">Entrada: {animal.entryDate ? new Date(animal.entryDate).toLocaleDateString('es-ES') : '—'}</span>
        </div>
      </div>

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

      {animal.description && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-gray-800 mb-3">Descripción</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{animal.description}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="text-gray-800 mb-4">Salud</h3>
        <div className="flex flex-wrap gap-2">
          {chip('Necesita medicación',        Boolean(animal.needsMedication))}
          {chip('Necesita cuidados especiales', Boolean(animal.needsSpecialCare))}
          {chip('Positivo/a a leucemia', Boolean(animal.positivoLeucemia))}
          {chip('Positivo/a a inmunodeficiencia', Boolean(animal.positivoInmunodeficiencia))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="text-gray-800 mb-4">Convivencia</h3>
        <div className="flex flex-wrap gap-2">
          {chip('Compatible con gatos',  Boolean(animal.goodWithCats))}
          {chip('Compatible con perros', Boolean(animal.goodWithDogs))}
          {chip('Compatible con perros grandes', Boolean(animal.goodWithDogsLarge))}
          {chip('Compatible con perros pequeños', Boolean(animal.goodWithDogsSmall))}
          {chip('Apto para ser gato único', Boolean(animal.aptoGatoUnico))}
          {chip('Necesita un compañero felino', Boolean(animal.necesitaCompaneroFelino))}
          {chip('Apto para gato único o con compañero felino', Boolean(animal.flexibleConvivenciaFelina))}
          {chip('Adopción conjunta', Boolean(animal.adopcionConjunta))}
          {chip('Bueno/a con niños',     Boolean(animal.goodWithKids))}
          {chip('Puede vivir en piso',   Boolean(animal.canLiveInApartment))}
          {chip('Puede vivir en exterior', Boolean(animal.canLiveOutside))}
        </div>
      </div>

      {(animal.personality ?? []).length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-gray-800 mb-4">Carácter</h3>
          <div className="flex flex-wrap gap-2">
            {animal.personality!.map(c => (
              <span key={c} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#dce8ed] text-[#213448]">
                {formatEnum(c)}
              </span>
            ))}
          </div>
        </div>
      )}

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

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-800 flex items-center gap-2">
            <Newspaper className="w-5 h-5" style={{ color: '#547792' }} />
            Blog de {animal.name}
          </h3>
          {puedePublicar && (
            <button
              onClick={() => { setMostrarForm(true); setError(''); }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-all"
              style={{ backgroundColor: '#547792' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#3d6180')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#547792')}
            >
              <Plus className="w-3.5 h-3.5" />
              Nueva entrada
            </button>
          )}
        </div>

        {entradas.length === 0 ? (
          <p className="text-sm text-gray-400">Aún no hay entradas de blog para este animal.</p>
        ) : (
          <div className="space-y-3">
            {entradas.map(e => (
              <div key={e.id} className="rounded-xl border border-gray-100 p-4">
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {e.fecha ? new Date(e.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                </p>
                <h4 className="text-sm font-semibold text-gray-800 mt-1">{e.titulo}</h4>
                {e.contenido && <p className="text-sm text-gray-500 mt-1 leading-relaxed">{e.contenido}</p>}
                {(e.etiquetas || []).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {e.etiquetas.map(t => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#f7e3b0', color: '#2e2e2e' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {mostrarForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 mt-10">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-gray-800">Nueva entrada para {animal.name}</h3>
              <button onClick={() => setMostrarForm(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 text-sm rounded-xl px-4 py-2.5 border" style={{ backgroundColor: '#fde8e8', color: '#b91c1c', borderColor: '#f5c6c6' }}>
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className={labelCls}>Título *</label>
                <input
                  value={form.titulo}
                  onChange={e => setForm({ ...form, titulo: e.target.value })}
                  className={inputCls}
                  placeholder="Título de la entrada"
                />
              </div>
              <div>
                <label className={labelCls}>Imagen (opcional)</label>
                <input ref={imgInputRef} type="file" accept="image/*" className="hidden"
                  onChange={async e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setSubiendoImg(true);
                    try {
                      const url = await uploadToImgBB(file);
                      setForm(prev => ({ ...prev, imagenUrl: url }));
                    } catch (err: any) {
                      setError(err?.message ?? 'No se pudo subir la imagen');
                    } finally {
                      setSubiendoImg(false);
                      if (imgInputRef.current) imgInputRef.current.value = '';
                    }
                  }} />
                {form.imagenUrl ? (
                  <div className="relative rounded-xl overflow-hidden">
                    <img src={form.imagenUrl} alt="Imagen de la entrada" className="w-full h-40 object-cover" />
                    <button
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, imagenUrl: '' }))}
                      className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 hover:bg-black/80"
                      aria-label="Quitar imagen"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => imgInputRef.current?.click()}
                    disabled={subiendoImg}
                    className="w-full border-2 border-dashed border-gray-200 rounded-xl py-6 flex flex-col items-center gap-2 text-gray-400 hover:border-[#547792] transition-colors disabled:opacity-60"
                  >
                    {subiendoImg ? (
                      <><div className="w-5 h-5 border-2 border-[#547792] border-t-transparent rounded-full animate-spin" /><span className="text-sm">Subiendo...</span></>
                    ) : (
                      <><ImagePlus className="w-6 h-6" /><span className="text-sm">Haz clic para subir la imagen</span></>
                    )}
                  </button>
                )}
              </div>
              <div>
                <label className={labelCls}>Fecha *</label>
                <input
                  type="date"
                  value={form.fecha}
                  onChange={e => setForm({ ...form, fecha: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Etiquetas (separadas por comas)</label>
                <input
                  value={form.etiquetas}
                  onChange={e => setForm({ ...form, etiquetas: e.target.value })}
                  className={inputCls}
                  placeholder="Rescate, Evolución, Adopción..."
                />
              </div>
              <div>
                <label className={labelCls}>Contenido</label>
                <textarea
                  value={form.contenido}
                  onChange={e => setForm({ ...form, contenido: e.target.value })}
                  rows={5}
                  className={inputCls}
                  placeholder="Cuenta la historia de este animal..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setMostrarForm(false)} className="px-4 py-2 rounded-xl text-sm border border-gray-200 hover:bg-gray-50">
                Cancelar
              </button>
              <button
                onClick={crearEntrada}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-white transition-colors"
                style={{ backgroundColor: '#547792' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#3d6180')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#547792')}
              >
                <Save className="w-4 h-4" />Publicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
