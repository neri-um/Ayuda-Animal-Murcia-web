
import { usePageMeta } from '../hooks/usePageMeta';

export default function Apadrinar() {
  usePageMeta({
    title: 'Apadrina un animal | Ayuda Animal Murcia',
    description: 'Apadrina a un perro o gato del refugio de Ayuda Animal Murcia: cubre sus cuidados y sigue su evolución.',
    path: '/colaborar/apadrinar',
  });

  return (
    <div className="bg-fondoBlanco min-h-screen">
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-negroCarbon mb-3">Apadrinar</h1>
          <p className="text-sm text-gray-700 mb-4">Si no puedes adoptar pero quieres ayudar a un animal en concreto, el apadrinamiento es una forma preciosa de hacerlo.</p>
          <div className="bg-fondo rounded-2xl border border-gray-200 p-5">
            <h2 className="text-base font-semibold mb-2">En qué consiste?</h2>
            <p className="text-sm text-gray-700 mb-3">Como padrino o madrina colaboras en los gastos de manutención y cuidados del animal que elijas. Te mantendremos informado de su evolución y podrás visitarlo en el refugio.</p>
            <p className="text-sm text-gray-700">Para más información o para iniciar el apadrinamiento, contacta con nosotros mediante nuestro formulario de contacto o correo electrónico.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
