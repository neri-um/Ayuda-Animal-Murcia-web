// cliente/scripts/generate-sitemap.mjs
// Genera dist/sitemap.xml combinando las rutas estáticas con el
// contenido dinámico (animales y blog) del backend.
// No bloquea el build: si la API no responde, escribe el sitemap con las
// rutas estáticas y avisa en consola.
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const distDir = path.join(repoRoot, 'dist');

const SITE_URL = (process.env.SITE_URL || 'https://www.ayudaanimalmurcia.org').replace(/\/+$/, '');
const API_URL = (process.env.VITE_API_URL || 'https://ayuda-animal-murcia-web.onrender.com/vidanimal').replace(/\/+$/, '');

// Mismo algoritmo que cliente/src/app/utils/slug.ts
function toSlug(name) {
  return String(name)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

const hoy = new Date().toISOString().slice(0, 10);

// Rutas estáticas. Las novedades son contenido fijo en NovedadDetail.tsx.
const estaticas = [
  ['/', '1.0'],
  ['/adoptar', '0.9'],
  ['/blog', '0.8'],
  ['/colaborar', '0.8'],
  ['/colaborar/voluntariado', '0.8'],
  ['/colaborar/voluntariado-umu', '0.8'],
  ['/colaborar/acogida', '0.8'],
  ['/colaborar/donativo', '0.8'],
  ['/donar', '0.8'],
  ['/apadrinar', '0.8'],
  ['/contacto', '0.8'],
  ['/novedades/1', '0.7'],
  ['/novedades/2', '0.7'],
  ['/aviso-legal', '0.3'],
  ['/privacidad', '0.3'],
  ['/cookies', '0.3'],
];

const urls = new Map(estaticas.map(([ruta, priority]) => [ruta, { lastmod: hoy, priority }]));

async function cargarDinamicas() {
  try {
    const [animales, entradas] = await Promise.all([
      fetch(`${API_URL}/animales`).then((r) => (r.ok ? r.json() : [])),
      fetch(`${API_URL}/blog`).then((r) => (r.ok ? r.json() : [])),
    ]);
    for (const a of Array.isArray(animales) ? animales : []) {
      if (a?.name) urls.set(`/animales/${toSlug(a.name)}`, { lastmod: hoy, priority: '0.9' });
    }
    for (const e of Array.isArray(entradas) ? entradas : []) {
      if (e?.titulo) urls.set(`/blog/${toSlug(e.titulo)}`, { lastmod: hoy, priority: '0.7' });
    }
  } catch (err) {
    console.warn(`[sitemap] No se pudieron cargar las URLs dinámicas (${err.message}); se genera solo el sitemap estático.`);
  }
}

await cargarDinamicas();

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...urls.entries()]
  .sort(([a], [b]) => (a === '/' ? -1 : a.localeCompare(b)))
  .map(
    ([ruta, meta]) => `  <url>
    <loc>${SITE_URL}${ruta}</loc>
    <lastmod>${meta.lastmod}</lastmod>
    <priority>${meta.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

await mkdir(distDir, { recursive: true });
const destino = path.join(distDir, 'sitemap.xml');
await writeFile(destino, xml, 'utf8');
console.log(`[sitemap] Escrito ${destino} con ${urls.size} URLs`);
