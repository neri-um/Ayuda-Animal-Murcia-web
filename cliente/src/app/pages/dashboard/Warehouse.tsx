import { useState, type ReactNode } from 'react';
import { Plus, Edit2, Trash2, Package, AlertTriangle, Search, Send, XCircle, Dog, Cat, Bone, Soup, Pill, PawPrint, Ban } from 'lucide-react';
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
  const [tipoFilter, setTipoFilter] = useState<'ALL' | 'SECO' | 'HUMEDO' | 'DIETAS'>('ALL');
  const [etapaFilter, setEtapaFilter] = useState<'ALL' | 'ADULTO' | 'CACHORRO'>('ALL');
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
    tipoAlimento: string;
    etapaAlimento: string;
    esDieta: boolean;
  }>({
    nombre: '', categoria: '', stock: 0, descripcion: '',
    paraPerro: false, paraGato: false, stockMinimo: 0, fechaCaducidad: '', reservadoCer: false,
    tipoAlimento: '', etapaAlimento: '', esDieta: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseFiltered = products.filter(p => {
    const inGroup = groupFilter === 'CONSUMIBLE' ? isConsumible(p.categoria) : !isConsumible(p.categoria);
    if (!inGroup) return false;
    if (search && !p.nombre.toLowerCase().includes(search.toLowerCase())) return false;
    if (catFilter && p.categoria !== catFilter) return false;
    if (groupFilter === 'CONSUMIBLE') {
      if (tipoFilter === 'DIETAS') {
        if (!p.esDieta) return false;
      } else if (tipoFilter !== 'ALL') {
        if (p.esDieta || p.tipoAlimento !== tipoFilter) return false;
      }
      if (etapaFilter !== 'ALL' && p.etapaAlimento !== etapaFilter) return false;
    }
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
      tipoAlimento: p.tipoAlimento ?? '',
      etapaAlimento: p.etapaAlimento ?? '',
      esDieta: p.esDieta,
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
      tipoAlimento: '',
      etapaAlimento: '',
      esDieta: false,
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
        tipoAlimento: productForm.categoria === 'ALIMENTACION' ? (productForm.tipoAlimento || null) : null,
        etapaAlimento: productForm.categoria === 'ALIMENTACION' ? (productForm.etapaAlimento || null) : null,
        esDieta: productForm.categoria === 'ALIMENTACION' ? productForm.esDieta : false,
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
              {isCaducado && (
                <span className="inline-flex items-center gap-1 text-xs leading-none text-red-600 bg-red-50 px-2 py-1 rounded-full border border-red-200" title="Caducado - Gastar con urgencia">
                  <AlertTriangle className="w-3 h-3" /> Caducado
                </span>
              )}
              {p.reservadoCer && (
                <span className="inline-flex items-center gap-1 text-xs leading-none text-purple-600 bg-purple-50 px-2 py-1 rounded-full border border-purple-200" title="Reservado CER">
                  <Ban className="w-3 h-3" /> CER
                </span>
              )}
              {isEmpty && (
                <span className="inline-flex items-center gap-1 text-xs leading-none text-red-600 bg-red-50 px-2 py-1 rounded-full border border-red-200">
                  <XCircle className="w-3 h-3" /> Reponer
                </span>
              )}
              {isLow && (
                <span className="inline-flex items-center gap-1 text-xs leading-none text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-200">
                  <AlertTriangle className="w-3 h-3" /> Stock bajo
                </span>
              )}
            </div>
            <span className="text-xs text-gray-400 mt-0.5 block">{formatEnum(p.categoria)}</span>
            {(p.tipoAlimento || p.etapaAlimento || p.esDieta) && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {p.esDieta && <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200"><Pill className="w-3 h-3" /> Dieta</span>}
                {!p.esDieta && p.tipoAlimento === 'SECO' && <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200"><Bone className="w-3 h-3" /> Sólido</span>}
                {!p.esDieta && p.tipoAlimento === 'HUMEDO' && <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200"><Soup className="w-3 h-3" /> Húmedo</span>}
                {p.etapaAlimento === 'CACHORRO' && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Cachorro/Kitten</span>}
                {p.etapaAlimento === 'ADULTO' && <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200">Adulto</span>}
              </div>
            )}
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

  const gridClass = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4';

  const emptyState = (
    <div className="bg-white rounded-2xl border border-gray-100 text-center py-16 text-gray-400">
      <Package className="w-10 h-10 mx-auto mb-3 opacity-50" />
      <p>{groupFilter === 'CONSUMIBLE' ? 'No hay productos de alimentación o consumibles' : 'No hay objetos o equipos en el almacén'}</p>
    </div>
  );

  const renderSpecies = (icon: ReactNode, label: string, items: Product[]) => {
    if (items.length === 0) return null;
    return (
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#e5e7eb', color: '#334155' }}>
            {icon}
          </span>
          <h2 style={{ fontWeight: 700, color: '#334155', fontSize: '1.1rem' }}>{label}</h2>
          <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: '#475569' }}>{items.length}</span>
        </div>
        <div className={gridClass}>{items.map(renderCard)}</div>
      </section>
    );
  };

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

      <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
        <div className="relative">
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
        <div className="flex flex-wrap gap-3">
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
            <>
              <select
                value={speciesFilter}
                onChange={e => setSpeciesFilter(e.target.value as 'ALL' | 'PERRO' | 'GATO')}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                onFocus={e => (e.currentTarget.style.borderColor = '#547792')}
                onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
              >
                <option value="ALL">Gato y perro</option>
                <option value="GATO">Solo gato</option>
                <option value="PERRO">Solo perro</option>
              </select>
              <select
                value={tipoFilter}
                onChange={e => setTipoFilter(e.target.value as 'ALL' | 'SECO' | 'HUMEDO' | 'DIETAS')}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                onFocus={e => (e.currentTarget.style.borderColor = '#547792')}
                onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
              >
                <option value="ALL">Todos los tipos</option>
                <option value="SECO">Sólido</option>
                <option value="HUMEDO">Húmedo</option>
                <option value="DIETAS">Dietas</option>
              </select>
              <select
                value={etapaFilter}
                onChange={e => setEtapaFilter(e.target.value as 'ALL' | 'ADULTO' | 'CACHORRO')}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                onFocus={e => (e.currentTarget.style.borderColor = '#547792')}
                onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
              >
                <option value="ALL">Todas las etapas</option>
                <option value="CACHORRO">Cachorros / Kitten</option>
                <option value="ADULTO">Adultos</option>
              </select>
            </>
          )}
        </div>
      </div>

      {groupFilter === 'CONSUMIBLE' ? (
        <div className="space-y-10">
          {showGato && renderSpecies(<Cat className="w-5 h-5" />, 'Gato', gatoList)}
          {showPerro && renderSpecies(<Dog className="w-5 h-5" />, 'Perro', perroList)}
          {speciesFilter === 'ALL' && renderSpecies(<PawPrint className="w-5 h-5" />, 'Sin clasificar', sinEspecieList)}
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
              <div>
                <label className="block text-sm text-gray-700 mb-1">Stock (unidades) *</label>
                <input
                  type="number" min={0} required
                  value={productForm.stock}
                  onChange={e => setProductForm(f => ({ ...f, stock: Math.max(0, Number(e.target.value)) }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                  onFocus={e => (e.currentTarget.style.borderColor = '#547792')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={productForm.paraPerro} onChange={e => setProductForm(f => ({ ...f, paraPerro: e.target.checked }))} /> <Dog className="w-4 h-4 text-gray-500" /> Perro</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={productForm.paraGato} onChange={e => setProductForm(f => ({ ...f, paraGato: e.target.checked }))} /> <Cat className="w-4 h-4 text-gray-500" /> Gato</label>
              </div>

              {productForm.categoria === 'ALIMENTACION' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Tipo</label>
                      <select
                        value={productForm.tipoAlimento}
                        onChange={e => setProductForm(f => ({ ...f, tipoAlimento: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                        onFocus={e => (e.currentTarget.style.borderColor = '#547792')}
                        onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                      >
                        <option value="">Sin especificar</option>
                        <option value="SECO">Sólido</option>
                        <option value="HUMEDO">Húmedo</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Etapa</label>
                      <select
                        value={productForm.etapaAlimento}
                        onChange={e => setProductForm(f => ({ ...f, etapaAlimento: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                        onFocus={e => (e.currentTarget.style.borderColor = '#547792')}
                        onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                      >
                        <option value="">Sin especificar</option>
                        <option value="ADULTO">Adulto</option>
                        <option value="CACHORRO">Cachorro / Kitten</option>
                      </select>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={productForm.esDieta} onChange={e => setProductForm(f => ({ ...f, esDieta: e.target.checked }))} /> Dieta (gastrointestinal, etc.)</label>
                </>
              )}

              <div>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={productForm.stockMinimo > 0} onChange={e => setProductForm(f => ({ ...f, stockMinimo: e.target.checked ? 2 : 0 }))} />
                  Avisar cuando queden pocas unidades
                </label>
                {productForm.stockMinimo > 0 && (
                  <div className="mt-2">
                    <label className="block text-sm text-gray-700 mb-1">Avisar al llegar a (unidades)</label>
                    <input type="number" min={1} value={productForm.stockMinimo} onChange={e => setProductForm(f => ({ ...f, stockMinimo: Math.max(0, Number(e.target.value)) }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Fecha caducidad (opcional)</label>
                <input type="date" value={productForm.fechaCaducidad} onChange={e => setProductForm(f => ({ ...f, fechaCaducidad: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
              </div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={productForm.reservadoCer} onChange={e => setProductForm(f => ({ ...f, reservadoCer: e.target.checked }))} /> <Ban className="w-4 h-4 text-gray-500" /> Reservado CER</label>

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
