import type { TratamientoItem } from './components/ProtocoloVeterinarioCard';

export type Species      = 'PERRO' | 'GATO' | 'CONEJO' | 'OTRO';
export type AnimalSize   = 'ESTANDAR' | 'PEQUENO' | 'MEDIANO' | 'GRANDE';
export type AnimalGender = 'MACHO' | 'HEMBRA';
export type AnimalStatus = 'EN_ADOPCION' | 'PRE_ADOPCION' | 'ADOPTADO' | 'EN_TRATAMIENTO' | 'FALLECIDO';
export type Caracter     =
  | 'TRANQUILO' | 'CARINOSO' | 'JUGUETON' | 'SOCIABLE'
  | 'TIMIDO' | 'INDEPENDIENTE' | 'ACTIVO' | 'MIEDOSO';
export type UserRole     = 'VOLUNTARIO' | 'ENCARGADO' | 'ADMIN';
export type Tratamiento  =
  | 'DESPARASITACION_INTERNA' | 'DESPARASITACION_EXTERNA'
  | 'TRIVALENTE_FELINA' | 'POLIVALENTE' | 'RABIA'
  | 'TEST_FELV_FIV' | 'TEST_LEISHMANIA'
  | 'CASTRACION' | 'REVISION' | 'MICROCHIP'
  | 'VACUNACION_RABIA' | 'COPROLOGICO';
export type CategoriaProducto =
  | 'ALIMENTACION' | 'HIGIENE' | 'MEDICAMENTO'
  | 'ACCESORIO' | 'TRANSPORTE' | 'OTRO';
export type RequestStatus =
  | 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA'
  | 'DEVOLUCION_NOTIFICADA' | 'DEVUELTA';

export interface Animal {
  id: string;
  name: string;
  species: Species;
  breed: string;
  age?: number;
  birthDate: string;
  size: AnimalSize;
  gender: AnimalGender;
  status: AnimalStatus;
  description: string;
  imageUrl: string;
  gallery?: string[];
  needsMedication: boolean;
  needsSpecialCare: boolean;
  positivoLeucemia: boolean;
  positivoInmunodeficiencia: boolean;
  entryDate: string;
  volunteerId: string;
  goodWithCats?: boolean;
  goodWithDogs?: boolean;
  goodWithDogsLarge?: boolean;
  goodWithDogsSmall?: boolean;
  goodWithKids?: boolean;
  canLiveInApartment?: boolean;
  canLiveOutside?: boolean;
  aptoGatoUnico?: boolean;
  necesitaCompaneroFelino?: boolean;
  flexibleConvivenciaFelina?: boolean;
  adopcionConjunta?: boolean;
  personality?: Caracter[];
  protocolo: TratamientoItem[];
}

export interface EntradaBlog {
  id: number;
  titulo: string;
  contenido: string;
  fecha: string;
  imagenUrl?: string;
  galeria?: string[];
  etiquetas: string[];
  animalId?: number;
  autorNombre?: string;
}

export interface EntradaBlogInput {
  id?: number;
  titulo: string;
  contenido: string;
  fecha: string;
  imagenUrl?: string;
  galeria?: string[];
  etiquetas: string[];
  animalId?: number | null;
}

export interface User {
  id: number;
  email: string;
  nombre: string;
  apellidos?: string;
  telefono?: string;
  rol: UserRole;
  fechaAlta?: string;
}

export interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: CategoriaProducto;
  stockTotal: number;
  stockDisponible: number;
}

export interface ProductRequest {
  id: string;
  productId: string;
  productName?: string;
  productUnit?: string;
  volunteerId: string;
  quantity: number;
  reason: string;
  status: RequestStatus;
  requestDate: string;
  responseDate?: string;
  returnNotified: boolean;
  returnConfirmed: boolean;
  managerId?: string;
  managerNote?: string;
  detalleEntregado?: string;
}
