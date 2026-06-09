const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/vidanimal';

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
    // Especies
    PERRO: 'Perro',
    GATO: 'Gato',
    CONEJO: 'Conejo',
    ROEDOR: 'Roedor',
    OTRO: 'Otro',

    // Estados animal
    EN_ADOPCION: 'En adopción',
    PRE_ADOPCION: 'Pre-adopción',
    ADOPTADO: 'Adoptado',
    EN_TRATAMIENTO: 'En tratamiento',
    FALLECIDO: 'Fallecido',

    // Sexo
    MACHO: 'Macho',
    HEMBRA: 'Hembra',

    // Tamaños
    PEQUENO: 'Pequeño',
    MEDIANO: 'Mediano',
    GRANDE: 'Grande',
    ESTANDAR: 'Estándar',

    // Categorías producto
    ALIMENTACION: 'Alimentación',
    HIGIENE: 'Higiene',
    MEDICAMENTO: 'Medicamento',
    ACCESORIO: 'Accesorio',
    TRANSPORTE: 'Transporte',

    // Estados solicitud adopción  ← venían del backend pero no estaban traducidos
    PENDIENTE: 'Pendiente',
    ACEPTADA: 'Aceptada',
    RECHAZADA: 'Rechazada',

    // Estados solicitud producto
    DEVOLUCION_NOTIFICADA: 'Devolución notificada',
    DEVUELTA: 'Devuelta',

    // Roles
    VOLUNTARIO: 'Voluntario/a',
    ENCARGADO: 'Encargado/a',
    ADMIN: 'Administrador/a',
  };

  return LABELS[val] ?? val.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

/** Carga los enums del backend con caché en memoria. */
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
