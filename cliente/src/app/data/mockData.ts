// Este fichero se mantiene solo por compatibilidad con imports existentes.
// Los tipos han sido migrados a src/app/types.ts
// Los datos vienen exclusivamente del backend a través de AppContext.
export type {
  Species,
  AnimalSize,
  AnimalGender,
  AnimalStatus,
  UserRole,
  Tratamiento,
  CategoriaProducto,
  RequestStatus,
  Animal,
  User,
  Product,
  ProductRequest,
} from '../types';

export const initialAnimals:  never[] = [];
export const initialUsers:    never[] = [];
export const initialProducts: never[] = [];
export const initialRequests: never[] = [];
