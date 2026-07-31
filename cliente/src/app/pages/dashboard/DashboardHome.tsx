import { Link } from 'react-router';
import { PawPrint, ClipboardList, AlertTriangle } from 'lucide-react';
import { useApp, useAuth } from '../../context/AppContext';
import { AnimalStatusBadge } from '../../components/StatusBadge';

function StatCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode; label: string; value: number | string; sub?: string; color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '1.6rem', fontWeight: 700 }} className="text-gray-800 leading-tight">{value}</div>
        <div className="text-sm text-gray-500">{label}</div>
        {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

function AnimalItem({ a, responsable }: {
  a: { id: number; name: string; breed: string; status: string; imageUrl?: string };
  responsable?: string;
}) {
  return (
    <Link
      to={`/dashboard/animals/${a.id}`}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
    >
      {a.imageUrl
        ? <img src={a.imageUrl} alt={a.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" loading="lazy" width={40} height={40} />
        : <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center text-gray-400">🐾</div>
      }
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800 font-medium truncate">{a.name}</p>
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-xs text-gray-400 truncate">{a.breed}</p>
          {responsable && (
            <span className="text-xs" style={{ color: '#547792' }}>· 👤 {responsable}</span>
          )}
        </div>
      </div>
      <AnimalStatusBadge status={a.status} />
    </Link>
  );
}

export default function DashboardHome() {
  const { animals, requests, products, users } = useApp();
  const { currentUser, canAccess } = useAuth();

  const pendingRequests  = requests.filter(r => r.status === 'PENDIENTE').length;
  const availableAnimals = animals.filter(a => a.status === 'EN_ADOPCION').length;
  const myAnimals        = animals.filter(a => String(a.volunteerId) === String(currentUser?.id));
  const otherAnimals     = animals.filter(a => String(a.volunteerId) !== String(currentUser?.id));
  const lowStock         = products.filter(p => p.quantity <= p.minStock);

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
        <StatCard icon={<PawPrint className="w-6 h-6" style={{ color: '#547792' }} />} label="Animales en adopción" value={availableAnimals} sub={`de ${animals.length} en total`} color="bg-[#dce8ed]" />
        <StatCard icon={<ClipboardList className="w-6 h-6" style={{ color: '#547792' }} />} label="Solicitudes pendientes" value={pendingRequests} color="bg-[#dce8ed]" />
        <StatCard icon={<PawPrint className="w-6 h-6" style={{ color: '#547792' }} />} label="Mis animales" value={myAnimals.length} sub="a tu cargo" color="bg-[#dce8ed]" />
      </div>

      {canAccess('ENCARGADO') && lowStock.length > 0 && (
        <div className="bg-[#dce8ed] border border-[#b5cdd8] rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5" style={{ color: '#547792' }} />
            <span className="text-sm font-semibold" style={{ color: '#213448' }}>Stock bajo en {lowStock.length} {lowStock.length === 1 ? 'producto' : 'productos'}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStock.map(p => (
              <span key={p.id} className="bg-white text-sm px-3 py-1 rounded-full border border-[#b5cdd8]" style={{ color: '#547792' }}>{p.name} ({p.quantity} {p.unit})</span>
            ))}
          </div>
          <Link to="/dashboard/warehouse" className="text-sm underline mt-3 block" style={{ color: '#547792' }}>Gestionar almacén →</Link>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Mis animales */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-gray-800">Mis animales</h3>
            <Link to="/dashboard/animals" className="text-sm hover:opacity-80 transition-opacity" style={{ color: '#547792' }}>Ver todos →</Link>
          </div>
          {myAnimals.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No tienes animales asignados</p>
          ) : (
            <div className="space-y-1">
              {myAnimals.slice(0, 6).map(a => <AnimalItem key={a.id} a={a} />)}
            </div>
          )}
        </div>

        {/* Otros animales */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-gray-800">Otros animales</h3>
            <Link to="/dashboard/animals" className="text-sm hover:opacity-80 transition-opacity" style={{ color: '#547792' }}>Ver todos →</Link>
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
