import { useEffect, useState, useRef } from 'react';
import { Plus, Pencil, Trash2, X, Newspaper, Save, Upload, ImagePlus } from 'lucide-react';
import { useAuth } from '../../context/AppContext';
import { getEntradasGenerales, crearEntradaBlog, editarEntradaBlog, eliminarEntradaBlog } from '../../services/blog';
import { uploadToImgBB } from '../../services/imgbb';
import type { EntradaBlog, EntradaBlogInput } from '../../types';

const vacio: EntradaBlogInput = {
  titulo: '',
  contenido: '',
  fecha: new Date().toISOString().slice(0, 10),
  imagenUrl: '',
  galeria: [],
  etiquetas: [],
  animalId: null,
};

function aInput(e: EntradaBlog): EntradaBlogInput {
  return {
    titulo: e.titulo,
    contenido: e.contenido,
    fecha: e.fecha,
    imagenUrl: e.imagenUrl ?? '',
    galeria: e.galeria ?? [],
    etiquetas: e.etiquetas ?? [],
    animalId: e.animalId ?? null,
  };
}

export default function BlogManagement() {
  const { token } = useAuth();
  const [entradas, setEntradas] = useState<EntradaBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<EntradaBlogInput | null>(null);
  const [error, setError] = useState('');
  const [subiendoImg, setSubiendoImg] = useState(false);
  const [subiendoGaleria, setSubiendoGaleria] = useState(false);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const galeriaInputRef = useRef<HTMLInputElement>(null);

  const subirGaleria = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length || !editando) return;
    setSubiendoGaleria(true);
    try {
      const urls = await Promise.all(files.map(uploadToImgBB));
      setEditando({ ...editando, galeria: [...(editando.galeria || []), ...urls] });
    } catch (err: any) {
      setError(err?.message ?? 'No se pudieron subir algunas fotos');
    } finally {
      setSubiendoGaleria(false);
      if (galeriaInputRef.current) galeriaInputRef.current.value = '';
    }
  };

  const load = async () => {
    setLoading(true);
    try {
      setEntradas(await getEntradasGenerales());
    } catch {
      setEntradas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const guardar = async () => {
    if (!editando) return;
    if (!editando.titulo.trim()) { setError('El título es obligatorio'); return; }
    if (!editando.fecha) { setError('La fecha es obligatoria'); return; }
    setError('');
    try {
      if (editando.id) {
        await editarEntradaBlog(editando.id, editando, token);
      } else {
        await crearEntradaBlog(editando, token);
      }
      setEditando(null);
      await load();
    } catch (e: any) {
      setError(e?.message ?? 'No se pudo guardar la entrada');
    }
  };

  const eliminar = async (id: number) => {
    if (!window.confirm('¿Seguro que quieres eliminar esta entrada?')) return;
    try {
      await eliminarEntradaBlog(id, token);
      await load();
    } catch (e: any) {
      setError(e?.message ?? 'No se pudo eliminar la entrada');
    }
  };

  const inputCls = "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none";
  const labelCls = "block text-sm text-gray-700 mb-1";

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-gray-900 flex items-center gap-2">
            <Newspaper className="w-6 h-6" style={{ color: '#547792' }} />
            Blog
          </h1>
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500">Entradas generales</span>
        </div>
        <button
          onClick={() => setEditando({ ...vacio })}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-white transition-colors"
          style={{ backgroundColor: '#547792' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#3d6180')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#547792')}
        >
          <Plus className="w-4 h-4" />Nueva entrada
        </button>
      </div>

      {error && (
        <div className="mb-4 text-sm rounded-xl px-4 py-2.5 border" style={{ backgroundColor: '#fde8e8', color: '#b91c1c', borderColor: '#f5c6c6' }}>
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-400 py-10 text-center">Cargando...</p>
      ) : entradas.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📰</p>
          <p>Aún no hay entradas de blog.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entradas.map(e => (
            <div key={e.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4">
              {e.imagenUrl ? (
                <img src={e.imagenUrl} alt="" className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center text-2xl flex-shrink-0">📰</div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400">{e.fecha ? new Date(e.fecha).toLocaleDateString('es-ES') : '—'}</p>
                <h3 className="text-sm font-semibold text-gray-800 truncate">{e.titulo}</h3>
                {(e.etiquetas || []).length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {e.etiquetas.map(t => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#f7e3b0', color: '#2e2e2e' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => setEditando(aInput(e))} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" aria-label="Editar">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => eliminar(e.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-400 transition-colors" aria-label="Eliminar">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editando && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 mt-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-gray-900">{editando.id ? 'Editar entrada' : 'Nueva entrada'}</h2>
              <button onClick={() => setEditando(null)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelCls}>Título *</label>
                <input
                  value={editando.titulo}
                  onChange={e => setEditando({ ...editando, titulo: e.target.value })}
                  className={inputCls}
                  placeholder="Título de la entrada"
                />
              </div>
              <div>
                <label className={labelCls}>Fecha *</label>
                <input
                  type="date"
                  value={editando.fecha}
                  onChange={e => setEditando({ ...editando, fecha: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Imagen (opcional)</label>
                <input ref={imgInputRef} type="file" accept="image/*" className="hidden"
                  onChange={async e => {
                    const file = e.target.files?.[0];
                    if (!file || !editando) return;
                    setSubiendoImg(true);
                    try {
                      const url = await uploadToImgBB(file);
                      setEditando({ ...editando, imagenUrl: url });
                    } catch (err: any) {
                      setError(err?.message ?? 'No se pudo subir la imagen');
                    } finally {
                      setSubiendoImg(false);
                      if (imgInputRef.current) imgInputRef.current.value = '';
                    }
                  }} />
                {editando.imagenUrl ? (
                  <div className="relative rounded-xl overflow-hidden">
                    <img src={editando.imagenUrl} alt="Imagen de la entrada" className="w-full h-44 object-cover" />
                    <button
                      type="button"
                      onClick={() => setEditando({ ...editando, imagenUrl: '' })}
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
                    className="w-full border-2 border-dashed border-gray-200 rounded-xl py-8 flex flex-col items-center gap-2 text-gray-400 hover:border-[#547792] transition-colors disabled:opacity-60"
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
                <label className={labelCls}>Galería (opcional)</label>
                <input ref={galeriaInputRef} type="file" accept="image/*" multiple className="hidden" onChange={subirGaleria} />
                {(editando.galeria ?? []).length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {(editando.galeria ?? []).map((url, i) => (
                      <div key={i} className="relative rounded-xl overflow-hidden aspect-square">
                        <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setEditando({ ...editando, galeria: (editando.galeria ?? []).filter((_, j) => j !== i) })}
                          className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
                          aria-label={`Quitar foto ${i + 1}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => galeriaInputRef.current?.click()}
                  disabled={subiendoGaleria}
                  className="w-full border-2 border-dashed border-gray-200 rounded-xl py-6 flex flex-col items-center gap-2 text-gray-400 hover:border-[#547792] transition-colors disabled:opacity-60"
                >
                  {subiendoGaleria ? (
                    <><div className="w-5 h-5 border-2 border-[#547792] border-t-transparent rounded-full animate-spin" /><span className="text-sm">Subiendo...</span></>
                  ) : (
                    <><ImagePlus className="w-6 h-6" /><span className="text-sm">Añadir fotos (puedes elegir varias)</span></>
                  )}
                </button>
              </div>
              <div>
                <label className={labelCls}>Etiquetas (separadas por comas)</label>
                <input
                  value={(editando.etiquetas ?? []).join(', ')}
                  onChange={e => setEditando({
                    ...editando,
                    etiquetas: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                  })}
                  className={inputCls}
                  placeholder="Evento, Campaña, Adopciones..."
                />
              </div>
              <div>
                <label className={labelCls}>Contenido</label>
                <textarea
                  value={editando.contenido}
                  onChange={e => setEditando({ ...editando, contenido: e.target.value })}
                  rows={6}
                  className={inputCls}
                  placeholder="Cuenta qué pasó..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setEditando(null)} className="px-4 py-2 rounded-xl text-sm border border-gray-200 hover:bg-gray-50">
                Cancelar
              </button>
              <button
                onClick={guardar}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-white transition-colors"
                style={{ backgroundColor: '#547792' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#3d6180')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#547792')}
              >
                <Save className="w-4 h-4" />Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
