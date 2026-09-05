
import { API_BASE as BASE, leerMensajeError } from './api';
import type { Acogida, AcogidaRequest, SolicitudAcogida, SolicitudAcogidaRequest } from '../types/acogida';
import type { EstadoAcogida } from '../types/acogida';

async function authHeaders(token: string): Promise<Record<string, string>> {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

export async function crearAcogida(datos: AcogidaRequest): Promise<Acogida> {
  const res = await fetch(`${BASE}/acogidas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  if (!res.ok) throw await leerMensajeError(res);
  return res.json();
}

export async function listarAcogidas(token: string): Promise<Acogida[]> {
  const res = await fetch(`${BASE}/acogidas`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw await leerMensajeError(res);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function cambiarEstadoAcogida(token: string, id: number, estado: EstadoAcogida): Promise<Acogida> {
  const res = await fetch(`${BASE}/acogidas/${id}/estado`, {
    method: 'PATCH',
    headers: await authHeaders(token),
    body: JSON.stringify({ estado }),
  });
  if (!res.ok) throw await leerMensajeError(res);
  return res.json();
}

export async function eliminarAcogida(token: string, id: number): Promise<void> {
  const res = await fetch(`${BASE}/acogidas/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw await leerMensajeError(res);
}

export async function listarSolicitudesAcogida(token: string): Promise<SolicitudAcogida[]> {
  const res = await fetch(`${BASE}/acogidas/solicitudes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw await leerMensajeError(res);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function cambiarEstadoSolicitud(token: string, id: number, estado: string): Promise<SolicitudAcogida> {
  const res = await fetch(`${BASE}/acogidas/solicitudes/${id}/estado`, {
    method: 'PATCH',
    headers: await authHeaders(token),
    body: JSON.stringify({ estado }),
  });
  if (!res.ok) throw await leerMensajeError(res);
  return res.json();
}

export async function eliminarSolicitudAcogida(token: string, id: number): Promise<void> {
  const res = await fetch(`${BASE}/acogidas/solicitudes/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw await leerMensajeError(res);
}

export async function crearSolicitudAcogida(datos: SolicitudAcogidaRequest): Promise<SolicitudAcogida> {
  const res = await fetch(`${BASE}/acogidas/solicitudes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  if (!res.ok) throw await leerMensajeError(res);
  return res.json();
}
