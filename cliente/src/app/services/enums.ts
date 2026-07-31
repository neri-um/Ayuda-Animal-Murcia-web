const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/vidanimal';

export type EstadoSolicitudAdopcion = 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA';

export type EnumsResponse = {
  estadosSolicitudAdopcion: EstadoSolicitudAdopcion[];
};

/**
 * Normaliza y “bonitiza” un enum para mostrarlo en la interfaz.
 * Ejemplos:
 *  - "PENDIENTE" -> "Pendiente"
 *  - "RECHAZADA" -> "Rechazada"
 *  - "PERRO_ADULTO" -> "Perro adulto"
 */
export function formatEnum(value: string): string {
  if (!value) return '';
  return value
    .toLowerCase()
    .split('_')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

/**
 * Llama al backend para obtener los enums que usa el dashboard.
 * Ajusta la URL si tu API expone otro endpoint.
 */
export async function getEnums(): Promise<EnumsResponse> {
  const res = await fetch(`${BASE}/enums`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('No se pudieron cargar los enums');
  }

  const data = await res.json();

  // Aseguramos una forma mínima por si el backend devuelve algo distinto
  return {
    estadosSolicitudAdopcion:
      (data.estadosSolicitudAdopcion as EstadoSolicitudAdopcion[]) ??
      ['PENDIENTE', 'ACEPTADA', 'RECHAZADA'],

  };
}