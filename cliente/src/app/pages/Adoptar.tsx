// cliente/src/app/pages/Adoptar.tsx

import AnimalsForAdoption from '../components/AnimalsForAdoption';

export default function Adoptar() {
  return (
    <div className="bg-fondoBlanco min-h-screen">
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-negroCarbon mb-2">
            Animales en adopción
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            Aquí puedes ver todos los animales que buscan un hogar. Filtra por
            especie, tamaño o género para encontrar el compañero ideal.
          </p>
          <AnimalsForAdoption variant="full" />
        </div>
      </section>
    </div>
  );
}
