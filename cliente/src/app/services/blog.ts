import type { EntradaBlog, EntradaBlogInput } from '../types';

import { API_BASE as API_URL, leerMensajeError } from './api';

export async function getEntradasGenerales(etiqueta?: string): Promise<EntradaBlog[]> {
  const params = etiqueta ? `?etiqueta=${encodeURIComponent(etiqueta)}` : '';
  const res = await fetch(`${API_URL}/blog${params}`);
  if (!res.ok) throw await leerMensajeError(res);
  return res.json();
}

export async function getEntradaBlog(id: number | string): Promise<EntradaBlog> {
  const res = await fetch(`${API_URL}/blog/${id}`);
  if (!res.ok) throw await leerMensajeError(res);
  return res.json();
}

export async function getEntradasDeAnimal(animalId: string | number): Promise<EntradaBlog[]> {
  const res = await fetch(`${API_URL}/animales/${animalId}/blog`);
  if (!res.ok) return [];
  return res.json();
}

export async function crearEntradaBlog(datos: EntradaBlogInput, token: string | null): Promise<EntradaBlog> {
  const res = await fetch(`${API_URL}/blog`, {
    method: 'POST',
    headers: jsonHeaders(token),
    body: JSON.stringify(datos),
  });
  if (!res.ok) throw await leerMensajeError(res);
  return res.json();
}

export async function editarEntradaBlog(id: number, datos: EntradaBlogInput, token: string | null): Promise<EntradaBlog> {
  const res = await fetch(`${API_URL}/blog/${id}`, {
    method: 'PUT',
    headers: jsonHeaders(token),
    body: JSON.stringify(datos),
  });
  if (!res.ok) throw await leerMensajeError(res);
  return res.json();
}

export async function eliminarEntradaBlog(id: number, token: string | null): Promise<void> {
  const res = await fetch(`${API_URL}/blog/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  if (!res.ok) throw await leerMensajeError(res);
}

function authHeaders(token: string | null): HeadersInit {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function jsonHeaders(token: string | null): HeadersInit {
  return { 'Content-Type': 'application/json', ...authHeaders(token) };
}