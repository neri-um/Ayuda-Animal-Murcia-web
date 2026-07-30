import { createContext, useContext, useEffect, useState } from 'react';
import type { Animal, Appointment, AdoptionRequest, RequestStatus, UserRole } from '../types';
import { TratamientoItem as ProtocoloItem } from '../components/ProtocoloVeterinarioCard';

// ... resto del contexto y del AppProvider tal como ya lo tienes ...

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
