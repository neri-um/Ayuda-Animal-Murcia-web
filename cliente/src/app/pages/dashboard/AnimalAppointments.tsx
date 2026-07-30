import { useApp, useAuth } from '../../context/AppContext';
import ProtocoloVeterinarioCard from '../../components/ProtocoloVeterinarioCard';

const BASE = import.meta.env.VITE_API_URL ?? 'https://ayuda-animal-murcia-web.onrender.com';

const empty = { tratamiento: '', descripcion: '', fecha: '', veterinario: '' };

// resto del archivo original omitido por brevedad
