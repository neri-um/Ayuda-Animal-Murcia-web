import { useState } from 'react';
import { Plus, Edit2, Trash2, Package, AlertTriangle, Search, Send, XCircle } from 'lucide-react';
import { Link } from 'react-router';
import { useApp, useAuth } from '../../context/AppContext';
import { Product } from '../../types';
import { useEnums, formatEnum } from '../../hooks/useEnums';

const CONSUMIBLE_CATEGORIES = ['ALIMENTACION', 'MEDICAMENTO', 'HIGIENE'];
const isConsumible = (categoria: string) => CONSUMIBLE_CATEGORIES.includes(categoria);

export default function Warehouse() {
  const { products, requests, users, addProduct, updateProduct, deleteProduct, addRequest } = useApp();
  const { currentUser, canAccess } = useAuth();
  const { enums } = useEnums();
  const isManager = canAccess('ENCARGADO');

  const categories = enums?.categoriasProducto ?? [];

  const [groupFilter, setGroupFilter] = useState<'CONSUMIBLE' | 'OBJETO'>('CONSUMIBLE');
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState<'ALL' | 'PERRO' | 'GATO'>('ALL');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [requestModal, setRequestModal] = useState<Product | null>(null);
  const [reqForm, setReqForm] = useState({ quantity: 1, reason: '' });
  const [productForm, setProductForm] = useState<{
    nombre: string;
    categoria: string;
    stock: number;
    descripcion: string;
    paraPerro: boolean;
    paraGato: boolean;
    stockMinimo: number;
    fechaCaducidad: string;
    reservadoCer: boolean;
  }>({
    nombre: '', categoria: '', stock: 0, descripcion: '',
    paraPerro: false, paraGato: false, stockMinimo: 0, fechaCaducidad: '', reservadoCer: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseFiltered = products.filter(p => {
    const inGroup = groupFilter === 'CONSUMIBLE' ? isConsumible(p.categoria) : !isConsumible(p.categoria);
    if (!inGroup) return false;
    if (search && !p.nombre.toLowerCase().includes(search.toLowerCase())) return false;
    if (catFilter && p.categoria !== catFilter) return false;
    return true;
  });

  const showPerro = groupFilter === 'CONSUMIBLE' && speciesFilter !== 'GATO';
  const showGato = groupFilter === 'CONSUMIBLE' && speciesFilter !== 'PERRO';
  const perroList = baseFiltered.filter(p => p.paraPerro);
  const gatoList = baseFiltered.filter(p => p.paraGato);
  const sinEspecieList = baseFiltered.filter(p => !p.paraPerro && !p.paraGato);
  const hasVisibleConsumible =
    (showPerro ? perroList.length : 0) +
    (showGato ? gatoList.length : 0) +
    (speciesFilter === 'ALL' ? sinEspecieList.length : 0) > 0;

  const groupCount = (group: 'CONSUMIBLE' | 'OBJETO') =>
    products.filter(p => group === 'CONSUMIBLE' ? isConsumible(p.categoria) : !isConsumible(p.categoria)).length;

  const categoriesInGroup = categories.filter(c => groupFilter === 'CONSUMIBLE' ? isConsumible(c) : !isConsumible(c));

  const assignedVolunteers = (productId: string) =>
    requests.filter(r => r.productId === productId && r.status === 'ACEPTADA' && !r.returnConfirmed);

  const getNombreVoluntario = (volunteerId: string): string => {
    const u = users?.find(u => String(u.id) === String(volunteerId));
    return u ? u.nombre : `Voluntario #${volunteerId}`;
  };

  const openEditProduct = (p: Product) => {
    setEditId(p.id);
    setProductForm({
      nombre: p.nombre,
      categoria: p.categoria,
      stock: p.stockTotal,
      descripcion: p.descripcion,
      paraPerro: p.paraPerro,
      paraGato: p.paraGato,
      stockMinimo: p.stockMinimo,
      fechaCaducidad: p.fechaCaducidad ?? '',
      reservadoCer: p.reservadoCer,
    });
    setError(null);
    setShowForm(true);
  };

  const openAddProduct = () => {
    setEditId(null);
    setProductForm({
      nombre: '',
      categoria: categories[0] ?? '',
      stock: 0,
      descripcion: '',
      paraPerro: false,
      paraGato: false,
      stockMinimo: 0,
      fechaCaducidad: '',
      reservadoCer: false,
    });
    setError(null);
    setShowForm(true);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        nombre: productForm.nombre,
        categoria: productForm.categoria,
        stock: productForm.stock,
        descripcion: productForm.descripcion,
        paraPerro: productForm.paraPerro,
        paraGato: productForm.paraGato,
        stockMinimo: productForm.stockMinimo,
        fechaCaducidad: productForm.fechaCaducidad || null,
        reservadoCer: productForm.reservadoCer,
      };
      if (editId) {
        await updateProduct(editId, payload);
      } else {
        await addProduct(payload);
      }
      setShowForm(false);
    } catch (e: any) {
      setError(e?.message ?? 'Error al guardar el producto. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteProduct(id);
      setDeleteConfirm(null);
    } catch (e: any) {
      setError(e?.message ?? 'Error al eliminar el producto.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestModal || !currentUser) return;
    setLoading(true);
    setError(null);
    try {
      await addRequest({ productId: requestModal.id, volunteerId: currentUser.id, quantity: reqForm.quantity, reason: reqForm.reason });
      setRequestModal(null);
      setReqForm({ quantity: 1, reason: '' });
    } catch (e: any) {
      setError(e?.message ?? 'Error al enviar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  const renderCard = (p: Product) => {
    const assigned  = p.stockTotal - p.stockDisponible;
    const available = p.stockDisponible;
    const isEmpty   = available === 0;
    const isLow     = !isEmpty && p.stockMinimo > 0 && available <= p.stockMinimo;
    const isCaducado = p.caducado;
    const volunteers = assignedVolunteers(p.id);

    return (
      <div
        key={p.id}
        className="bg-white rounded-2xl border p-5 flex flex-col gap-3"
        style={{ borderColor: isEmpty ? '#fecaca' : '#f3f4f6' }}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Link to={`/dashboard/almacen/${p.id}`}>
                <h3 className="text-sm hover:underline" style={{ fontWeight: 600, color: '#547792' }}>{p.nombre}</h3>
              </Link>
              {p.paraPerro && (
                <span className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200" title="Perro">
                  <span className="w-3 h-3" role="img" aria-label="perro">🐶</span>
                </span>
              )}
              {p.paraGato && (
                <span className="flex items-center gap-1 text-xs text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-200" title="Gato">
                  <span className="w-3 h-3" role="img" aria-label="gato">🐱</span>
                </span>
              )}
              {isCaducado && (
                <span className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200" title="Caducado - Gastar con urgencia">
                  <span className="w-3 h-3" role="img" aria-label="caducado">⚠️</span> Caducado
                </span>
              )}
              {p.reservadoCer && (
                <span className="flex items-center gap-1 text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200" title="Reservado CER">
                  <span className="w-3 h-3" role="img" aria-label="cer">❌</span> CER
                </span>
              )}
              {isEmpty && (
                <span className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                  <XCircle className="w-3 h-3" /> Reponer
                </span>
              )}
              {isLow && (
                <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <AlertTriangle className="w-3 h-3" /> Stock bajo
                </span>
              )}
            </div>
            <span className="text-xs text-gray-400 mt-0.5 block">{formatEnum(p.categoria)}</span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button onClick={() => openEditProduct(p)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors" title="Editar">
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setDeleteConfirm(p.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Eliminar">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className={`grid gap-2 text-center ${isConsumible(p.categoria) ? 'grid-cols-1' : 'grid-cols-2'}`}>
          <div className="rounded-xl p-2" style={{ backgroundColor: available === 0 ? '#fee2e2' : '#f0fdf4' }}>
            <div className="text-base" style={{ fontWeight: 700, color: available === 0 ? '#b91c1c' : '#166534' }}>{available}</div>
            <div className="text-xs text-gray-400">Disponible</div>
          </div>
          {!isConsumible(p.categoria) && (
            <div className="rounded-xl p-2" style={{ backgroundColor: assigned > 0 ? '#fefce8' : '#f9fafb' }}>
              <div className="text-base" style={{ fontWeight: 700, color: assigned > 0 ? '#854d0e' : '#6b7280' }}>{assigned}</div>
              <div className="text-xs text-gray-400">En uso</div>
            </div>
          )}
        </div>

        {p.descripcion && (
          <p className="text-xs text-gray-500">{p.descripcion}</p>
        )}

        {volunteers.length > 0 && (
          <div className="rounded-xl px-3 py-2 text-xs bg-gray-50 border border-gray-100">
            <span className="text-gray-400 block mb-1">En uso actualmente:</span>
            <div className="flex flex-wrap gap-1">
              {volunteers.map(r => (
                <span
                  key={r.id}
                  title={r.detalleEntregado}
                  className="inline-flex flex-col items-start px-2.5 py-1.5 rounded-lg text-xs bg-white border border-gray-200"
                >
                  <span className="text-gray-700">
                    {getNombreVoluntario(r.volunteerId)}
                    {r.quantity > 1 && (
                      <span className="ml-1 text-gray-400">×{r.quantity}</span>
                    )}
                  </span>
                  {r.detalleEntregado && (
                    <span className="text-gray-500 mt-0.5">{r.detalleEntregado}</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}

        {!isManager && (
          isEmpty ? (
            <div className="mt-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm w-full bg-red-50 border border-red-200 text-red-500">
              <XCircle className="w-4 h-4" />
              Sin stock disponible
            </div>
          ) : (
            <button
              onClick={() => { setRequestModal(p); setReqForm({ quantity: 1, reason: '' }); }}
              className="mt-auto flex items-center justify-center gap-2 text-white px-4 py-2 rounded-xl text-sm transition-colors w-full"
              style={{ backgroundColor: '#547792' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#3d6180')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#547792')}
            >
              <Send className="w-4 h-4" />
              Solicitar
            </button>
          )
        )}
      </div>
    );
  };

  const gridClass = 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4';

  const emptyState = (
    <div className="bg-white rounded-2xl border border-gray-100 text-center py-16 text-gray-400">
      <Package className="w-10 h-10 mx-auto mb-3 opacity-50" />
      <p>{groupFilter === 'CONSUMIBLE' ? 'No hay productos de alimentación o consumibles' : 'No hay objetos o equipos en el almacén'}</p>
    </div>
  );

  const sectionHeader = (emoji: string, label: string, count: number, color: string) => (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-lg" role="img">{emoji}</span>
      <h2 className="text-gray-800" style={{ fontWeight: 700, fontSize: '1rem' }}>{label}</h2>
      <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: color }}>{count}</span>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-gray-900">Almacén</h1>
          <p className="text-gray-500 text-sm mt-1">
            {isManager ? 'Gestión completa del inventario' : 'Consulta y solicita productos del almacén'}
          </p>
        </div>
        <button
          onClick={openAddProduct}
          className="inline-flex items-center gap-2 text-white px-5 py-2.5 rounded-xl text-sm transition-colors"
          style={{ backgroundColor: '#547792' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#3d6180')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#547792')}
        >
          <Plus className="w-4 h-4" />
          Añadir producto
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="grid grid-cols-2 gap-1.5 bg-gray-100 rounded-2xl p-1.5">
        {([
          { key: 'CONSUMIBLE', label: 'Alimentación' },
          { key: 'OBJETO', label: 'Objetos' },
        ] as const).map(g => (
          <button
            key={g.key}
            onClick={() => { setGroupFilter(g.key); setCatFilter(''); }}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-colors ${groupFilter === g.key ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            style={groupFilter === g.key ? { color: '#213448', fontWeight: 600 } : undefined}
          >
            {g.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${groupFilter === g.key ? 'text-white' : 'bg-gray-200 text-gray-500'}`} style={groupFilter === g.key ? { backgroundColor: '#547792' } : undefined}>{groupCount(g.key)}</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none"
            onFocus={e => (e.currentTarget.style.borderColor = '#547792')}
            onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
          />
        </div>
        <select
          value={catFilter}
          onChange={e => setCatFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
          onFocus={e => (e.currentTarget.style.borderColor = '#547792')}
          onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
        >
          <option value="">Todas las categorías</option>
          {categoriesInGroup.map(c => (
            <option key={c} value={c}>{formatEnum(c)}</option>
          ))}
        </select>
        {groupFilter === 'CONSUMIBLE' && (
          <select
            value={speciesFilter}
            onChange={e => setSpeciesFilter(e.target.value as 'ALL' | 'PERRO' | 'GATO')}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
            onFocus={e => (e.currentTarget.style.borderColor = '#547792')}
            onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
          >
            <option value="ALL">Perro y gato</option>
            <option value="PERRO">🐶 Solo perro</option>
            <option value="GATO">🐱 Solo gato</option>
          </select>
        )}
      </div>

      {groupFilter === 'CONSUMIBLE' ? (
        <div className="space-y-8">
          {showPerro && perroList.length > 0 && (
            <section>
              {sectionHeader('🐶', 'Perro', perroList.length, '#547792')}
              <div className={gridClass}>{perroList.map(renderCard)}</div>
            </section>
          )}
          {showGato && gatoList.length > 0 && (
            <section>
              {sectionHeader('🐱', 'Gato', gatoList.length, '#d6336c')}
              <div className={gridClass}>{gatoList.map(renderCard)}</div>
            </section>
          )}
          {speciesFilter === 'ALL' && sinEspecieList.length > 0 && (
            <section>
              {sectionHeader('🐾', 'Sin clasificar', sinEspecieList.length, '#9CA3AF')}
              <div className={gridClass}>{sinEspecieList.map(renderCard)}</div>
            </section>
          )}
          {!hasVisibleConsumible && emptyState}
        </div>
      ) : (
        baseFiltered.length === 0 ? emptyState : <div className={gridClass}>{baseFiltered.map(renderCard)}</div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-md w-full shadow-xl z-10">
            <h3 className="text-gray-800 mb-5">{editId ? 'Editar producto' : 'Añadir producto'}</h3>
            {error && <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>}
            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Nombre *</label>
                <input
                  type="text" required
                  value={productForm.nombre}
                  onChange={e => setProductForm(f => ({ ...f, nombre: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                  onFocus={e => (e.currentTarget.style.borderColor = '#547792')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Categoría</label>
                <select
                  value={productForm.categoria}
                  onChange={e => setProductForm(f => ({ ...f, categoria: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                  onFocus={e => (e.currentTarget.style.borderColor = '#547792')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{formatEnum(c)}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={productForm.paraPerro} onChange={e => setProductForm(f => ({ ...f, paraPerro: e.target.checked }))} /> Perro</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={productForm.paraGato} onChange={e => setProductForm(f => ({ ...f, paraGato: e.target.checked }))} /> Gato</label>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Stock mínimo (0 = no avisar)</label>
                <input type="number" min={0} value={productForm.stockMinimo} onChange={e => setProductForm(f => ({ ...f, stockMinimo: Number(e.target.value) }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Fecha caducidad (opcional)</label>
                <input type="date" value={productForm.fechaCaducidad} onChange={e => setProductForm(f => ({ ...f, fechaCaducidad: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
              </div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={productForm.reservadoCer} onChange={e => setProductForm(f => ({ ...f, reservadoCer: e.target.checked }))} /> Reservado CER</label>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Descripción</label>
                <textarea
                  rows={2}
                  value={productForm.descripcion}
                  onChange={e => setProductForm(f => ({ ...f, descripcion: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none resize-none"
                  onFocus={e => (e.currentTarget.style.borderColor = '#547792')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} disabled={loading} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50 disabled:opacity-60">Cancelar</button>
                <button
                  type="submit" disabled={loading}
                  className="flex-1 text-white py-2.5 rounded-xl text-sm disabled:opacity-60"
                  style={{ backgroundColor: '#547792' }}
                  onMouseEnter={e => !loading && (e.currentTarget.style.backgroundColor = '#3d6180')}
                  onMouseLeave={e => !loading && (e.currentTarget.style.backgroundColor = '#547792')}
                >
                  {loading ? 'Guardando...' : editId ? 'Guardar cambios' : 'Añadir'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-gray-800 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Eliminar producto
            </h3>
            <p className="text-gray-500 text-sm mb-5">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} disabled={loading} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50 disabled:opacity-60">Cancelar</button>
              <button
                onClick={() => handleDeleteProduct(deleteConfirm)}
                disabled={loading}
                className="flex-1 bg-red-500 text-white py-2.5 rounded-xl text-sm hover:bg-red-600 disabled:opacity-60"
              >
                {loading ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {requestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setRequestModal(null)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-md w-full shadow-xl z-10">
            <h3 className="text-gray-800 mb-1">Solicitar producto</h3>
            <p className="text-gray-500 text-sm mb-4">{requestModal.nombre}</p>
            {error && <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>}
            <form onSubmit={handleRequest} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Cantidad</label>
                <input
                  type="number" min={1} max={requestModal.stockDisponible}
                  value={reqForm.quantity}
                  onChange={e => setReqForm(f => ({ ...f, quantity: Number(e.target.value) }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                  onFocus={e => (e.currentTarget.style.borderColor = '#547792')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Motivo *</label>
                <textarea
                  required rows={3}
                  value={reqForm.reason}
                  onChange={e => setReqForm(f => ({ ...f, reason: e.target.value }))}
                  placeholder="Explica para qué necesitas este producto..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none resize-none"
                  onFocus={e => (e.currentTarget.style.borderColor = '#547792')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setRequestModal(null)} disabled={loading} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50 disabled:opacity-60">Cancelar</button>
                <button
                  type="submit" disabled={loading}
                  className="flex-1 text-white py-2.5 rounded-xl text-sm disabled:opacity-60"
                  style={{ backgroundColor: '#547792' }}
                  onMouseEnter={e => !loading && (e.currentTarget.style.backgroundColor = '#3d6180')}
                  onMouseLeave={e => !loading && (e.currentTarget.style.backgroundColor = '#547792')}
                >
                  {loading ? 'Enviando...' : 'Enviar solicitud'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
