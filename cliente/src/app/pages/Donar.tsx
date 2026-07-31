// cliente/src/app/pages/Donar.tsx

export default function Donar() {
  return (
    <div className="bg-fondoBlanco min-h-screen">
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-negroCarbon mb-3">Donar</h1>
          <p className="text-sm text-gray-700 mb-4">Gracias a las donaciones podemos cubrir gastos veterinarios, alimentací³±n, material y mejoras en las instalaciones.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-fondo rounded-2xl border border-gray-200 p-5">
              <h2 className="text-base font-semibold mb-2">Donací³±n econó±±±mica</h2>
              <p className="text-sm text-gray-700 mb-3">Puedes colaborar con una aportací³±n puntual o periódica.</p>
              <p className="text-sm text-gray-700">N de cuenta: ES00 0000 0000 0000 0000 0000<br />Bizum: 00000</p>
            </div>
            <div className="bg-fondo rounded-2xl border border-gray-200 p-5">
              <h2 className="text-base font-semibold mb-2">Donací³±n de materiales</h2>
              <p className="text-sm text-gray-700">Pienso, arena, mantas, productos de limpieza Contacta con nosotros para coordinar la entrega de materiales.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
