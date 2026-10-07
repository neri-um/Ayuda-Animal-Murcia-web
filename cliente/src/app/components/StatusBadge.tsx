import React from 'react';
import { AnimalStatus, RequestStatus } from '../types';

// Paleta corporativa Ayuda Animal Murcia
// Acento: #f7e3b0 (dorado) sobre #2e2e2e
// Neutros: #f7f7f7, #ffffff, #727272, #d9d9d9

const animalStatusConfig: Record<string, { label: string; style: React.CSSProperties }> = {
  EN_ADOPCION:    { label: 'En adopción',    style: { backgroundColor: '#f7e3b0', color: '#2e2e2e', borderColor: '#e8d090' } },
  PRE_ADOPCION:   { label: 'Pre-adopción',   style: { backgroundColor: '#f0e8d0', color: '#2e2e2e', borderColor: '#d9d0b8' } },
  ADOPTADO:       { label: 'Adoptado',       style: { backgroundColor: '#e8e2d6', color: '#2e2e2e', borderColor: '#d9d9d9' } },
  EN_TRATAMIENTO: { label: 'En tratamiento', style: { backgroundColor: '#fee2e2', color: '#991b1b', borderColor: '#fca5a5' } },
  FALLECIDO:      { label: 'Fallecido',      style: { backgroundColor: '#f3f4f6', color: '#6b7280', borderColor: '#e5e7eb' } },
};

// Paleta de estados: pendiente #D4AF37 · aceptado #6A994E · rechazado #9C2B1B ·
// no disponible #9CA3AF
const requestStatusConfig: Record<RequestStatus, { label: string; style: React.CSSProperties }> = {
  PENDIENTE:             { label: 'Pendiente',             style: { backgroundColor: '#D4AF37', color: '#2e2e2e', borderColor: '#b89a2e' } },
  ACEPTADA:              { label: 'Aceptada',              style: { backgroundColor: '#6A994E', color: '#ffffff', borderColor: '#5c8a43' } },
  RECHAZADA:             { label: 'Rechazada',             style: { backgroundColor: '#9C2B1B', color: '#ffffff', borderColor: '#7d2317' } },
  DEVOLUCION_NOTIFICADA: { label: 'Devolución notificada',style: { backgroundColor: '#f7f7f7', color: '#2e2e2e', borderColor: '#d9d9d9' } },
  DEVUELTA:              { label: 'Devuelta',             style: { backgroundColor: '#e8e2d6', color: '#2e2e2e', borderColor: '#d9d9d9' } },
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
