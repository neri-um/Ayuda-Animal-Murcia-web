import { EnumsResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/vidanimal';

export async function getEnums(): Promise<EnumsResponse> {
  const res = await fetch(`${API_URL}/enums`);
  if (!res.ok) throw new Error('No se pudieron cargar los enums');
  return res.json();
}
