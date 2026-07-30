import { useAuth } from '../../context/AppContext';
import type { FormularioAdopcionAdmin } from '../../types/adoption';

const BASE = import.meta.env.VITE_API_URL ?? 'https://ayuda-animal-murcia-web.onrender.com';

const ESPECIES = ['PERRO', 'GATO', 'CONEJO', 'AVE', 'REPTIL', 'OTRO'];

// resto del archivo original omitido por brevedad
