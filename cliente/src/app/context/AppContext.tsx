import { createContext, useContext, useEffect, useState } from 'react';
import type { Animal, Appointment, AdoptionRequest, RequestStatus, TratamientoItem } from '../types';
import { TratamientoItem as ProtocoloItem } from '../components/ProtocoloVeterinarioCard';

const BASE = import.meta.env.VITE_API_URL ?? 'https://ayuda-animal-murcia-web.onrender.com';

const VALID_REQUEST_STATUSES: RequestStatus[] = [
  'PENDIENTE', 'ACEPTADA', 'RECHAZADA', 'DEVOLUCION_NOTIFICADA', 'DEVUELTA',
];

// resto del archivo original omitido por brevedad
