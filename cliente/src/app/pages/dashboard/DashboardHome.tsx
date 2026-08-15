import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { PawPrint, ClipboardList, FileText, AlertTriangle, ChevronRight, User } from 'lucide-react';
import { useApp, useAuth } from '../../context/AppContext';
import { AnimalStatusBadge } from '../../components/StatusBadge';

import { API_BASE as BASE } from '../../services/api';

function StatCard({ to, icon, label, value, sub, color }: {
  to: string;
  icon: React.ReactNode;
  label: string;
  value: number | string;
  sub?: string;
  color: string;
}) {
  return (
    <Link
      to={to}
      className="group bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3 hover:border-gray-200 hover:shadow-sm transition-all"
    >
      <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <div style={{ fontSize: '1.4rem', fontWeight: 700 }} className="text-gray-800 leading-tight">{value}</div>
        <div className="text-sm text-gray-500 truncate">{label}</div>
        {sub && <div className="text-xs text-gray-400 mt-0.5 truncate">{sub}</div>}
      </div>
      <ChevronRight
        className="w-4 h-4 text-gray-300 ml-auto flex-shrink-0 group-hover:text-[#547792] group-hover:translate-x-0.5 transition-all"
      />
    </Link>
  );
}

function AnimalItem({ a, responsable }: {
  a: { id: number; name: string; breed: string; status: string; imageUrl?: string };
  responsable?: string;
}) {
  return (
    <Link
      to={`/dashboard/animales/${a.id}`}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
    >
      {a.imageUrl
        ? <img src={a.imageUrl} alt={a.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" loading="lazy" width={40} height={40} />
        : <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center text-gray-400"><PawPrint className="w-5 h-5" /></div>
      }
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800 font-medium truncate">{a.name}</p>
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-xs text-gray-400 truncate">{a.breed}</p>
          {responsable && (
            <span className="inline-flex items-center gap-1 text-xs" style={{ color: '#547792' }}>· <User className="w-3 h-3" /> {responsable}</span>
          )}
        </div>
      </div>
      <AnimalStatusBadge status={a.status} />
    </Link>
  );
}

export default function DashboardHome() {
  const { animalsTodos, requests, products, users } = useApp();
  const { currentUser, token, canAccess } = useAuth();

  const [adopcionesPendientes, setAdopcionesPendientes] = useState(0);

  useEffect(() => {
    if (!token) return;
    fetch(`${BASE}/adopciones`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => (res.ok ? res.json() : []))
      .then((data: any[]) => {
        if (Array.isArray(data)) {
          setAdopcionesPendientes(data.filter(s => s.estado === 'PENDIENTE').length);
        }
      })
      .catch(() => {});
  }, [token]);

  const pendingRequests  = requests.filter(r => r.status === 'PENDIENTE').length;
  const availableAnimals = animalsTodos.filter(a => a.status === 'EN_ADOPCION').length;
  const myAnimals        = animalsTodos.filter(a => String(a.volunteerId) === String(currentUser?.id));
  const otherAnimals     = animalsTodos.filter(a => String(a.volunteerId) !== String(currentUser?.id));
  const lowStock         = products.filter(p => p.stockDisponible <= 5);

  const getNombreResponsable = (volunteerId: string | undefined): string | undefined => {
    if (!volunteerId) return undefined;
    const u = users?.find((u: any) => String(u.id) === String(volunteerId));
    if (!u) return undefined;
    return u.name + ((u as any).apellidos ? ' ' + (u as any).apellidos : '');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900">Bienvenido/a, {currentUser?.name.split(' ')[0]}</h1>
        <p className="text-gray-500 text-sm mt-1">Aquí tienes un resumen del estado de la protectora.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          to="/dashboard/animales"
          icon={<PawPrint className="w-5 h-5" style={{ color: '#547792' }} />}
          label="Animales en adopción"
          value={availableAnimals}
          sub={`de ${animalsTodos.length} en total`}
          color="bg-[#dce8ed]"
        />
        <StatCard
          to="/dashboard/adopciones"
          icon={<FileText className="w-5 h-5" style={{ color: '#547792' }} />}
          label="Formularios de adopción"
          value={adopcionesPendientes}
          sub="sin gestionar"
          color="bg-[#dce8ed]"
        />
        <StatCard
          to="/dashboard/solicitudes"
          icon={<ClipboardList className="w-5 h-5" style={{ color: '#547792' }} />}
          label="Solicitudes almacén"
          value={pendingRequests}
          sub={pendingRequests === 1 ? 'pendiente' : 'pendientes'}
          color="bg-[#dce8ed]"
        />
      </div>

      {canAccess('ENCARGADO') && lowStock.length > 0 && (
        <div className="bg-[#dce8ed] border border-[#b5cdd8] rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5" style={{ color: '#547792' }} />
            <span className="text-sm font-semibold" style={{ color: '#213448' }}>Stock bajo en {lowStock.length} {lowStock.length === 1 ? 'producto' : 'productos'}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStock.map(p => (
              <span key={p.id} className="bg-white text-sm px-3 py-1 rounded-full border border-[#b5cdd8]" style={{ color: '#547792' }}>{p.nombre} ({p.stockDisponible} uds)</span>
            ))}
          </div>
          <Link to="/dashboard/almacen" className="text-sm underline mt-3 block" style={{ color: '#547792' }}>Gestionar almacén →</Link>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-gray-800">Mis animales</h3>
            <Link to="/dashboard/animales" className="text-sm hover:opacity-80 transition-opacity" style={{ color: '#547792' }}>Ver todos →</Link>
          </div>
          {myAnimals.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No tienes animales asignados</p>
          ) : (
            <div className="space-y-1">
              {myAnimals.slice(0, 6).map(a => <AnimalItem key={a.id} a={a} />)}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-gray-800">Otros animales</h3>
            <Link to="/dashboard/animales" className="text-sm hover:opacity-80 transition-opacity" style={{ color: '#547792' }}>Ver todos →</Link>
          </div>
          {otherAnimals.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No hay más animales registrados</p>
          ) : (
            <div className="space-y-1">
              {otherAnimals.slice(0, 6).map(a => (
                <AnimalItem key={a.id} a={a} responsable={getNombreResponsable(a.volunteerId)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
