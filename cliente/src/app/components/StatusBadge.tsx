import React from 'react';
import { AnimalStatus, RequestStatus } from '../data/mockData';

const animalStatusConfig: Record<string, { label: string; style: React.CSSProperties }> = {
  EN_ADOPCION:    { label: 'En adopción',    style: { backgroundColor: '#dce8ed', color: '#213448', borderColor: '#b5cdd8' } },
  PRE_ADOPCION:   { label: 'Pre-adopción',   style: { backgroundColor: '#fef9c3', color: '#854d0e', borderColor: '#fde68a' } },
  ADOPTADO:       { label: 'Adoptado',       style: { backgroundColor: '#e8e2d6', color: '#213448', borderColor: '#c8bfb0' } },
  EN_TRATAMIENTO: { label: 'En tratamiento', style: { backgroundColor: '#fee2e2', color: '#991b1b', borderColor: '#fca5a5' } },
  FALLECIDO:      { label: 'Fallecido',      style: { backgroundColor: '#f3f4f6', color: '#6b7280', borderColor: '#e5e7eb' } },
};

const requestStatusConfig: Record<RequestStatus, { label: string; style: React.CSSProperties }> = {
  PENDIENTE:            { label: 'Pendiente',            style: { backgroundColor: '#fef9c3', color: '#854d0e', borderColor: '#fde68a' } },
  ACEPTADA:             { label: 'Aceptada',             style: { backgroundColor: '#dce8ed', color: '#213448', borderColor: '#b5cdd8' } },
  RECHAZADA:            { label: 'Rechazada',            style: { backgroundColor: '#fee2e2', color: '#991b1b', borderColor: '#fca5a5' } },
  DEVOLUCION_NOTIFICADA:{ label: 'Devolución notificada',style: { backgroundColor: '#e0f2fe', color: '#075985', borderColor: '#bae6fd' } },
  DEVUELTA:             { label: 'Devuelta',             style: { backgroundColor: '#dcfce7', color: '#166534', borderColor: '#bbf7d0' } },
};

export function AnimalStatusBadge({ status }: { status: string }) {
  const cfg = animalStatusConfig[status] ?? {
    label: status,
    style: { backgroundColor: '#f3f4f6', color: '#6b7280', borderColor: '#e5e7eb' },
  };
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border" style={cfg.style}>
      {cfg.label}
    </span>
  );
}

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  const cfg = requestStatusConfig[status];
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border" style={cfg.style}>
      {cfg.label}
    </span>
  );
}