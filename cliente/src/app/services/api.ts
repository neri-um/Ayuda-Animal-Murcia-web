export const API_BASE = (import.meta.env.VITE_API_URL || 'https://ayuda-animal-murcia-web.onrender.com/vidanimal').replace(/\/+$/, '');

export async function leerMensajeError(res: Response): Promise<Error> {
  try {
    const data = await res.json();
    if (data && typeof data.mensaje === 'string') {
      return new Error(data.mensaje);
    }
  } catch { /* el servidor no devolvió JSON */ }
  return new Error(`Error del servidor (${res.status})`);
}
