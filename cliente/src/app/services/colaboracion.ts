
import { API_BASE as BASE } from './api';

export type TipoColaboracion = 'VOLUNTARIADO' | 'VOLUNTARIADO_UMU' | 'ACOGIDA';

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
