import { useState, useEffect } from 'react';
import { getEnums, formatEnum, type EnumsResponse } from '../services/enums';

// formatEnum se importa del servicio y se reexporta para que los componentes
// no tengan que importar dos módulos distintos.
export { formatEnum };

/**
 * Hook que carga los enums del backend con caché.
 * Devuelve los arrays de valores posibles directamente del servidor.
 */
export function useEnums() {
  const [enums, setEnums] = useState<EnumsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getEnums()
      .then(data => setEnums(data))
      .catch(() => setError('No se pudieron cargar los datos del servidor.'))
      .finally(() => setLoading(false));
  }, []);

  return { enums, loading, error, formatEnum };
}
