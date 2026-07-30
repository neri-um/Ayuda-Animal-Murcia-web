import { useApp } from '../context/AppContext';
import type { SolicitudAdopcionRequest } from '../types/adoption';

const BASE = import.meta.env.VITE_API_URL ?? 'https://ayuda-animal-murcia-web.onrender.com';

export default function AdoptionForm() {
  const { animals, currentUser } = useApp();

  // aquí va exactamente el cuerpo de tu componente original,
  // manteniendo la lógica de formulario, validaciones y envío
  // solo cambiando la declaración a `export default function`
}
