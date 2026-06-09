import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Package, AlertTriangle } from 'lucide-react';
import { useApp, useAuth } from '../../context/AppContext';
import { formatEnum } from '../../hooks/useEnums';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, requests, users } = useApp();
  const { canAccess } = useAuth();
  const isManager = canAccess('ENCARGADO');

  const product = products.find(p => String(p.id) === id);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <Package className="w-12 h-12 mb-4 opacity-40" />
        <p className="text-sm">Producto no encontrado</p>
        <button
          onClick={() => navigate('/dashboard/warehouse')}
          className="mt-4 text-sm underline"
          style={{ color: '#547792' }}
        >
          Volver al almacén
        </button>
      </div>
    );
  }

  const assigned  = product.stockTotal - product.stockDisponible;
  const available = product.stockDisponible;
  const isLow     = product.stockDisponible === 0;

  const activeRequests = requests.filter(
    r => String(r.productId) === String(product.id) && r.status === 'ACEPTADA' && !r.returnConfirmed
  );
  const allRequests = requests.filter(r => String(r.productId) === String(product.id));
  const getUser = (uid: string) => users.find(u => String(u.id) === String(uid));

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate('/dashboard/warehouse')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al almacén
      </button>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-gray-900 text-xl" style={{ fontWeight: 700 }}>{product.nombre}</h1>
              {isLow && (
                <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <AlertTriangle className="w-3 h-3" /> Stock bajo
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400">{formatEnum(product.categoria)}</p>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#dce8ed' }}>
            <Package className="w-6 h-6" style={{ color: '#547792' }} />
          </div>
        </div>

        {product.descripcion && (
          <p className="mt-4 text-sm text-gray-600 leading-relaxed">{product.descripcion}</p>
        )}

        {/* Stock stats */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <div className="text-2xl mb-1" style={{ fontWeight: 700, color: '#213448' }}>{product.stockTotal}</div>
            <div className="text-xs text-gray-400">Stock total</div>
          </div>
          <div className="rounded-xl p-4 text-center" style={{ backgroundColor: assigned > 0 ? '#fefce8' : '#f9fafb' }}>
            <div className="text-2xl mb-1" style={{ fontWeight: 700, color: assigned > 0 ? '#854d0e' : '#6b7280' }}>{assigned}</div>
            <div className="text-xs text-gray-400">Asignado</div>
          </div>
          <div className="rounded-xl p-4 text-center" style={{ backgroundColor: available <= 0 ? '#fee2e2' : '#f0fdf4' }}>
            <div className="text-2xl mb-1" style={{ fontWeight: 700, color: available <= 0 ? '#b91c1c' : '#166534' }}>{available}</div>
            <div className="text-xs text-gray-400">Disponible</div>
          </div>
        </div>
      </div>

      {/* Assigned volunteers (manager only) */}
      {isManager && activeRequests.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-sm mb-4" style={{ fontWeight: 600, color: '#213448' }}>
            Voluntarios con este producto asignado
          </h2>
          <div className="space-y-3">
            {activeRequests.map(r => {
              const volunteer = getUser(r.volunteerId);
              return (
                <div key={r.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm text-gray-800" style={{ fontWeight: 500 }}>
                      {volunteer?.name ?? r.volunteerId}
                    </p>
                    <p className="text-xs text-gray-400">
                      Solicitado el {new Date(r.requestDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <span className="text-sm px-3 py-1 rounded-full" style={{ backgroundColor: '#dce8ed', color: '#213448', fontWeight: 600 }}>
                    ×{r.quantity}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Request history (manager only) */}
      {isManager && allRequests.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-sm mb-4" style={{ fontWeight: 600, color: '#213448' }}>
            Historial de solicitudes
          </h2>
          <div className="space-y-3">
            {[...allRequests].sort((a, b) => b.requestDate.localeCompare(a.requestDate)).map(r => {
              const volunteer = getUser(r.volunteerId);
              const statusColors: Record<string, { bg: string; text: string }> = {
                PENDIENTE:             { bg: '#fefce8', text: '#854d0e' },
                ACEPTADA:              { bg: '#f0fdf4', text: '#166534' },
                RECHAZADA:             { bg: '#fee2e2', text: '#b91c1c' },
                DEVOLUCION_NOTIFICADA: { bg: '#dce8ed', text: '#213448' },
                DEVUELTA:              { bg: '#f9fafb', text: '#6b7280' },
              };
              const sc = statusColors[r.status] ?? { bg: '#f9fafb', text: '#6b7280' };
              return (
                <div key={r.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm text-gray-800" style={{ fontWeight: 500 }}>
                      {volunteer?.name ?? r.volunteerId} · ×{r.quantity}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(r.requestDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: sc.bg, color: sc.text, fontWeight: 600 }}>
                    {r.status.replace('_', ' ')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
