export const API_BASE = (import.meta.env.VITE_API_URL || 'https://ayuda-animal-murcia-web.onrender.com/vidanimal').replace(/\/+$/, '');

export async function leerMensajeError(res: Response): Promise<Error> {
  try {
    const data = await res.json();
    if (data && typeof data.mensaje === 'string') {
      return new Error(data.mensaje);
    }
  } catch { /* el servidor no devolvió JSON */ }
  const porEstado: Record<number, string> = {
    400: 'Los datos enviados no son válidos. Revisa el formulario.',
    401: 'Tu sesión ha caducado. Vuelve a iniciar sesión.',
    403: 'No tienes permisos para realizar esta acción.',
    404: 'El elemento solicitado no se ha encontrado.',
    409: 'Ya existe un registro con esos datos.',
    500: 'Error interno del servidor. Inténtalo de nuevo más tarde.',
  };
  return new Error(porEstado[res.status] ?? `Error del servidor (${res.status})`);
}
