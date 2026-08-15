// Prerrender de páginas dinámicas para redes sociales (WhatsApp, Facebook, Telegram, X…).
// Se ejecuta en el edge ANTES de servir la SPA: si quien pide /animales/{slug} o /blog/{slug}
// es un bot (scraper de redes), se devuelve el HTML con las metaetiquetas OG del contenido.
// Los humanos siguen recibiendo la aplicación React sin redirección.

const SITE_URL = 'https://www.ayudaanimalmurcia.org';
const API_BASE = (process.env.VITE_API_URL || 'https://ayuda-animal-murcia-web.onrender.com/vidanimal').replace(/\/+$/, '');
const DEFAULT_IMAGE = `${SITE_URL}/og-banner.png`;

const BOT_RE =
  /whatsapp|facebookexternalhit|facebot|telegrambot|twitterbot|linkedin|pinterest|slack|discord|snapchat|skypeuripreview|line\s|viber|imessage|vkShare|naver|duckduckbot|bingbot|googlebot|yandex|curl|wget|embedly|quora|pocket/i;

interface AnimalPublico {
  nombre?: string;
  descripcion?: string;
  fotoUrl?: string;
}

interface EntradaBlogPublica {
  id?: number;
  titulo?: string;
  contenido?: string;
  imagenUrl?: string;
  galeria?: string[];
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function truncate(s: string, max: number): string {
  const clean = s.replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max).trimEnd()}…` : clean;
}

export default async function middleware(request: Request): Promise<Response | undefined> {
  if (request.method !== 'GET' && request.method !== 'HEAD') return undefined;

  const ua = request.headers.get('user-agent') || '';
  if (!BOT_RE.test(ua)) return undefined;

  const { pathname } = new URL(request.url);
  const parts = pathname.split('/').filter(Boolean);
  const seccion = parts[0];
  const slug = decodeURIComponent(parts[1] || '').toLowerCase();
  if (!slug) return undefined;

  let title = '';
  let description = '';
  let image = DEFAULT_IMAGE;
  let realUrl = SITE_URL;

  if (seccion === 'animales') {
    realUrl = `${SITE_URL}/animales/${slug}`;
    let animal: AnimalPublico | null = null;
    try {
      const r = await fetch(`${API_BASE}/animales`);
      if (r.ok) {
        const list: AnimalPublico[] = await r.json();
        animal = (list || []).find(a => a && a.nombre && toSlug(a.nombre) === slug) || null;
      }
    } catch {
      animal = null;
    }
    title = animal
      ? `${animal.nombre} en adopción | Ayuda Animal Murcia`
      : 'Ayuda Animal Murcia | Adopta, no compres';
    description = animal?.descripcion
      ? truncate(animal.descripcion, 180)
      : 'Asociación sin ánimo de lucro dedicada a la adopción y el cuidado de animales en Murcia.';
    image = animal?.fotoUrl || DEFAULT_IMAGE;
  } else if (seccion === 'blog') {
    realUrl = `${SITE_URL}/blog/${slug}`;
    let entrada: EntradaBlogPublica | null = null;
      try {
        const r = await fetch(`${API_BASE}/blog`);
        if (r.ok) {
          const list: EntradaBlogPublica[] = await r.json();
          entrada =
            (list || []).find(e => e && e.titulo && toSlug(e.titulo) === slug) ||
            (list || []).find(e => e && e.id != null && String(e.id) === slug) ||
            null;
        }
      } catch {
        entrada = null;
      }
    if (entrada && entrada.titulo) {
      realUrl = `${SITE_URL}/blog/${toSlug(entrada.titulo)}`;
    }
    title = entrada
      ? `${entrada.titulo} | Blog de Ayuda Animal Murcia`
      : 'Blog de Ayuda Animal Murcia';
    description = entrada?.contenido
      ? truncate(entrada.contenido, 180)
      : 'Historias y noticias de Ayuda Animal Murcia, la protectora de animales de la Región de Murcia.';
    image = entrada?.imagenUrl || entrada?.galeria?.[0] || DEFAULT_IMAGE;
  } else {
    return undefined;
  }

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}" />
<link rel="canonical" href="${realUrl}" />
<meta property="og:type" content="article" />
<meta property="og:site_name" content="Ayuda Animal Murcia" />
<meta property="og:locale" content="es_ES" />
<meta property="og:title" content="${escapeHtml(title)}" />
<meta property="og:description" content="${escapeHtml(description)}" />
<meta property="og:url" content="${realUrl}" />
<meta property="og:image" content="${image}" />
<meta property="og:image:alt" content="${escapeHtml(title)}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:domain" content="www.ayudaanimalmurcia.org" />
<meta name="twitter:title" content="${escapeHtml(title)}" />
<meta name="twitter:description" content="${escapeHtml(description)}" />
<meta name="twitter:image" content="${image}" />
</head>
<body style="font-family:system-ui,sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#fdf6e9;color:#2e2e2e;text-align:center;padding:24px">
${image !== DEFAULT_IMAGE ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(title)}" style="max-width:280px;border-radius:16px;margin-bottom:16px" />` : ''}
<h1 style="margin:0 0 8px;font-size:20px">${escapeHtml(title)}</h1>
<p style="margin:0 0 16px;color:#666">Ayuda Animal Murcia · Protectora de animales en Murcia</p>
<a href="${realUrl}" style="color:#547792">Ver la página</a>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

export const config = {
  matcher: ['/animales/:path*', '/blog/:path*'],
};
