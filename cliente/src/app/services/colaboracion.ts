
import { API_BASE as BASE, leerMensajeError } from './api';

export type TipoColaboracion = 'VOLUNTARIADO' | 'VOLUNTARIADO_UMU' | 'ACOGIDA';

export type EstadoSolicitudColaboracion = 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA';

export interface SolicitudColaboracion {
  id: number;
  tipo: TipoColaboracion;
  email: string;
  nombre: string | null;
  fechaSolicitud: string | null;
  fechaDecision: string | null;
  estado: EstadoSolicitudColaboracion;
  mensajeRespuesta: string | null;
  respuestas: Record<string, string>;
}

export async function enviarColaboracion(
  tipo: TipoColaboracion,
  email: string,
  respuestas: Record<string, string>,
): Promise<void> {
  const res = await fetch(`${BASE}/colaboracion`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tipo, email, respuestas }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error ?? 'No se pudo enviar la solicitud. Inténtalo de nuevo.');
  }
}

export async function listarSolicitudesColaboracion(token: string): Promise<SolicitudColaboracion[]> {
  const res = await fetch(`${BASE}/colaboracion`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw await leerMensajeError(res);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function decidirSolicitudColaboracion(
  token: string,
  id: number,
  estado: 'ACEPTADA' | 'RECHAZADA',
  mensaje = '',
): Promise<SolicitudColaboracion> {
  const res = await fetch(`${BASE}/colaboracion/${id}/estado`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ estado, mensaje }),
  });
  if (!res.ok) throw await leerMensajeError(res);
  return res.json();
}

export async function eliminarSolicitudColaboracion(token: string, id: number): Promise<void> {
  const res = await fetch(`${BASE}/colaboracion/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw await leerMensajeError(res);
}
