import React, { useMemo, useState, useEffect } from 'react';
import {
  CheckCircle2, Circle, Calendar, FileText, Shield, Syringe,
  Stethoscope, ChevronDown, ChevronUp, Plus, PawPrint, FlaskConical,
  AlertTriangle
} from 'lucide-react';
import { getProtocoloEspecie, type ProtocoloItem } from '../services/enums';

export type TratamientoItem = {
  id?: string | number;
  tratamiento: string;
  descripcion: string;
  fecha: string;
  veterinario?: string;
  completada?: boolean;
};

type Props = {
  especie: string;
  birthDate?: string;
  protocolo: TratamientoItem[];
  onAdd?: () => void;
  onCompletar?: (citaId: string) => Promise<void>;
};

function normalizeEspecie(especie: string): string {
  return (especie ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .trim();
}

function formatTratamientoName(value: string): string {
  return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function iconForTratamiento(value: string) {
  if (value.includes('MICROCHIP')) return <Shield className="w-4 h-4" />;
  if (value.includes('VACUN') || value.includes('RABIA') || value.includes('POLIVALENTE') || value.includes('TRIVALENTE'))
    return <Syringe className="w-4 h-4" />;
  if (value.includes('REVISION') || value.includes('TEST')) return <Stethoscope className="w-4 h-4" />;
  if (value.includes('COPRO')) return <FlaskConical className="w-4 h-4" />;
  return <PawPrint className="w-4 h-4" />;
}

export default function ProtocoloVeterinarioCard({ especie, birthDate, protocolo, onAdd, onCompletar }: Props) {
  const [openHistory, setOpenHistory] = useState(false);
  const [completing, setCompleting] = useState<string | null>(null);
  const [completingError, setCompletingError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const [protocoloBase, setProtocoloBase] = useState<string[]>([]);
  const [opcionales, setOpcionales] = useState<ProtocoloItem[]>([]);

  const especieKey = normalizeEspecie(especie);
  const especieLabel = (especie ?? 'animal').toLowerCase();

  useEffect(() => {
    if (!especieKey) return;
    getProtocoloEspecie(especieKey, birthDate)
      .then(items => {
        setProtocoloBase(items.map(i => i.tratamiento));
        setOpcionales([]);
      })
      .catch(() => {
        setProtocoloBase([]);
        setOpcionales([]);
      });
  }, [especieKey, birthDate]);

  const storageKey = `opcionales_${especieKey}`;
  const [checkedOpcionales, setCheckedOpcionales] = useState<Set<string>>(() => {
    try {
      const raw = sessionStorage.getItem(storageKey);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify([...checkedOpcionales]));
    } catch { }
  }, [checkedOpcionales, storageKey]);

  const pendientes = useMemo(() => protocolo.filter(c => !c.completada), [protocolo]);
  const realizadas = useMemo(() => protocolo.filter(c => c.completada), [protocolo]);

  const tratamientosEnCitas = useMemo(() => new Set(protocolo.map(c => c.tratamiento)), [protocolo]);
  const faltantes = protocoloBase.filter(t => !tratamientosEnCitas.has(t));

  const total = protocolo.length;
  const doneCount = realizadas.length;
  const progress = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  const handleCompletar = async (item: TratamientoItem) => {
    if (!onCompletar || item.id == null) return;
    const idStr = String(item.id);
    if (completing === idStr) return;
    setCompleting(idStr);
    setCompletingError(null);
    try {
      await onCompletar(idStr);
      setSuccessToast(formatTratamientoName(item.tratamiento));
      setTimeout(() => setSuccessToast(null), 3000);
    } catch {
      setCompletingError('No se pudo marcar como realizada. Inténtalo de nuevo.');
      setTimeout(() => setCompletingError(null), 4000);
    } finally {
      setCompleting(null);
    }
  };

  const toggleOpcional = (tratamiento: string) => {
    setCheckedOpcionales(prev => {
      const next = new Set(prev);
      next.has(tratamiento) ? next.delete(tratamiento) : next.add(tratamiento);
      return next;
    });
  };

  return (
    <>
      {successToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl" style={{ minWidth: '18rem' }}>
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="text-sm"><strong>{successToast}</strong> marcado como realizado</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: (opcionales.length > 0 && onAdd) ? '1fr 1fr' : '1fr', gap: '1.25rem', alignItems: 'start' }}>
        <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-2" style={{ backgroundColor: '#dce8ed', color: '#213448' }}>
                <PawPrint className="w-4 h-4" />
                Protocolo veterinario
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Seguimiento clínico</h3>
              <p className="text-sm text-gray-600 mt-1">Historial de tratamientos para {especieLabel}</p>
            </div>
            {onAdd && (
              <button
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium ml-auto flex-shrink-0"
                style={{ backgroundColor: '#547792' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#3d6180')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#547792')}
                onClick={onAdd}
              >
                <Plus className="w-4 h-4" />
                Nuevo tratamiento
              </button>
            )}
          </div>

          {completingError && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{completingError}</div>
          )}

          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Protocolo completado</span>
              <span className="text-lg font-bold text-[#547792]">{doneCount} / {total}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-[#547792] h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {faltantes.length > 0 && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-orange-50 border border-orange-200">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-orange-700 mb-1">
                <AlertTriangle className="w-4 h-4" />
                Faltan en el protocolo base
              </p>
              <p className="text-xs text-orange-600">{faltantes.map(t => formatTratamientoName(t)).join(', ')}</p>
            </div>
          )}

          {pendientes.length > 0 && (
            <div className="space-y-3 mb-6">
              <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                <Circle className="w-4 h-4 text-amber-500" />
                Pendientes del protocolo
              </h4>
              {pendientes.map((item) => (
                <div key={item.id ?? item.tratamiento} className="bg-amber-50 rounded-xl p-4 border border-amber-200 hover:shadow-md transition-all">
                  <div className="flex items-start gap-3">
                    {onCompletar ? (
                      <button
                        className="flex-shrink-0 mt-0.5 disabled:opacity-50 group"
                        title="Marcar como realizado"
                        disabled={completing === String(item.id)}
                        onClick={() => handleCompletar(item)}
                      >
                        {completing === String(item.id)
                          ? <Circle className="w-6 h-6 text-gray-300 animate-spin" />
                          : <Circle className="w-6 h-6 text-amber-400 group-hover:text-emerald-500 transition-colors cursor-pointer" />}
                      </button>
                    ) : (
                      <div className="flex-shrink-0 mt-0.5">
                        <Circle className="w-6 h-6 text-amber-300" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {iconForTratamiento(item.tratamiento)}
                        <h5 className="text-sm font-semibold text-gray-900">
                          {formatTratamientoName(item.tratamiento)}
                          {item.descripcion.includes('dosis') && (
                            <span className="ml-2 text-xs font-normal text-gray-400">
                              {item.descripcion.includes('dosis 1') ? '· dosis 1' : '· dosis 2'}
                            </span>
                          )}
                        </h5>
                      </div>
                      <p className="text-sm text-gray-600">{item.descripcion}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-3 mb-6">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Tratamientos realizados
            </h4>
            {realizadas.length === 0 ? (
              <div className="text-center py-8 rounded-xl border-2 border-dashed border-gray-200">
                <PawPrint className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 text-sm">No hay tratamientos registrados aún</p>
              </div>
            ) : (
              realizadas.map((item) => (
                <div key={item.id ?? item.tratamiento} className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 hover:shadow-md transition-all">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5"><CheckCircle2 className="w-6 h-6 text-emerald-500" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {iconForTratamiento(item.tratamiento)}
                        <h5 className="text-sm font-semibold text-gray-900">{formatTratamientoName(item.tratamiento)}</h5>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{item.descripcion}</p>
                      {item.fecha && (
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Calendar className="w-3 h-3" />
                          {new Date(item.fecha + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      )}
                      {item.veterinario && (
                        <span className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                          <FileText className="w-3 h-3" />{item.veterinario}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-gray-100 pt-6">
            <button
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
              onClick={() => setOpenHistory(!openHistory)}
            >
              <div>
                <h4 className="font-semibold text-gray-900">Ver todas las actuaciones</h4>
                <p className="text-sm text-gray-500">{protocolo.length} registros</p>
              </div>
              {openHistory ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {openHistory && (
              <div className="mt-4 space-y-3">
                {protocolo.map((item, index) => (
                  <div key={`${item.id}-${index}`} className={`p-4 rounded-xl ${
                    !item.completada ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50 border border-gray-100'
                  }`}>
                    <div className="flex gap-3 text-sm">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        !item.completada ? 'bg-amber-400' : 'bg-[#547792]'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {iconForTratamiento(item.tratamiento)}
                          <span className="font-medium">{formatTratamientoName(item.tratamiento)}</span>
                          {!item.completada && (
                            <span className="text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">Pendiente</span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-1">{item.descripcion}</p>
                        {item.completada && item.fecha && (
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Calendar className="w-3 h-3" />
                            {new Date(item.fecha + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </span>
                        )}
                        {item.veterinario && <span className="text-xs text-gray-400">{item.veterinario}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {opcionales.length > 0 && onAdd && (
          <aside>
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Tratamientos opcionales</h4>
              <p className="text-xs text-gray-500 mb-3">Márcalos y añádelos con \"Nuevo tratamiento\".</p>
              <div className="space-y-2">
                {opcionales.map((op) => {
                  const checked = checkedOpcionales.has(op.tratamiento);
                  return (
                    <label key={op.tratamiento} className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      checked ? 'bg-[#dce8ed] border-[#547792]' : 'bg-gray-50 border-gray-100 hover:bg-blue-50 hover:border-blue-100'
                    }`}>
                      <input
                        type="checkbox"
                        className="mt-0.5 w-4 h-4 flex-shrink-0 cursor-pointer"
                        style={{ accentColor: '#547792' }}
                        checked={checked}
                        onChange={() => toggleOpcional(op.tratamiento)}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          {iconForTratamiento(op.tratamiento)}
                          <span className="text-xs font-medium text-gray-800">{formatTratamientoName(op.tratamiento)}</span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">{op.descripcion}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
              {checkedOpcionales.size > 0 && (
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs font-medium" style={{ color: '#547792' }}>
                    {checkedOpcionales.size} seleccionado{checkedOpcionales.size > 1 ? 's' : ''}
                  </p>
                  <button className="text-xs text-gray-400 hover:text-gray-600 underline" onClick={() => setCheckedOpcionales(new Set())}>Limpiar</button>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </>
  );
}
