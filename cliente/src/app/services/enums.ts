import { API_BASE as API_URL } from './api';

export interface ProtocoloItem {
  tratamiento: string;
  descripcion: string;
}

// Todos los campos que el backend garantiza en GET /vidanimal/enums
export interface EnumsResponse {
  especies: string[];
  estados: string[];
  sexos: string[];
  tamanyes: string[];
  categoriasProducto: string[];
  estadosSolicitudAdopcion: string[];
  estadosSolicitudProducto: string[];
  roles: string[];
}

let enumsCache: EnumsResponse | null = null;
const protocoloCache: Record<string, ProtocoloItem[]> = {};

/**
 * Traduce un valor enum del backend a su etiqueta en español.
 * Los VALORES vienen del backend; las ETIQUETAS son responsabilidad del frontend.
 * Si no hay traducción, formatea automáticamente (quita guiones, capitaliza).
 */
export function formatEnum(val: string): string {
  if (!val) return '';

  const LABELS: Record<string, string> = {
    PERRO: 'Perro',
    GATO: 'Gato',
    CONEJO: 'Conejo',
    ROEDOR: 'Roedor',
    OTRO: 'Otro',

    EN_ADOPCION: 'En adopción',
    PRE_ADOPCION: 'Pre-adopción',
    ADOPTADO: 'Adoptado',
    EN_TRATAMIENTO: 'En tratamiento',
    FALLECIDO: 'Fallecido',

    MACHO: 'Macho',
    HEMBRA: 'Hembra',

    PEQUENO: 'Pequeño',
    MEDIANO: 'Mediano',
    GRANDE: 'Grande',
    ESTANDAR: 'Estándar',

    TRANQUILO: 'Tranquilo/a',
    CARINOSO: 'Cariñoso/a',
    JUGUETON: 'Juguetón/a',
    SOCIABLE: 'Sociable',
    TIMIDO: 'Tímido/a',
    INDEPENDIENTE: 'Independiente',
    ACTIVO: 'Activo/a',
    MIEDOSO: 'Miedoso/a',

    ALIMENTACION: 'Alimentación',
    HIGIENE: 'Higiene',
    MEDICAMENTO: 'Medicamento',
    ACCESORIO: 'Accesorio',
    TRANSPORTE: 'Transporte',

    // Estados solicitud adopción  ← venían del backend pero no estaban traducidos
    PENDIENTE: 'Pendiente',
    ACEPTADA: 'Aceptada',
    RECHAZADA: 'Rechazada',

    DEVOLUCION_NOTIFICADA: 'Devolución notificada',
    DEVUELTA: 'Devuelta',

    VOLUNTARIO: 'Voluntario/a',
    ENCARGADO: 'Encargado/a',
    ADMIN: 'Administrador/a',
  };

  return LABELS[val] ?? val.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

export async function getEnums(): Promise<EnumsResponse> {
  if (enumsCache) return enumsCache;
  const res = await fetch(`${API_URL}/enums`);
  if (!res.ok) throw new Error('Error cargando enums del backend');
  enumsCache = await res.json();
  return enumsCache!;
}

export async function invalidateEnumsCache(): Promise<void> {
  enumsCache = null;
}

export async function getProtocoloEspecie(
  especie: string,
  fechaNacimiento?: string
): Promise<ProtocoloItem[]> {
  const key = `${especie.toUpperCase()}_${fechaNacimiento ?? 'sin-fecha'}`;
  if (protocoloCache[key]) return protocoloCache[key];

  const params = new URLSearchParams();
  if (fechaNacimiento) params.set('fechaNacimiento', fechaNacimiento);

  const res = await fetch(
    `${API_URL}/enums/protocolo/${especie.toUpperCase()}${
      params.toString() ? `?${params.toString()}` : ''
    }`
  );

  if (!res.ok) return [];
  const data = await res.json();
  protocoloCache[key] = data.base ?? [];
  return protocoloCache[key];
}