import { createContext, useContext, useEffect, useState } from 'react';
import type { Animal, Appointment, AdoptionRequest, RequestStatus, UserRole } from '../types';
import { TratamientoItem as ProtocoloItem } from '../components/ProtocoloVeterinarioCard';

// ... aquí va todo tu código existente de estado global, efectos, etc. ...

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // implementación actual de tu provider, con useState/useEffect y value
  // (mantén exactamente la lógica que ya tenías, solo añadiendo export)
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
