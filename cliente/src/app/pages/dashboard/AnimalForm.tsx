import { Animal, AnimalSize, AnimalGender, AnimalStatus, Species } from '../../data/mockData';
import { formatEnum, getEnums } from '../../services/enums';

const BASE = import.meta.env.VITE_API_URL ?? 'https://ayuda-animal-murcia-web.onrender.com';

const IMGBB_KEY = import.meta.env.VITE_IMGBB_KEY as string | undefined;

// resto del archivo original omitido por brevedad
