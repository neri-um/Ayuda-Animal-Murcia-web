import { useState } from 'react';
import { Plus, Edit2, UserX, UserCheck, Search, Shield } from 'lucide-react';
import { useApp, useAuth } from '../../context/AppContext';
import { User, UserRole } from '../../data/mockData';
import { useNavigate } from 'react-router';
import React from 'react';
import { useEnums, formatEnum } from '../../hooks/useEnums';

const roleStyleMap: Record<string, React.CSSProperties> = {
  VOLUNTARIO: { backgroundColor: '#d0e4f0', color: '#1e4d6e', borderColor: '#a8c8e0' },
  ENCARGADO:  { backgroundColor: '#d0eceb', color: '#1e5a57', borderColor: '#a8d8d5' },
  ADMIN:      { backgroundColor: '#d4ecdc', color: '#2e7a4e', borderColor: '#b8dfc6' },
};
const roleStyleDefault: React.CSSProperties = {
  backgroundColor: '#f3f4f6', color: '#6b7280', borderColor: '#e5e7eb',
};

const avatarStyleMap: Record<string, React.CSSProperties> = {
  VOLUNTARIO: { backgroundColor: '#6898B6' },
  ENCARGADO:  { backgroundColor: '#68B6AD' },
  ADMIN:      { backgroundColor: '#68B686' },
};
const avatarStyleDefault: React.CSSProperties = { backgroundColor: '#9ca3af' };

type UserFormData = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone: string;
};

function ToggleSwitch({ active, onChange, loading }: { active: boolean; onChange: (val: boolean) => void; loading?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      onClick={() => !loading && onChange(!active)}
      disabled={loading}
      title={active ? 'Haz clic para desactivar' : 'Haz clic para activar'}
      className="relative inline-flex items-center flex-shrink-0 h-6 w-11 rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-60"
      style={{ backgroundColor: active ? '#68B686' : '#d1d5db', cursor: loading ? 'not-allowed' : 'pointer' }}
    >
      <span
        className="inline-block w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200"
        style={{ transform: active ? 'translateX(22px)' : 'translateX(2px)' }}
      />
    </button>
  );
}

export default function UserManagement() {
  const { users, addUser, updateUser, toggleUserActive } = useApp();
  const { currentUser, canAccess } = useAuth();
  const navigate = useNavigate();
  const { enums } = useEnums();

  const roleOptions: string[] = enums?.roles ?? ['VOLUNTARIO', 'ENCARGADO', 'ADMIN'];

  const emptyForm: UserFormData = {
    name: '', email: '', password: '',
    role: (roleOptions[0] as UserRole) ?? 'VOLUNTARIO',
    phone: '',
  };

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | ''>('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<UserFormData>(emptyForm);
  const [confirmToggle, setConfirmToggle] = useState<User | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  if (!canAccess('ADMIN')) {
    navigate('/dashboard');
    return null;
  }

  const filtered = users.filter(u => {
    if (u.id === currentUser?.id) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) &&
        !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (roleFilter && u.role !== roleFilter) return false;
    return true;
  });

  const openAdd = () => {
    setEditId(null);
    setForm({ ...emptyForm, role: (roleOptions[0] as UserRole) ?? 'VOLUNTARIO' });
    setErrors({});
    setApiError(null);
    setShowForm(true);
  };

  const openEdit = (user: User) => {
    setEditId(user.id);
    setForm({ name: user.name, email: user.email, password: '', role: user.role, phone: user.phone || '' });
    setErrors({});
    setApiError(null);
    setShowForm(true);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Nombre obligatorio';
    if (!form.email.trim()) newErrors.email = 'Email obligatorio';
    if (!editId && !form.password.trim()) newErrors.password = 'Contraseña obligatoria';
    if (form.password && form.password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    if (users.some(u => u.email === form.email && u.id !== editId))
      newErrors.email = 'Este email ya está en uso';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError(null);
    try {
      if (editId) {
        const updates: Partial<User> = { name: form.name, email: form.email, role: form.role, phone: form.phone };
        if (form.password) updates.password = form.password;
        await updateUser(editId, updates);
      } else {
        await addUser({ name: form.name, email: form.email, password: form.password, role: form.role, phone: form.phone, active: true });
      }
      setShowForm(false);
    } catch {
      setApiError('Error al guardar el usuario. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDirect = async (user: User) => {
    setTogglingId(user.id);
    setApiError(null);
    try {
      await toggleUserActive(user.id, !user.active);
    } catch {
      setApiError('Error al cambiar el estado del usuario.');
    } finally {
      setTogglingId(null);
    }
  };

  const handleToggleActive = async (user: User) => {
    setLoading(true);
    setApiError(null);
    try {
      await toggleUserActive(user.id, !user.active);
      setConfirmToggle(null);
    } catch {
      setApiError('Error al cambiar el estado del usuario.');
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total:      users.filter(u => u.id !== currentUser?.id).length,
    active:     users.filter(u => u.active && u.id !== currentUser?.id).length,
    volunteers: users.filter(u => u.role === 'VOLUNTARIO').length,
    managers:   users.filter(u => u.role === 'ENCARGADO').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-gray-900">Gestión de usuarios</h1>
          <p className="text-gray-500 text-sm mt-1">Administra las cuentas de voluntarios y encargados</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 text-white px-5 py-2.5 rounded-xl text-sm transition-colors"
          style={{ backgroundColor: '#68B686' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#5a9d74')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#68B686')}
        >
          <Plus className="w-4 h-4" />
          Crear cuenta
        </button>
      </div>

      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{apiError}</div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total usuarios', value: stats.total,      style: { fontWeight: 700, color: '#1f2937' } as React.CSSProperties, bg: { backgroundColor: '#f9fafb' } as React.CSSProperties },
          { label: 'Activos',        value: stats.active,     style: { fontWeight: 700, color: '#2e7a4e' } as React.CSSProperties, bg: { backgroundColor: '#d4ecdc' } as React.CSSProperties },
          { label: 'Voluntarios',    value: stats.volunteers, style: { fontWeight: 700, color: '#1e4d6e' } as React.CSSProperties, bg: { backgroundColor: '#d0e4f0' } as React.CSSProperties },
          { label: 'Encargados',     value: stats.managers,   style: { fontWeight: 700, color: '#1e5a57' } as React.CSSProperties, bg: { backgroundColor: '#d0eceb' } as React.CSSProperties },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl p-4 text-center border border-gray-100" style={s.bg}>
            <div className="text-2xl mb-1" style={s.style}>{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none"
            onFocus={e => (e.currentTarget.style.borderColor = '#68B686')}
            onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
          />
        </div>
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value as UserRole | '')}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
          onFocus={e => (e.currentTarget.style.borderColor = '#68B686')}
          onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
        >
          <option value="">Todos los roles</option>
          {roleOptions.map(r => (
            <option key={r} value={r}>{formatEnum(r)}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="hidden md:grid grid-cols-[3fr_2fr_2fr_1fr_auto] gap-4 px-6 py-3 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wide">
          <span>Usuario</span>
          <span>Email</span>
          <span>Teléfono</span>
          <span>Estado</span>
          <span>Acciones</span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Shield className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>No se encontraron usuarios</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map(user => (
              <div
                key={user.id}
                className={`flex flex-col md:grid md:grid-cols-[3fr_2fr_2fr_1fr_auto] gap-4 items-start md:items-center px-6 py-4 hover:bg-gray-50 transition-colors ${!user.active ? 'opacity-50' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0"
                    style={{ ...(avatarStyleMap[user.role] ?? avatarStyleDefault), fontWeight: 600 }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm text-gray-800" style={{ fontWeight: 500 }}>{user.name}</p>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full border"
                      style={roleStyleMap[user.role] ?? roleStyleDefault}
                    >
                      {formatEnum(user.role)}
                    </span>
                  </div>
                </div>
                <span className="text-sm text-gray-500 hidden md:block">{user.email}</span>
                <span className="text-sm text-gray-500 hidden md:block">{user.phone || '—'}</span>

                {/* Toggle switch de estado */}
                <div className="hidden md:flex items-center gap-2">
                  <ToggleSwitch
                    active={user.active}
                    onChange={() => handleToggleDirect(user)}
                    loading={togglingId === user.id}
                  />
                  <span className="text-xs" style={{ color: user.active ? '#3d7a55' : '#9ca3af' }}>
                    {user.active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => openEdit(user)} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors" title="Editar">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setConfirmToggle(user)}
                    className="p-2 rounded-lg transition-colors"
                    style={user.active ? { color: '#ef4444' } : { color: '#68B686' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = user.active ? '#fee2e2' : '#eaf4ee')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    title={user.active ? 'Desactivar cuenta' : 'Activar cuenta'}
                  >
                    {user.active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-md w-full shadow-xl z-10">
            <h3 className="text-gray-800 mb-5">{editId ? 'Editar usuario' : 'Crear nueva cuenta'}</h3>
            {apiError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{apiError}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Nombre completo *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="María García López"
                  className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none ${errors.name ? 'border-red-400' : 'border-gray-200'}`}
                  onFocus={e => !errors.name && (e.currentTarget.style.borderColor = '#68B686')}
                  onBlur={e => !errors.name && (e.currentTarget.style.borderColor = '#e5e7eb')}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="voluntario@vidanimal.org"
                  className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
                  onFocus={e => !errors.email && (e.currentTarget.style.borderColor = '#68B686')}
                  onBlur={e => !errors.email && (e.currentTarget.style.borderColor = '#e5e7eb')}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Contraseña {editId ? '(dejar en blanco para no cambiar)' : '*'}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Mínimo 6 caracteres"
                  className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none ${errors.password ? 'border-red-400' : 'border-gray-200'}`}
                  onFocus={e => !errors.password && (e.currentTarget.style.borderColor = '#68B686')}
                  onBlur={e => !errors.password && (e.currentTarget.style.borderColor = '#e5e7eb')}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Rol *</label>
                  <select
                    value={form.role}
                    onChange={e => setForm(f => ({ ...f, role: e.target.value as UserRole }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                    onFocus={e => (e.currentTarget.style.borderColor = '#68B686')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                  >
                    {roleOptions.map(r => (
                      <option key={r} value={r}>{formatEnum(r)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="612 345 678"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                    onFocus={e => (e.currentTarget.style.borderColor = '#68B686')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} disabled={loading} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50 disabled:opacity-60">Cancelar</button>
                <button
                  type="submit" disabled={loading}
                  className="flex-1 text-white py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60"
                  style={{ backgroundColor: '#68B686' }}
                  onMouseEnter={e => !loading && (e.currentTarget.style.backgroundColor = '#5a9d74')}
                  onMouseLeave={e => !loading && (e.currentTarget.style.backgroundColor = '#68B686')}
                >
                  {loading ? 'Guardando...' : editId ? 'Guardar cambios' : 'Crear cuenta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmToggle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmToggle(null)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-gray-800 mb-2">
              {confirmToggle.active ? 'Desactivar cuenta' : 'Activar cuenta'}
            </h3>
            <p className="text-gray-500 text-sm mb-5">
              {confirmToggle.active
                ? `¿Desactivar la cuenta de ${confirmToggle.name}? No podrá acceder al sistema.`
                : `¿Activar la cuenta de ${confirmToggle.name}?`
              }
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmToggle(null)} disabled={loading} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50 disabled:opacity-60">Cancelar</button>
              <button
                onClick={() => handleToggleActive(confirmToggle)}
                disabled={loading}
                className="flex-1 text-white py-2.5 rounded-xl text-sm disabled:opacity-60"
                style={{ backgroundColor: confirmToggle.active ? '#ef4444' : '#68B686' }}
              >
                {loading ? 'Guardando...' : confirmToggle.active ? 'Desactivar' : 'Activar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
