import { useState } from 'react';
import { ClipboardList, CheckCircle, XCircle, RotateCcw, Package } from 'lucide-react';
import { useApp, useAuth } from '../../context/AppContext';
import { ProductRequest, RequestStatus } from '../../types';
import { RequestStatusBadge } from '../../components/StatusBadge';

const STATUS_OPTIONS: { value: RequestStatus | ''; label: string }[] = [
  { value: '',                       label: 'Todas las solicitudes' },
  { value: 'PENDIENTE',              label: 'Pendientes' },
  { value: 'ACEPTADA',               label: 'Aceptadas' },
  { value: 'RECHAZADA',              label: 'Rechazadas' },
  { value: 'DEVOLUCION_NOTIFICADA',  label: 'Devolución notificada' },
  { value: 'DEVUELTA',               label: 'Devueltas' },
];

export default function Requests() {
  const { requests, products, users, updateRequestStatus, notifyReturn, confirmReturn } = useApp();
  const { currentUser, canAccess } = useAuth();
  const isManager = canAccess('ENCARGADO');

  const [statusFilter, setStatusFilter] = useState<RequestStatus | ''>('');
  const [managerNoteModal, setManagerNoteModal] = useState<{ id: string; action: 'ACEPTADA' | 'RECHAZADA' } | null>(null);
  const [managerNote, setManagerNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const myRequests = isManager
    ? requests
    : requests.filter(r => r.volunteerId === currentUser?.id);

  const filtered = statusFilter
    ? myRequests.filter(r => {
        if (statusFilter === 'DEVOLUCION_NOTIFICADA') return r.returnNotified && !r.returnConfirmed;
        if (statusFilter === 'DEVUELTA')              return r.returnConfirmed;
        return r.status === statusFilter;
      })
    : myRequests;

  const sorted = [...filtered].sort((a, b) => b.requestDate.localeCompare(a.requestDate));

  const getProduct = (id: string) => products.find(p => String(p.id) === String(id));
  const getUser    = (id: string) => users.find(u => u.id === id);

  // Resuelve el nombre del producto: primero desde el campo guardado en la solicitud,
  // luego buscando en el contexto, y finalmente fallback.
  const resolveProductName = (req: ProductRequest) => {
    if (req.productName) return req.productName;
    const p = getProduct(req.productId);
    return p?.nombre ?? 'Producto eliminado';
  };

  const resolveProductUnit = (req: ProductRequest) => {
    if (req.productUnit) return req.productUnit;
    return getProduct(req.productId)?.unit ?? '';
  };

  const handleManagerAction = async () => {
    if (!managerNoteModal || !currentUser) return;
    setLoading(true);
    setError(null);
    try {
      await updateRequestStatus(managerNoteModal.id, managerNoteModal.action, currentUser.id, managerNote);
      setManagerNoteModal(null);
      setManagerNote('');
    } catch {
      setError('Error al actualizar la solicitud. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleNotifyReturn = async (id: string) => {
    setError(null);
    try { await notifyReturn(id); }
    catch { setError('Error al notificar la devolución.'); }
  };

  const handleConfirmReturn = async (id: string) => {
    setError(null);
    try { await confirmReturn(id); }
    catch { setError('Error al confirmar la devolución.'); }
  };

  const stats = {
    total:    myRequests.length,
    pending:  myRequests.filter(r => r.status === 'PENDIENTE').length,
    accepted: myRequests.filter(r => r.status === 'ACEPTADA').length,
    rejected: myRequests.filter(r => r.status === 'RECHAZADA').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900">
          {isManager ? 'Gestión de solicitudes' : 'Mis solicitudes'}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {isManager ? 'Acepta o rechaza solicitudes de voluntarios' : 'Estado de las solicitudes que has realizado al almacén'}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total',      value: stats.total,    style: { fontWeight: 700 } as React.CSSProperties,                    bg: {} as React.CSSProperties },
          { label: 'Pendientes', value: stats.pending,  style: { fontWeight: 700, color: '#854d0e' } as React.CSSProperties,  bg: { backgroundColor: '#fefce8' } as React.CSSProperties },
          { label: 'Aceptadas',  value: stats.accepted, style: { fontWeight: 700, color: '#213448' } as React.CSSProperties,  bg: { backgroundColor: '#dce8ed' } as React.CSSProperties },
          { label: 'Rechazadas', value: stats.rejected, style: { fontWeight: 700, color: '#b91c1c' } as React.CSSProperties,  bg: { backgroundColor: '#fee2e2' } as React.CSSProperties },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl p-4 text-center border border-gray-100" style={s.bg}>
            <div className="text-2xl mb-1" style={s.style}>{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-3">
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as RequestStatus | '')}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
        >
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {sorted.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 text-center py-16 text-gray-400">
            <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>No hay solicitudes</p>
          </div>
        ) : (
          sorted.map(req => {
            const productName = resolveProductName(req);
            const productUnit = resolveProductUnit(req);
            const volunteer  = getUser(req.volunteerId);
            const manager    = req.managerId ? getUser(req.managerId) : null;

            return (
              <div key={req.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <RequestStatusBadge status={req.status} />
                      {req.returnNotified && !req.returnConfirmed && (
                        <span className="text-xs px-2 py-0.5 rounded-full border" style={{ backgroundColor: '#dce8ed', color: '#213448', borderColor: '#b5cdd8' }}>
                          🔄 Devolución notificada
                        </span>
                      )}
                      {req.returnConfirmed && (
                        <span className="text-xs px-2 py-0.5 rounded-full border" style={{ backgroundColor: '#dce8ed', color: '#213448', borderColor: '#b5cdd8' }}>
                          ✅ Devuelto
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-1">
                      <Package className="w-4 h-4 text-orange-400" />
                      <span className="text-sm text-gray-800" style={{ fontWeight: 500 }}>
                        {productName} × {req.quantity}{productUnit ? ` ${productUnit}` : ''}
                      </span>
                    </div>

                    {isManager && volunteer && (
                      <p className="text-xs text-gray-400 mb-2">
                        Solicitado por: <span className="text-gray-600">{volunteer.name}</span>
                      </p>
                    )}

                    <p className="text-xs text-gray-500 mb-2">
                      📅 {new Date(req.requestDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                      {req.responseDate && ` · Respuesta: ${new Date(req.responseDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}`}
                    </p>

                    <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-600">
                      <span className="text-xs text-gray-400 block mb-0.5">Motivo:</span>
                      {req.reason}
                    </div>

                    {req.managerNote && (
                      <div className="mt-2 rounded-xl p-3 text-sm" style={req.status === 'ACEPTADA' ? { backgroundColor: '#dce8ed', color: '#213448' } : { backgroundColor: '#fee2e2', color: '#b91c1c' }}>
                        <span className="text-xs opacity-70 block mb-0.5">Respuesta del encargado{manager ? ` (${manager.name})` : ''}:</span>
                        {req.managerNote}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 min-w-fit">
                    {isManager && req.status === 'PENDIENTE' && (
                      <>
                        <button
                          onClick={() => { setManagerNoteModal({ id: req.id, action: 'ACEPTADA' }); setManagerNote(''); }}
                          className="flex items-center gap-2 text-white px-4 py-2 rounded-xl text-sm transition-colors"
                          style={{ backgroundColor: '#547792' }}
                          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#3d6180')}
                          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#547792')}
                        >
                          <CheckCircle className="w-4 h-4" />
                          Aceptar
                        </button>
                        <button
                          onClick={() => { setManagerNoteModal({ id: req.id, action: 'RECHAZADA' }); setManagerNote(''); }}
                          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          Rechazar
                        </button>
                      </>
                    )}

                    {!isManager && req.status === 'ACEPTADA' && !req.returnNotified && !req.returnConfirmed && (
                      <button
                        onClick={() => handleNotifyReturn(req.id)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-colors border"
                        style={{ borderColor: '#b5cdd8', color: '#213448' }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#dce8ed')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <RotateCcw className="w-4 h-4" />
                        Notificar devolución
                      </button>
                    )}

                    {isManager && req.returnNotified && !req.returnConfirmed && (
                      <button
                        onClick={() => handleConfirmReturn(req.id)}
                        className="flex items-center gap-2 text-white px-4 py-2 rounded-xl text-sm transition-colors"
                        style={{ backgroundColor: '#547792' }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#3d6180')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#547792')}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Confirmar devolución
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {managerNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setManagerNoteModal(null)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-md w-full shadow-xl z-10">
            <h3 className="text-gray-800 mb-2">
              {managerNoteModal.action === 'ACEPTADA' ? '✅ Aceptar solicitud' : '❌ Rechazar solicitud'}
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              Puedes añadir un comentario opcional para el voluntario.
            </p>
            <textarea
              value={managerNote}
              onChange={e => setManagerNote(e.target.value)}
              rows={3}
              placeholder="Comentario opcional..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setManagerNoteModal(null)}
                className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                onClick={handleManagerAction}
                disabled={loading}
                className="flex-1 text-white py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60"
                style={{ backgroundColor: managerNoteModal.action === 'ACEPTADA' ? '#547792' : '#ef4444' }}
                onMouseEnter={e => !loading && (e.currentTarget.style.backgroundColor = managerNoteModal.action === 'ACEPTADA' ? '#3d6180' : '#dc2626')}
                onMouseLeave={e => !loading && (e.currentTarget.style.backgroundColor = managerNoteModal.action === 'ACEPTADA' ? '#547792' : '#ef4444')}
              >
                {loading ? 'Guardando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
