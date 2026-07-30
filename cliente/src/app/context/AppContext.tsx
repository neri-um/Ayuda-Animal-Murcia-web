import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  Animal,
  User,
  Product,
  ProductRequest,
  RequestStatus,
  AnimalStatus,
  UserRole,
} from '../types';
import { TratamientoItem } from '../components/ProtocoloVeterinarioCard';

// ── Saneamiento de URL base con fallback seguro para Vercel ───────────────────
const rawBase = import.meta.env.VITE_API_URL || 'https://ayuda-animal-murcia-web.onrender.com/vidanimal';
const BASE = rawBase.replace(/\/+$/, '');

const VALID_REQUEST_STATUSES: RequestStatus[] = [
  'PENDIENTE', 'ACEPTADA', 'RECHAZADA', 'DEVOLUCION_NOTIFICADA', 'DEVUELTA',
];

function normalizeRequestStatus(raw: string | undefined | null): RequestStatus {
  if (!raw) return 'PENDIENTE';
  const upper = raw.toUpperCase() as RequestStatus;
  return VALID_REQUEST_STATUSES.includes(upper) ? upper : 'PENDIENTE';
}

function calcularEdadMeses(fechaNacimiento: string | null | undefined): number {
  if (!fechaNacimiento) return 0;
  const nacimiento = new Date(fechaNacimiento);
  if (isNaN(nacimiento.getTime())) return 0;
  const hoy = new Date();
  const meses =
    (hoy.getFullYear() - nacimiento.getFullYear()) * 12 +
    (hoy.getMonth() - nacimiento.getMonth());
  return Math.max(0, meses);
}

interface AppContextType {
  token: string | null;
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  animals: Animal[];
  animalsLoading: boolean;
  fetchAnimals: () => Promise<void>;
  addAnimal: (animal: Omit<Animal, 'id'>) => Promise<void>;
  updateAnimal: (id: string, updates: Partial<Animal>) => Promise<void>;
  deleteAnimal: (id: string) => Promise<void>;
  changeAnimalStatus: (id: string, status: AnimalStatus) => Promise<void>;
  addTratamiento: (animalId: string, item: Omit<TratamientoItem, 'id'>) => Promise<void>;
  completarCita: (animalId: string, citaId: string) => Promise<void>;
  users: User[];
  usersLoading: boolean;
  fetchUsers: () => Promise<void>;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => Promise<void>;
  updateUser: (id: string, updates: Partial<User>) => Promise<void>;
  toggleUserActive: (id: string, active: boolean) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  products: Product[];
  productsLoading: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (data: { nombre: string; descripcion: string; categoria: string; stock: number }) => Promise<void>;
  updateProduct: (id: string, data: { nombre?: string; descripcion?: string; categoria?: string; stock?: number }) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  requests: ProductRequest[];
  requestsLoading: boolean;
  fetchRequests: () => Promise<void>;
  addRequest: (req: Omit<ProductRequest, 'id' | 'status' | 'requestDate' | 'returnNotified' | 'returnConfirmed'>) => Promise<void>;
  updateRequestStatus: (id: string, status: RequestStatus, managerId: string, note?: string) => Promise<void>;
  notifyReturn: (id: string) => Promise<void>;
  confirmReturn: (id: string, managerId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

function loadSession(): { token: string | null; user: User | null } {
  try {
    const token = sessionStorage.getItem('va_token');
    const raw = sessionStorage.getItem('va_user');
    const user: User | null = raw ? JSON.parse(raw) : null;
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
}

function saveSession(token: string, user: User) {
  try {
    sessionStorage.setItem('va_token', token);
    sessionStorage.setItem('va_user', JSON.stringify(user));
  } catch { /* noop */ }
}

function clearSession() {
  try {
    sessionStorage.removeItem('va_token');
    sessionStorage.removeItem('va_user');
  } catch { /* noop */ }
}

const cleanUrl = (url?: string | null) => {
  if (!url) return '';
  const match = String(url).match(/https?:\/\/[^\s\])"]+/i);
  return match ? match[0] : String(url).replace(/^\[|\]$/g, '');
};

function extractGallery(a: any): string[] {
  const raw = a.galeria ?? a.gallery ?? a.fotos ?? a.imagenes ?? a.fotoUrls ?? a.fotosUrl ?? a.photos ?? a.images ?? [];
  if (!Array.isArray(raw)) return [];
  return raw.map(cleanUrl).filter(Boolean);
}

function extractVolunteerId(a: any): string {
  const id =
    a.responsable?.id ??
    (typeof a.responsable === 'number' ? a.responsable : null) ??
    a.voluntario?.id ??
    (typeof a.voluntario === 'number' ? a.voluntario : null) ??
    a.voluntarioId ??
    a.responsableId ??
    null;
  return id != null ? String(id) : '';
}

function mapAnimalFromBackend(a: any): Animal & { protocolo: TratamientoItem[] } {
  return {
    id: String(a.id),
    name: a.nombre ?? '',
    species: (a.especie ?? 'OTRO') as Animal['species'],
    breed: a.raza ?? '',
    age: calcularEdadMeses(a.fechaNacimiento),
    birthDate: a.fechaNacimiento ?? '',
    size: (a.tamanyo ?? 'ESTANDAR') as Animal['size'],
    gender: (a.sexo ?? 'MACHO') as Animal['gender'],
    status: (a.estado ?? 'EN_ADOPCION') as AnimalStatus,
    description: a.descripcion ?? '',
    imageUrl: cleanUrl(a.fotoUrl),
    gallery: extractGallery(a),
    vaccinated: Boolean(a.vacunado ?? false),
    sterilized: Boolean(a.esterilizado ?? false),
    microchip: Boolean(a.microchip ?? false),
    entryDate: a.fechaIngreso ?? '',
    volunteerId: extractVolunteerId(a),
    goodWithCats: Boolean(a.compatibleGatos ?? false),
    goodWithDogs: Boolean(a.compatiblePerros ?? false),
    protocolo: [],
  };
}

function mapCitaFromBackend(c: any): TratamientoItem {
  return {
    id: String(c.id),
    tratamiento: c.tratamiento ?? '',
    descripcion: c.descripcion ?? '',
    fecha: c.fecha ?? '',
    veterinario: c.veterinario ?? '',
    completada: Boolean(c.completada ?? false),
  };
}

function rolToBackend(role: UserRole): string {
  const map: Record<string, string> = {
    voluntario: 'VOLUNTARIO',
    encargado: 'ENCARGADO',
    administrador: 'ADMIN',
    VOLUNTARIO: 'VOLUNTARIO',
    ENCARGADO: 'ENCARGADO',
    ADMIN: 'ADMIN',
  };
  return map[role] ?? role.toUpperCase();
}

function rolFromBackend(rol: string): UserRole {
  const map: Record<string, UserRole> = {
    VOLUNTARIO: 'VOLUNTARIO',
    ENCARGADO: 'ENCARGADO',
    ADMIN: 'ADMIN',
  };
  return map[rol] ?? (rol as UserRole);
}

function mapUserFromBackend(u: any): User {
  return {
    id: String(u.id),
    name: u.nombre ?? '',
    email: u.email ?? '',
    password: '',
    role: rolFromBackend(u.rol),
    phone: u.telefono ?? '',
    active: u.activo !== undefined ? Boolean(u.activo) : true,
    createdAt: u.fechaCreacion ?? new Date().toISOString().slice(0, 10),
  };
}

function mapProductFromBackend(p: any): Product {
  return {
    id: String(p.id),
    nombre: p.nombre ?? '',
    descripcion: p.descripcion ?? '',
    categoria: p.categoria ?? 'OTRO',
    stockTotal: p.stockTotal ?? 0,
    stockDisponible: p.stockDisponible ?? 0,
  };
}

function mapRequestFromBackend(r: any): ProductRequest {
  return {
    id: String(r.id),
    productId: String(r.producto?.id ?? r.productoId ?? ''),
    productName: r.producto?.nombre ?? r.productoNombre ?? undefined,
    productUnit: r.producto?.unidad ?? r.productoUnidad ?? undefined,
    volunteerId: String(r.voluntario?.id ?? r.voluntarioId ?? ''),
    managerId: r.encargado?.id ? String(r.encargado.id) : (r.encargadoId ? String(r.encargadoId) : undefined),
    quantity: r.cantidad ?? 1,
    reason: r.motivo ?? '',
    status: normalizeRequestStatus(r.estado),
    requestDate: r.fechaSolicitud ?? new Date().toISOString().slice(0, 10),
    responseDate: r.fechaDecision ?? undefined,
    managerNote: r.notaEncargado ?? undefined,
    returnNotified: Boolean(r.devolucionNotificada ?? false),
    returnConfirmed: Boolean(r.devolucionConfirmada ?? false),
  };
}

function authHeaders(token: string | null): HeadersInit {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function jsonHeaders(token: string | null): HeadersInit {
  return { 'Content-Type': 'application/json', ...authHeaders(token) };
}

function recargarCitas(
  animalId: string,
  token: string | null,
  setAnimals: React.Dispatch<React.SetStateAction<Animal[]>>
) {
  return fetch(`${BASE}/animales/${animalId}/citas`, { headers: authHeaders(token) })
    .then(res => res.ok ? res.json() : [])
    .then((citas: any[]) => {
      const protocolo: TratamientoItem[] = Array.isArray(citas) ? citas.map(mapCitaFromBackend) : [];
      setAnimals(prev => prev.map(a => a.id === animalId ? { ...a, protocolo } : a));
    })
    .catch(() => {});
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const session = loadSession();
  const [token, setToken] = useState<string | null>(session.token);
  const [currentUser, setCurrentUser] = useState<User | null>(session.user);

  const [animals, setAnimals] = useState<Animal[]>([]);
  const [animalsLoading, setAnimalsLoading] = useState(true);

  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);

  const [requests, setRequests] = useState<ProductRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(false);

  const fetchAnimals = useCallback(async (tkn?: string | null) => {
    const t = tkn !== undefined ? tkn : token;
    setAnimalsLoading(true);
    try {
      const res = await fetch(`${BASE}/animales`, { headers: authHeaders(t) });
      if (!res.ok) throw new Error('Error al cargar animales');
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        setAnimals(Array.isArray(data) ? data.map(mapAnimalFromBackend) : []);
      } else {
        setAnimals([]);
      }
    } catch (err) {
      console.error('No se pudieron cargar los animales:', err);
      setAnimals([]);
    } finally {
      setAnimalsLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchAnimals(); }, [fetchAnimals]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      const user: User = {
        id: String(data.usuario.id),
        name: data.usuario.nombre,
        email: data.usuario.email,
        role: rolFromBackend(data.usuario.rol),
        active: true,
        password: '',
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setToken(data.token);
      setCurrentUser(user);
      saveSession(data.token, user);
      await fetchAnimals(data.token);
      return true;
    } catch { return false; }
  }, [fetchAnimals]);

  const logout = useCallback(async () => {
    try {
      if (token) {
        await fetch(`${BASE}/auth/logout`, {
          method: 'POST',
          headers: authHeaders(token),
        });
      }
    } catch { /* noop */ } finally {
      setCurrentUser(null);
      setToken(null);
      clearSession();
    }
  }, [token]);

  const addAnimal = useCallback(async (animal: Omit<Animal, 'id'>) => {
    await fetch(`${BASE}/animales`, {
      method: 'POST',
      headers: jsonHeaders(token),
      body: JSON.stringify({
        nombre: animal.name, especie: animal.species, raza: animal.breed,
        fechaNacimiento: animal.birthDate, fechaIngreso: animal.entryDate,
        tamanyo: animal.size, sexo: animal.gender, estado: animal.status,
        descripcion: animal.description, fotoUrl: animal.imageUrl,
        galeria: animal.gallery, vacunado: animal.vaccinated,
        esterilizado: animal.sterilized, microchip: animal.microchip,
        compatibleGatos: animal.goodWithCats, compatiblePerros: animal.goodWithDogs,
      }),
    });
    await fetchAnimals();
  }, [token, fetchAnimals]);

  const updateAnimal = useCallback(async (id: string, updates: Partial<Animal>) => {
    await fetch(`${BASE}/animales/${id}`, {
      method: 'PUT',
      headers: jsonHeaders(token),
      body: JSON.stringify({
        nombre: updates.name, especie: updates.species, raza: updates.breed,
        fechaNacimiento: updates.birthDate, fechaIngreso: updates.entryDate,
        tamanyo: updates.size, sexo: updates.gender, estado: updates.status,
        descripcion: updates.description, fotoUrl: updates.imageUrl,
        galeria: updates.gallery, vacunado: updates.vaccinated,
        esterilizado: updates.sterilized, microchip: updates.microchip,
        compatibleGatos: updates.goodWithCats, compatiblePerros: updates.goodWithDogs,
      }),
    });
    await fetchAnimals();
  }, [token, fetchAnimals]);

  const deleteAnimal = useCallback(async (id: string) => {
    await fetch(`${BASE}/animales/${id}`, { method: 'DELETE', headers: authHeaders(token) });
    await fetchAnimals();
  }, [token, fetchAnimals]);

  const changeAnimalStatus = useCallback(async (id: string, status: AnimalStatus) => {
    await fetch(`${BASE}/animales/${id}/estado`, {
      method: 'PATCH',
      headers: jsonHeaders(token),
      body: JSON.stringify({ estado: status }),
    });
    await fetchAnimals();
  }, [token, fetchAnimals]);

  const addTratamiento = useCallback(async (animalId: string, item: Omit<TratamientoItem, 'id'>) => {
    const res = await fetch(`${BASE}/animales/${animalId}/citas`, {
      method: 'POST',
      headers: jsonHeaders(token),
      body: JSON.stringify({
        tratamiento: item.tratamiento, descripcion: item.descripcion,
        fecha: item.fecha, veterinario: item.veterinario ?? '',
      }),
    });
    if (!res.ok) throw new Error('Error al guardar la cita');
    await recargarCitas(animalId, token, setAnimals);
  }, [token]);

  const completarCita = useCallback(async (animalId: string, citaId: string) => {
    const res = await fetch(`${BASE}/animales/${animalId}/citas/${citaId}/completar`, {
      method: 'PATCH',
      headers: authHeaders(token),
    });
    if (!res.ok) throw new Error('Error al completar la cita');
    await recargarCitas(animalId, token, setAnimals);
  }, [token]);

  const fetchUsers = useCallback(async () => {
    if (!token) return;
    setUsersLoading(true);
    try {
      const res = await fetch(`${BASE}/usuarios`, { headers: authHeaders(token) });
      if (!res.ok) throw new Error('Error al cargar usuarios');
      const data = await res.json();
      setUsers(Array.isArray(data) ? data.map(mapUserFromBackend) : []);
    } catch (err) {
      console.error('No se pudieron cargar los usuarios:', err);
    } finally {
      setUsersLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchUsers();
  }, [token, fetchUsers]);

  const addUser = useCallback(async (user: Omit<User, 'id' | 'createdAt'>) => {
    const res = await fetch(`${BASE}/usuarios`, {
      method: 'POST',
      headers: jsonHeaders(token),
      body: JSON.stringify({
        nombre: user.name, email: user.email, password: user.password,
        rol: rolToBackend(user.role), telefono: user.phone ?? '', activo: user.active,
      }),
    });
    if (!res.ok) throw new Error('Error al crear usuario');
    await fetchUsers();
  }, [token, fetchUsers]);

  const updateUser = useCallback(async (id: string, updates: Partial<User>) => {
    const body: Record<string, any> = {};
    if (updates.name !== undefined) body.nombre = updates.name;
    if (updates.email !== undefined) body.email = updates.email;
    if (updates.password) body.password = updates.password;
    if (updates.role !== undefined) body.rol = rolToBackend(updates.role);
    if (updates.phone !== undefined) body.telefono = updates.phone;
    if (updates.active !== undefined) body.activo = updates.active;
    const res = await fetch(`${BASE}/usuarios/${id}`, {
      method: 'PUT', headers: jsonHeaders(token), body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('Error al actualizar usuario');
    await fetchUsers();
  }, [token, fetchUsers]);

  const toggleUserActive = useCallback(async (id: string, active: boolean) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, active } : u));
    try {
      const patchRes = await fetch(`${BASE}/usuarios/${id}/activo`, {
        method: 'PATCH',
        headers: jsonHeaders(token),
        body: JSON.stringify({ activo: active }),
      });
      if (patchRes.ok) { await fetchUsers(); return; }
      let usuario: User | undefined;
      setUsers(prev => { usuario = prev.find(u => u.id === id); return prev; });
      const putBody: Record<string, any> = { activo: active };
      if (usuario) {
        putBody.nombre = usuario.name;
        putBody.email = usuario.email;
        putBody.rol = rolToBackend(usuario.role);
        putBody.telefono = usuario.phone ?? '';
      }
      const putRes = await fetch(`${BASE}/usuarios/${id}`, {
        method: 'PUT', headers: jsonHeaders(token), body: JSON.stringify(putBody),
      });
      if (!putRes.ok) throw new Error('Error al cambiar el estado del usuario');
      await fetchUsers();
    } catch (err) {
      setUsers(prev => prev.map(u => u.id === id ? { ...u, active: !active } : u));
      throw err;
    }
  }, [token, fetchUsers]);

  const deleteUser = useCallback(async (id: string) => {
    const res = await fetch(`${BASE}/usuarios/${id}`, { method: 'DELETE', headers: authHeaders(token) });
    if (!res.ok) throw new Error('Error al eliminar usuario');
    await fetchUsers();
  }, [token, fetchUsers]);

  const fetchProducts = useCallback(async () => {
    if (!token) return;
    setProductsLoading(true);
    try {
      const res = await fetch(`${BASE}/almacen/productos`, { headers: authHeaders(token) });
      if (!res.ok) throw new Error('Error al cargar productos');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data.map(mapProductFromBackend) : []);
    } catch (err) {
      console.error('No se pudieron cargar los productos:', err);
    } finally {
      setProductsLoading(false);
    }
  }, [token]);

  useEffect(() => { if (token) fetchProducts(); }, [token, fetchProducts]);

  const addProduct = useCallback(async (data: { nombre: string; descripcion: string; categoria: string; stock: number }) => {
    const res = await fetch(`${BASE}/almacen/productos`, {
      method: 'POST', headers: jsonHeaders(token), body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al crear producto');
    await fetchProducts();
  }, [token, fetchProducts]);

  const updateProduct = useCallback(async (id: string, data: { nombre?: string; descripcion?: string; categoria?: string; stock?: number }) => {
    const res = await fetch(`${BASE}/almacen/productos/${id}`, {
      method: 'PUT', headers: jsonHeaders(token), body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al actualizar producto');
    await fetchProducts();
  }, [token, fetchProducts]);

  const deleteProduct = useCallback(async (id: string) => {
    const res = await fetch(`${BASE}/almacen/productos/${id}`, { method: 'DELETE', headers: authHeaders(token) });
    if (!res.ok) throw new Error('Error al eliminar producto');
    await fetchProducts();
  }, [token, fetchProducts]);

  const fetchRequests = useCallback(async () => {
    if (!token) return;
    setRequestsLoading(true);
    try {
      const res = await fetch(`${BASE}/almacen/solicitudes`, { headers: authHeaders(token) });
      if (!res.ok) throw new Error('Error al cargar solicitudes');
      const data = await res.json();
      setRequests(Array.isArray(data) ? data.map(mapRequestFromBackend) : []);
    } catch (err) {
      console.error('No se pudieron cargar las solicitudes:', err);
    } finally {
      setRequestsLoading(false);
    }
  }, [token]);

  useEffect(() => { if (token) fetchRequests(); }, [token, fetchRequests]);

  const addRequest = useCallback(async (req: Omit<ProductRequest, 'id' | 'status' | 'requestDate' | 'returnNotified' | 'returnConfirmed'>) => {
    const res = await fetch(`${BASE}/almacen/solicitudes`, {
      method: 'POST', headers: jsonHeaders(token),
      body: JSON.stringify({
        productoId: Number(req.productId),
        voluntarioId: Number(req.volunteerId),
        cantidad: req.quantity,
        motivo: req.reason,
      }),
    });
    if (!res.ok) throw new Error('Error al crear solicitud');
    await fetchRequests();
  }, [token, fetchRequests]);

  const updateRequestStatus = useCallback(async (id: string, status: RequestStatus, managerId: string, note?: string) => {
    const res = await fetch(`${BASE}/almacen/solicitudes/${id}/decision`, {
      method: 'PUT', headers: jsonHeaders(token),
      body: JSON.stringify({
        decision: status,
        encargadoId: Number(managerId),
        notaEncargado: note ?? '',
      }),
    });
    if (!res.ok) throw new Error('Error al actualizar solicitud');
    await fetchRequests();
  }, [token, fetchRequests]);

  const notifyReturn = useCallback(async (id: string) => {
    const res = await fetch(`${BASE}/almacen/solicitudes/${id}/devolucion`, {
      method: 'PUT', headers: authHeaders(token),
    });
    if (!res.ok) throw new Error('Error al notificar devolucion');
    await fetchRequests();
  }, [token, fetchRequests]);

  const confirmReturn = useCallback(async (id: string, managerId: string) => {
    const res = await fetch(`${BASE}/almacen/solicitudes/${id}/confirmacion`, {
      method: 'PUT', headers: jsonHeaders(token),
      body: JSON.stringify({ encargadoId: Number(managerId) }),
    });
    if (!res.ok) throw new Error('Error al confirmar devolucion');
    await fetchRequests();
  }, [token, fetchRequests]);

  return (
    <AppContext.Provider value={{
      token, currentUser, login, logout,
      animals, animalsLoading, fetchAnimals, addAnimal, updateAnimal, deleteAnimal,
      changeAnimalStatus, addTratamiento, completarCita,
      users, usersLoading, fetchUsers, addUser, updateUser, toggleUserActive, deleteUser,
      products, productsLoading, fetchProducts, addProduct, updateProduct, deleteProduct,
      requests, requestsLoading, fetchRequests, addRequest, updateRequestStatus,
      notifyReturn, confirmReturn,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function useAuth() {
  const { currentUser, login, logout, token } = useApp();
  const canAccess = (minRole: UserRole): boolean => {
    if (!currentUser) return false;
    const roles: UserRole[] = ['VOLUNTARIO', 'ENCARGADO', 'ADMIN'];
    return roles.indexOf(currentUser.role) >= roles.indexOf(minRole);
  };
  return { currentUser, login, logout, canAccess, token };
}