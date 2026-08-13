const IMGBB_KEY = import.meta.env.VITE_IMGBB_KEY as string | undefined;

export async function uploadToImgBB(file: File): Promise<string> {
  if (!IMGBB_KEY) throw new Error('La variable VITE_IMGBB_KEY no está configurada');
  const data = new FormData();
  data.append('image', file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
    method: 'POST',
    body: data,
  });
  if (!res.ok) throw new Error('Error al subir imagen');
  const json = await res.json();
  return json.data.url as string;
}
