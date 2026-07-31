// cliente/src/app/pages/Home.tsx

type AnimalResumen = {
  id: number;
  nombre: string;
  especie: string;
  imagenUrl?: string;
  descripcionCorta?: string;
};

type Novedad = {
  id: number;
  titulo: string;
  fecha: string;
  resumen: string;
};

const ULTIMOS_ANIMALES: AnimalResumen[] = [
  { id: 1, nombre: 'Luna', especie: 'Perro', descripcionCorta: 'Rescatada de la calle, muy cariñ±±±osa.' },
  { id: 2, nombre: 'Misi', especie: 'Gato', descripcionCorta: 'Gatita joven, perfecta para piso tranquilo.' },
  { id: 3, nombre: 'Toby', especie: 'Perro', descripcionCorta: 'Adulto tranquilo, ideal para familias.' },
];

const NOVEDADES: Novedad[] = [
  { id: 1, titulo: 'Nueva campaña de adopcí³± en verano', fecha: 'Julio 2026', resumen: 'Ampliamos horarios y actividades para facilitar las adopciones durante los meses de verano.' },
  { id: 2, titulo: 'Gracias a nuestros voluntarios', fecha: 'Junio 2026', resumen: 'Reconocemos el trabajo de quienes apoyan cada día al refugio y hacen posible nuestra labor.' },
];

export default function Home() {
  return (
    <div className="bg-fondo text-negroCarbon">
      <section className="py-16 bg-negroCarbon text-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="mb-3 italic font-medium text-cremaDorado">Refugio Ayuda Animal Murcia</p>
            <h1 className="text-3xl sm:text-5xl font-black leading-tight mb-5">Cada animal merece<br /><span className="text-cremaDorado">una segunda oportunidad</span></h1>
            <p className="text-sm sm:text-base text-gray-200 mb-6">Somos una asociación sin ánimo de lucro dedicada al rescate, cuidado y adopcí³± responsable de animales en Murcia.</p>
            <div className="flex flex-wrap gap-3">
              <a href="/adoptar" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-90" style={{ backgroundColor: '#E3CFA9', color: '#1E1E1E' }}>Ver animales en adopcí³±n</a>
              <a href="/colaborar" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold border border-cremaDorado text-cremaDorado hover:bg-[#2a2a2a]">Formas de colaborar</a>
            </div>
          </div>
          <div className="hidden lg:block"><div className="rounded-3xl border border-gray-700 p-6"><p className="text-sm text-gray-300 mb-2">Nuestra misión</p><p className="text-base text-gray-100">Trabajamos cada día para que perros, gatos y otros animales abandonados encuentren un hogar donde recibir el cariño y el cuidado que merecen.</p></div></div>
        </div>
      </section>

      <section className="py-14 bg-fondoBlanco">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div><h2 className="text-2xl font-bold mb-3">Quié±±nes somos</h2><p className="text-sm text-gray-700 mb-3">Ayuda Animal Murcia nace del compromiso de un grupo de personas que no podí±±an mirar hacia otro lado ante la realidad del abandono animal.</p><p className="text-sm text-gray-700 mb-3">Nuestro trabajo se basa en el rescate, la atención veterinaria, la recuperación emocional y la búsqueda de familias responsables que quieran compartir su vida con ellos.</p><p className="text-sm text-gray-700">Gracias a donaciones, voluntariado y colaboraciones, podemos seguir ofreciendo una nueva oportunidad a cada animal.</p></div>
          <div className="bg-fondo rounded-2xl border border-gray-200 p-6"><h3 className="text-base font-semibold mb-2">Qué±± hacemos</h3><ul className="text-sm text-gray-700 space-y-2"><li>• Rescate y acogida de animales abandonados o maltratados.</li><li>• Atención veterinaria y seguimiento de cada caso.</li><li>• Fomento de la adopcí³±n responsable.</li><li>• Programas de apadrinamiento y casas de acogida.</li><li>• Educación y sensibilizací³±n sobre bienestar animal.</li></ul></div>
        </div>
      </section>

      <section className="py-14 bg-fondo">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div><h2 className="text-2xl font-bold mb-1">Ú±ltimos animales en adopcí³±n</h2><p className="text-sm text-gray-600">Estos son algunos de los animales que han llegado recientemente al refugio.</p></div>
            <a href="/adoptar" className="text-sm font-semibold text-negroCarbon hover:text-dorado">Ver todos</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ULTIMOS_ANIMALES.map((animal) => (
              <article key={animal.id} className="bg-fondoBlanco rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-40 bg-[#e1ded4] flex items-center justify-center text-gray-500 text-xs">Foto de {animal.especie}</div>
                <div className="p-4"><h3 className="text-lg font-semibold mb-1">{animal.nombre}</h3><p className="text-xs text-gray-500 mb-2">{animal.especie}</p><p className="text-sm text-gray-700 mb-3">{animal.descripcionCorta}</p><a href="/adoptar" className="inline-block text-xs font-semibold text-negroCarbon hover:text-dorado">Má±±s detalles y proceso de adopcí³±n</a></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-fondoBlanco">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-1">Ú±ltimas novedades</h2>
          <p className="text-sm text-gray-600 mb-6">Noticias, campañas y pequeños grandes logros del refugio.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {NOVEDADES.map((novedad) => (
              <article key={novedad.id} className="bg-fondo rounded-2xl border border-gray-200 p-5">
                <p className="text-xs text-gray-500 mb-1">{novedad.fecha}</p>
                <h3 className="text-lg font-semibold mb-2">{novedad.titulo}</h3>
                <p className="text-sm text-gray-700">{novedad.resumen}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-6 bg-negroCarbon text-gray-300 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between gap-3">
          <p> © {new Date().getFullYear()} Ayuda Animal Murcia. Todos los derechos reservados. </p>
          <p>Contacto: info@ayudaanimalmurcia.org · Murcia</p>
        </div>
      </footer>
    </div>
  );
}
