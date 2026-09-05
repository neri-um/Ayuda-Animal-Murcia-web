
export type TipoPregunta = 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'number' | 'email' | 'tel';

export interface OpcionPregunta {
  value: string;
  label: string;
}

export interface PreguntaFormulario {
  id: string;
  tipo: TipoPregunta;
  label: string;
  required: boolean;
  placeholder?: string;
  opciones?: OpcionPregunta[];
}

export interface FormularioAdopcion {
  id: number;
  nombre: string;
  especie: string | null; // null = genérico para cualquier especie
  preguntas: PreguntaFormulario[];
}

export interface FormularioAdopcionAdmin {
  id?: number;
  nombre: string;
  especie: string | null;
  cachorro: boolean | null;
  preguntasRaw: string; // JSON crudo como string
}

export type EstadoSolicitudCuestionario = 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA';

export interface SolicitudAdopcion {
  id: number;
  animalId: number;
  animalNombre?: string;
  nombreAdoptante: string;
  email: string;
  telefono: string;
  dni: string;
  fechaSolicitud: string;
  estado: EstadoSolicitudCuestionario;
  respuestas: Record<string, string>; // { preguntaId: valorRespuesta }
}

export interface SolicitudAdopcionRequest {
  animalId: number;
  nombreAdoptante: string;
  email: string;
  telefono: string;
  dni: string;
  respuestas: Record<string, string>;
}
