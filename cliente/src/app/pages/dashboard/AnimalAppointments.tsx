import { useParams, Link, useNavigate } from 'react-router';
import { ArrowLeft, X } from 'lucide-react';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useApp, useAuth } from '../../context/AppContext';
import ProtocoloVeterinarioCard from '../../components/ProtocoloVeterinarioCard';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/vidanimal';

const empty = { tratamiento: '', descripcion: '', fecha: '', veterinario: '' };

export default function AnimalAppointments() {
  const { id } = useParams<{ id: string }>();
  const { animals, addTratamiento, completarCita } = useApp();
  const { token, currentUser, canAccess } = useAuth();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...empty });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [loadingCitas, setLoadingCitas] = useState(true);
  const [citas, setCitas] = useState<any[]>([]);
  const [completarError, setCompletarError] = useState('');

  const animal = animals.find(a => a.id === id);

  const puedeEditar = useMemo(() => {
    if (!currentUser || !animal) return false;
    if (canAccess('ENCARGADO')) return true;
    return String(animal.volunteerId) === String(currentUser.id);
  }, [currentUser, animal, canAccess]);

  const authHeaders = useCallback((): HeadersInit => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [token]);

  const recargar = useCallback(async () => {
    if (!id) return;
    try {
      const res = await fetch(`${BASE}/animales/${id}/citas`, {
        headers: authHeaders(),
      });
      setCitas(res.ok ? await res.json() : []);
    } catch {
      setCitas([]);
    }
  }, [id, authHeaders]);

  useEffect(() => {
    setLoadingCitas(true);
    recargar().finally(() => setLoadingCitas(false));
  }, [recargar]);

  const protocolo = useMemo(() => {
    return citas.map((c: any) => ({
      id: String(c.id),
      tratamiento: c.tratamiento ?? '',
      descripcion: c.descripcion ?? '',
      fecha: c.fecha ?? '',
      veterinario: c.veterinario ?? '',
      completada: Boolean(c.completada ?? false),
    }));
  }, [citas]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.tratamiento || !form.fecha) {
      setError('El tipo de tratamiento y la fecha son obligatorios.');
      return;
    }
    if (saving) return;
    setSaving(true);
    setError('');
    try {
      await addTratamiento(id!, {
        tratamiento: form.tratamiento,
        descripcion: form.descripcion,
        fecha: form.fecha,
        veterinario: form.veterinario,
      });
      await recargar();
      setShowModal(false);
      setForm({ ...empty });
    } catch {
      setError('No se pudo guardar. Inténtalo de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  const handleCompletar = async (citaId: string) => {
    setCompletarError('');
    try {
      await completarCita(id!, citaId);
      await recargar();
    } catch (err) {
      console.error('Error al completar cita:', err);
      setCompletarError('No se pudo marcar la cita como realizada.');
      setTimeout(() => setCompletarError(''), 4000);
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#547792] transition-colors";
  const labelClass = "block text-sm text-gray-700 mb-1.5";

  if (!animal) {
    return (
      <div className="text-center py-20 text-gray-400">
        <div className="text-5xl mb-3">🐾</div>
        <p>Animal no encontrado</p>
        <Link to="/dashboard/animals" className="text-sm underline mt-4 block" style={{ color: '#547792' }}>
          Volver a animales
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-gray-900">Protocolo veterinario</h1>
          <p className="text-gray-500 text-sm">{animal.name} · {animal.breed}</p>
        </div>
      </div>

      {!puedeEditar && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: '#dce8ed', color: '#213448' }}>
          <span>🔒</span>
          <span>Estás viendo el protocolo en modo lectura. Solo el responsable del animal puede modificarlo.</span>
        </div>
      )}

      {completarError && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {completarError}
        </div>
      )}

      {loadingCitas ? (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-10 text-center text-gray-400">
          <div className="animate-spin w-8 h-8 border-2 border-[#547792] border-t-transparent rounded-full mx-auto mb-3" />
          Cargando citas...
        </div>
      ) : (
        <ProtocoloVeterinarioCard
          especie={animal.species}
          birthDate={animal.birthDate}
          protocolo={protocolo}
          onAdd={puedeEditar ? () => setShowModal(true) : undefined}
          onCompletar={puedeEditar ? handleCompletar : undefined}
        />
      )}

      {showModal && puedeEditar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !saving && setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-gray-900">Nuevo tratamiento</h2>
              <button onClick={() => !saving && setShowModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={labelClass}>Tipo de tratamiento <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={form.tratamiento}
                  onChange={e => setForm(f => ({ ...f, tratamiento: e.target.value.toUpperCase().replace(/ /g, '_') }))}
                  placeholder="Ej: ANALITICA, RADIOGRAFIA, REVISION..."
                  className={inputClass}
                  disabled={saving}
                />
                <p className="text-xs text-gray-400 mt-1">En mayúsculas sin espacios, p.ej. ANALITICA</p>
              </div>

              <div>
                <label className={labelClass}>Descripción / Observaciones</label>
                <textarea
                  rows={3}
                  value={form.descripcion}
                  onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                  placeholder="Detalles del tratamiento, resultados, notas..."
                  className={inputClass + ' resize-none'}
                  disabled={saving}
                />
              </div>

              <div>
                <label className={labelClass}>Fecha <span className="text-red-400">*</span></label>
                <input
                  type="date"
                  value={form.fecha}
                  onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))}
                  className={inputClass}
                  disabled={saving}
                />
              </div>

              <div>
                <label className={labelClass}>Veterinario responsable</label>
                <input
                  type="text"
                  value={form.veterinario}
                  onChange={e => setForm(f => ({ ...f, veterinario: e.target.value }))}
                  placeholder="Nombre del veterinario..."
                  className={inputClass}
                  disabled={saving}
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm bg-red-50 rounded-xl px-3 py-2">{error}</p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => !saving && setShowModal(false)}
                  disabled={saving}
                  className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 text-white py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
                  style={{ backgroundColor: '#547792' }}
                  onMouseEnter={e => !saving && (e.currentTarget.style.backgroundColor = '#3d6180')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#547792')}
                >
                  {saving ? 'Guardando...' : 'Guardar tratamiento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}