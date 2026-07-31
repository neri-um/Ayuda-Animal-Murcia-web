// cliente/src/app/pages/Colaborar.tsx

export default function Colaborar() {
  return (
    <div className="bg-fondoBlanco min-h-screen">
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-negroCarbon mb-3">Formas de colaborar</h1>
          <p className="text-sm text-gray-700 mb-4">Tu ayuda es fundamental para que podamos seguir cuidando y encontrando hogar a los animales que rescatamos.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-fondo rounded-2xl border border-gray-200 p-5">
              <h2 className="text-base font-semibold mb-2">Voluntariado</h2>
              <p className="text-sm text-gray-700">Colabora en el día a día del refugio: paseos, limpieza, socializací³±n, ferias y eventos de adopcí³±n.</p>
            </div>
            <div className="bg-fondo rounded-2xl border border-gray-200 p-5">
              <h2 className="text-base font-semibold mb-2">Casas de acogida</h2>
              <p className="text-sm text-gray-700">Ofrece tu hogar temporalmente a animales que necesitan un entorno seguro mientras encuentran familia definitiva.</p>
            </div>
            <div className="bg-fondo rounded-2xl border border-gray-200 p-5">
              <h2 className="text-base font-semibold mb-2">Difusí³±n</h2>
              <p className="text-sm text-gray-700">Comparte nuestras publicaciones y ayuda a que máá±±s personas conozcan a los animales que esperan adopcí³±n.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
