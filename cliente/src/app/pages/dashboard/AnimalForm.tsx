import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Save, PawPrint, Upload, X, ImagePlus } from 'lucide-react';
import { useApp, useAuth } from '../../context/AppContext';
import { Animal, AnimalSize, AnimalGender, AnimalStatus, Species, Caracter } from '../../types';
import { formatEnum, getEnums } from '../../services/enums';
import { uploadToImgBB } from '../../services/imgbb';

import { API_BASE as BASE } from '../../services/api';

const CARACTERES: Caracter[] = [
  'TRANQUILO', 'CARINOSO', 'JUGUETON', 'SOCIABLE',
  'TIMIDO', 'INDEPENDIENTE', 'ACTIVO', 'MIEDOSO',
];

type FormData = Omit<Animal, 'id' | 'volunteerId' | 'protocolo'>;

const defaultForm: FormData = {
  name: '',
  breed: '',
  birthDate: '',
  species: '' as Species,
  size: '' as AnimalSize,
  gender: '' as AnimalGender,
  status: '' as AnimalStatus,
  description: '',
  imageUrl: '',
  gallery: [],
  needsMedication: false,
  needsSpecialCare: false,
  needsAcogida: false,
  positivoLeucemia: false,
  positivoInmunodeficiencia: false,
  entryDate: new Date().toISOString().slice(0, 10),
  goodWithCats: false,
  goodWithDogs: false,
  goodWithDogsLarge: false,
  goodWithDogsSmall: false,
  goodWithKids: false,
  canLiveInApartment: false,
  canLiveOutside: false,
  aptoGatoUnico: false,
  necesitaCompaneroFelino: false,
  flexibleConvivenciaFelina: false,
  adopcionConjunta: false,
  personality: [],
};

export default function AnimalForm() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const { animalsTodos, token, fetchAnimals, fetchAllAnimals } = useApp();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormData>({ ...defaultForm });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [saving, setSaving] = useState(false);
  const animalLoadedRef = useRef(false);

  const [enums, setEnums] = useState<{
    especies: string[];
    tamanyes: string[];
    sexos: string[];
    estados: string[];
  }>({ especies: [], tamanyes: [], sexos: [], estados: [] });

  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const rol = (currentUser?.rol ?? '').toUpperCase();
  const esAdmin = rol === 'ADMIN';
  const puedeCrear = rol === 'VOLUNTARIO' || rol === 'ENCARGADO' || esAdmin;

  useEffect(() => {
    getEnums()
      .then(data => {
        setEnums(data);
        if (!isEdit) {
          setForm(prev => ({
            ...prev,
            species: (data.especies?.[0] ?? '') as Species,
            size: (data.tamanyes?.[0] ?? '') as AnimalSize,
            gender: (data.sexos?.[0] ?? '') as AnimalGender,
            status: (data.estados?.[0] ?? '') as AnimalStatus,
          }));
        }
      })
      .catch(() => console.error('No se pudieron cargar los enums del backend'));
  }, [isEdit]);

  useEffect(() => {
    if (isEdit && id && !animalLoadedRef.current) {
      const animal = animalsTodos.find(a => a.id === id);
      if (animal) {
        const puedeEditar = esAdmin || animal.volunteerId === String(currentUser?.id);
        if (!puedeEditar) {
          alert('No puedes editar este animal');
          navigate('/dashboard/animales', { replace: true });
          return;
        }

        animalLoadedRef.current = true;
        const { id: _id, volunteerId: _vid, protocolo: _protocolo, ...rest } = animal as Animal;
        const cleanFotoUrl = rest.imageUrl
          ? (rest.imageUrl.match(/https?:\/\/[^\s\])"]+/i)?.[0] ?? rest.imageUrl)
          : '';
        setForm({ ...rest, imageUrl: cleanFotoUrl });
      }
    }
  }, [id, isEdit, animalsTodos, esAdmin, currentUser?.id, navigate]);

  useEffect(() => {
    if (!isEdit && !puedeCrear) {
      alert('No tienes permisos para crear animales');
      navigate('/dashboard/animales', { replace: true });
    }
  }, [isEdit, puedeCrear, navigate]);

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const url = await uploadToImgBB(file);
      update('imageUrl', url);
    } catch {
      alert('No se pudo subir la portada. Inténtalo de nuevo.');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleGalleryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadingGallery(true);
    try {
      const urls = await Promise.all(files.map(uploadToImgBB));
      update('gallery', [...(form.gallery || []), ...urls]);
    } catch {
      alert('No se pudieron subir algunas fotos. Inténtalo de nuevo.');
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeFromGallery = (index: number) => {
    update('gallery', (form.gallery || []).filter((_, i) => i !== index));
  };

  const toggleCaracter = (c: Caracter) => {
    const actuales = form.personality ?? [];
    update('personality', actuales.includes(c)
      ? actuales.filter(x => x !== c)
      : [...actuales, c]);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!form.breed.trim()) newErrors.breed = 'La raza es obligatoria';
    if (!form.description.trim()) newErrors.description = 'La descripción es obligatoria';
    if (!form.birthDate) newErrors.birthDate = 'La fecha de nacimiento es obligatoria';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);

    const url = isEdit
      ? `${BASE}/animales/${id}`
      : `${BASE}/animales`;
    const method = isEdit ? 'PUT' : 'POST';

    const body = {
      nombre: form.name,
      especie: form.species,
      raza: form.breed,
      fechaNacimiento: form.birthDate,
      tamanyo: form.size,
      sexo: form.gender,
      estado: form.status,
      descripcion: form.description,
      fotoUrl: form.imageUrl,
      galeria: form.gallery || [],
      compatibleGatos: form.goodWithCats,
      compatiblePerros: form.goodWithDogs,
      compatiblePerrosGrandes: form.goodWithDogsLarge,
      compatiblePerrosPequenos: form.goodWithDogsSmall,
      necesitaMedicacion: form.needsMedication,
      necesitaCuidadosEspeciales: form.needsSpecialCare,
      necesitaAcogida: form.needsAcogida,
      positivoLeucemia: form.positivoLeucemia,
      positivoInmunodeficiencia: form.positivoInmunodeficiencia,
      compatibleNinos: form.goodWithKids,
      puedeVivirPiso: form.canLiveInApartment,
      puedeVivirExterior: form.canLiveOutside,
      aptoGatoUnico: form.aptoGatoUnico,
      necesitaCompaneroFelino: form.necesitaCompaneroFelino,
      flexibleConvivenciaFelina: form.flexibleConvivenciaFelina,
      adopcionConjunta: form.adopcionConjunta,
      caracter: form.personality ?? [],
      fechaIngreso: form.entryDate,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        let detalle = '';
        try {
          const err = await res.json();
          detalle = err?.mensaje ?? err?.message ?? '';
        } catch { /* sin detalle */ }
        alert(`Error al guardar. Código: ${res.status}${detalle ? `\n${detalle}` : ''}`);
        setSaving(false);
        return;
      }

      await fetchAnimals();
      await fetchAllAnimals();
      navigate('/dashboard/animales');
    } catch {
      alert('No se pudo conectar con el servidor');
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-gray-900">{isEdit ? 'Editar animal' : 'Añadir nuevo animal'}</h1>
          <p className="text-gray-500 text-sm">Rellena todos los campos obligatorios (*)</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <h3 className="text-gray-800 pb-3 border-b border-gray-100 flex items-center gap-2">
            <ImagePlus className="w-5 h-5" style={{ color: '#547792' }} />
            Fotos
          </h3>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Foto de portada</label>
            <div
              onClick={() => coverInputRef.current?.click()}
              className="relative w-full h-48 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-[#547792] transition-colors overflow-hidden"
              style={{ backgroundColor: '#f9fafb' }}
            >
              {form.imageUrl ? (
                <>
                  <img src={form.imageUrl} alt="portada" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-white text-sm font-medium">Cambiar foto</span>
                  </div>
                </>
              ) : uploadingCover ? (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <div className="w-6 h-6 border-2 border-[#547792] border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">Subiendo...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <Upload className="w-8 h-8" />
                  <span className="text-sm">Haz clic para subir la foto de portada</span>
                  <span className="text-xs">JPG, PNG, WEBP</span>
                </div>
              )}
            </div>
            <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Galería de fotos</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {(form.gallery || []).map((url, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                  <img src={url} alt={`foto ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeFromGallery(i)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <div
                onClick={() => !uploadingGallery && galleryInputRef.current?.click()}
                className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#547792] transition-colors"
                style={{ backgroundColor: '#f9fafb' }}
              >
                {uploadingGallery ? (
                  <div className="w-5 h-5 border-2 border-[#547792] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ImagePlus className="w-6 h-6 text-gray-400" />
                    <span className="text-xs text-gray-400 mt-1">Añadir</span>
                  </>
                )}
              </div>
            </div>
            <input ref={galleryInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryChange} />
            <p className="text-xs text-gray-400 mt-2">Puedes seleccionar varias fotos a la vez</p>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-gray-800 mb-5 pb-3 border-b border-gray-100 flex items-center gap-2">
            <PawPrint className="w-5 h-5" style={{ color: '#547792' }} />
            Información básica
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Nombre *</label>
              <input type="text" value={form.name} onChange={e => update('name', e.target.value)}
                maxLength={150}
                placeholder="Ej: Max, Luna..."
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none ${errors.name ? 'border-red-400' : 'border-gray-200'}`}
                onFocus={e => !errors.name && (e.currentTarget.style.borderColor = '#547792')}
                onBlur={e => !errors.name && (e.currentTarget.style.borderColor = '#e5e7eb')} />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Especie *</label>
              <select value={form.species} onChange={e => update('species', e.target.value as Species)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                onFocus={e => (e.currentTarget.style.borderColor = '#547792')}
                onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}>
                {(enums.especies ?? []).map(e => (
                  <option key={e} value={e}>{formatEnum(e)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Raza *</label>
              <input type="text" value={form.breed} onChange={e => update('breed', e.target.value)}
                maxLength={200}
                placeholder="Ej: Labrador, Europeo..."
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none ${errors.breed ? 'border-red-400' : 'border-gray-200'}`}
                onFocus={e => !errors.breed && (e.currentTarget.style.borderColor = '#547792')}
                onBlur={e => !errors.breed && (e.currentTarget.style.borderColor = '#e5e7eb')} />
              {errors.breed && <p className="text-red-500 text-xs mt-1">{errors.breed}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Fecha de nacimiento *</label>
              <input type="date" value={form.birthDate}
                max={new Date().toISOString().slice(0, 10)}
                onChange={e => update('birthDate', e.target.value)}
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none ${errors.birthDate ? 'border-red-400' : 'border-gray-200'}`}
                onFocus={e => !errors.birthDate && (e.currentTarget.style.borderColor = '#547792')}
                onBlur={e => !errors.birthDate && (e.currentTarget.style.borderColor = '#e5e7eb')} />
              {errors.birthDate && <p className="text-red-500 text-xs mt-1">{errors.birthDate}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Tamaño *</label>
              <select value={form.size} onChange={e => update('size', e.target.value as AnimalSize)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                onFocus={e => (e.currentTarget.style.borderColor = '#547792')}
                onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}>
                {(enums.tamanyes ?? []).map(t => (
                  <option key={t} value={t}>{formatEnum(t)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Sexo *</label>
              <select value={form.gender} onChange={e => update('gender', e.target.value as AnimalGender)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                onFocus={e => (e.currentTarget.style.borderColor = '#547792')}
                onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}>
                {(enums.sexos ?? []).map(s => (
                  <option key={s} value={s}>{formatEnum(s)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Estado *</label>
              <select value={form.status} onChange={e => update('status', e.target.value as AnimalStatus)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                onFocus={e => (e.currentTarget.style.borderColor = '#547792')}
                onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}>
                {(enums.estados ?? []).map(s => (
                  <option key={s} value={s}>{formatEnum(s)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Fecha de entrada *</label>
              <input type="date" value={form.entryDate} onChange={e => update('entryDate', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                onFocus={e => (e.currentTarget.style.borderColor = '#547792')}
                onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')} />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm text-gray-700 mb-1">Descripción *</label>
            <textarea value={form.description} onChange={e => update('description', e.target.value)}
              rows={4} maxLength={3000} placeholder="Describe la personalidad, historia y necesidades del animal..."
              className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none resize-none ${errors.description ? 'border-red-400' : 'border-gray-200'}`}
              onFocus={e => !errors.description && (e.currentTarget.style.borderColor = '#547792')}
              onBlur={e => !errors.description && (e.currentTarget.style.borderColor = '#e5e7eb')} />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.needsAcogida}
              onChange={e => setForm({ ...form, needsAcogida: e.target.checked })}
              className="w-4 h-4"
              style={{ accentColor: '#547792' }}
            />
            Necesita casa de acogida
        </label>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-gray-800 mb-5 pb-3 border-b border-gray-100">Salud</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {([
              { key: 'needsMedication', label: 'Necesita medicación' },
              { key: 'needsSpecialCare', label: 'Necesita cuidados especiales' },
              { key: 'positivoLeucemia', label: 'Positivo/a a leucemia' },
              { key: 'positivoInmunodeficiencia', label: 'Positivo/a a inmunodeficiencia' },
            ] as { key: keyof FormData; label: string }[]).map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={Boolean(form[key])}
                  onChange={e => update(key, e.target.checked as any)}
                  className="w-4 h-4" style={{ accentColor: '#547792' }} />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-gray-800 mb-5 pb-3 border-b border-gray-100">Convivencia</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {([
              { key: 'goodWithCats', label: 'Compatible con gatos' },
              { key: 'goodWithDogs', label: 'Compatible con perros' },
              { key: 'goodWithDogsLarge', label: 'Compatible con perros grandes' },
              { key: 'goodWithDogsSmall', label: 'Compatible con perros pequeños' },
              { key: 'aptoGatoUnico', label: 'Apto para ser gato único' },
              { key: 'necesitaCompaneroFelino', label: 'Necesita un compañero felino' },
              { key: 'flexibleConvivenciaFelina', label: 'Apto para gato único o con compañero felino' },
              { key: 'adopcionConjunta', label: 'Adopción conjunta' },
              { key: 'goodWithKids', label: 'Bueno/a con niños' },
              { key: 'canLiveInApartment', label: 'Puede vivir en piso' },
              { key: 'canLiveOutside', label: 'Puede vivir en exterior' },
            ] as { key: keyof FormData; label: string }[]).map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={Boolean(form[key])}
                  onChange={e => update(key, e.target.checked as any)}
                  className="w-4 h-4" style={{ accentColor: '#547792' }} />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-gray-800 mb-5 pb-3 border-b border-gray-100">Carácter</h3>
          <p className="text-xs text-gray-400 mb-3">Selecciona todos los que definan a este animal</p>
          <div className="flex flex-wrap gap-2">
            {CARACTERES.map(c => {
              const activo = (form.personality ?? []).includes(c);
              return (
                <button key={c} type="button" onClick={() => toggleCaracter(c)}
                  className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                    activo
                      ? 'text-white border-transparent'
                      : 'text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}
                  style={activo ? { backgroundColor: '#547792' } : undefined}>
                  {formatEnum(c)}
                </button>
              );
            })}
          </div>
        </section>

        <div className="flex gap-3">
          <button type="button" onClick={() => navigate(-1)}
            className="flex-1 sm:flex-none border border-gray-200 text-gray-600 px-6 py-3 rounded-xl text-sm hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
          <button type="submit" disabled={saving}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-white px-8 py-3 rounded-xl text-sm transition-colors disabled:opacity-60"
            style={{ backgroundColor: '#547792' }}
            onMouseEnter={e => !saving && (e.currentTarget.style.backgroundColor = '#3d6180')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#547792')}>
            {saving ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Guardando...</>
            ) : (
              <><Save className="w-4 h-4" />{isEdit ? 'Guardar cambios' : 'Registrar animal'}</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}