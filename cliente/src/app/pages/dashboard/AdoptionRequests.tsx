import { useEnums, formatEnum } from '../../hooks/useEnums';
import type { SolicitudAdopcion, EstadoSolicitudAdopcion } from '../../types/adoption';

const BASE = import.meta.env.VITE_API_URL ?? 'https://ayuda-animal-murcia-web.onrender.com';

const ESTADO_COLORS: Record<EstadoSolicitudAdopcion, string> = {
  PENDIENTE: 'bg-amber-100 text-amber-700',
  // resto de mapa
};

// resto del archivo original omitido por brevedad
