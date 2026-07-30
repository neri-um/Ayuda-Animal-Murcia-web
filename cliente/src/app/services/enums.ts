const API_URL = import.meta.env.VITE_API_URL ?? 'https://ayuda-animal-murcia-web.onrender.com';

export interface ProtocoloItem {
  tratamiento: string;
  descripcion: string;
}

export interface EnumsResponse {
  // ajusta este tipo si ya lo tenías declarado de otra forma
  sizes: string[];
  genders: string[];
  statuses: string[];
  species: string[];
}

export async function getEnums(): Promise<EnumsResponse> {
  const res = await fetch(`${API_URL}/api/enums`);
  if (!res.ok) throw new Error('No se pudieron cargar los enums');
  return res.json();
}

export function formatEnum(value: string | null | undefined): string {
  if (!value) return '';
  return value
    .toString()
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/^./, (c) => c.toUpperCase());
}
