
import type { EstadoSolicitudCuestionario } from './adoption';

export type EstadoAcogida = 'PENDIENTE' | 'ACTIVA' | 'DISPONIBLE' | 'NO_DISPONIBLE';
export type EspecieAcogida = 'PERRO' | 'GATO';

export interface Acogida {
  id: number;
  nombre: string;
  apellidos?: string;
  telefono: string;
  email: string;
  direccion?: string;
  especie: EspecieAcogida | null;
  estado: EstadoAcogida;
  respuestas?: Record<string, string>;
  solicitudId?: number | null;
  solicitudEstado?: EstadoSolicitudCuestionario;
  animalId?: number | null;
  animalNombre?: string;
}

export interface AcogidaRequest {
  nombre: string;
  apellidos: string;
  telefono: string;
  email: string;
  direccion: string;
  especie?: string | null;
  respuestas: Record<string, string>;
}

export interface SolicitudAcogida {
  id: number;
  animalId: number | null;
  animalNombre?: string;
  nombreAcogida: string;
  email: string;
  telefono: string;
  dni?: string;
  fechaSolicitud: string;
  estado: EstadoSolicitudCuestionario;
  respuestas: Record<string, string>;
}

export interface SolicitudAcogidaRequest {
  animalId: number;
  nombreAcogida: string;
  email: string;
  telefono: string;
  dni: string;
  respuestas: Record<string, string>;
}
