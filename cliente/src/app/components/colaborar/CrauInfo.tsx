export const CRAU_ITEMS: string[] = [
  'Por cada tres meses siendo casa de acogida de un animal de la protectora se otorgará 1 CRAU.',
  'La asistencia, participación y organización a 5 turnos de mercadillo (constando cada asistencia de 4 horas) equivaldrá a 1 CRAU.',
  'El cumplimiento del mínimo de ventas de artículos solidarios (diferente para cada artículo) que se realizan en la asociación con el fin de poder sufragar los gastos y el mantenimiento de los animales (lotería, calendario, sorteo, agenda...) otorgará 1 CRAU.',
  'La correcta gestión de casos de animales de la protectora (englobando la búsqueda de casa de acogida para el animal, mantener actualizadas las redes sociales, organizar las visitas necesarias al veterinario, lectura de cuestionarios, la recaudación de la posible deuda creada por el animal, elección de la futura familia y el seguimiento post adoptivo) contabilizará de forma distinta dependiendo del animal en cuestión: 2 casos de animales adultos o cuya adopción sea complicada equivaldrá a 3 CRAU, y 4 casos simples (ej. cachorros) 3 CRAU.',
  'Se otorgará 1 CRAU a aquellas personas que desempeñen alguna de las funciones disponibles durante 4 meses en la gestión de colonias del campus de Espinardo.',
  'El apoyo continuado en la gestión digital de la asociación (actualización de estados en la web/redes, mantenimiento de la información visible al público y soporte en la difusión) durante un periodo de 4 meses equivaldrá a 1 CRAU.',
];

export default function CrauNota() {
  return (
    <div className="rounded-xl border p-4 text-sm leading-relaxed" style={{ backgroundColor: '#f7f3e8', borderColor: '#e6dcc0', color: '#5a5344' }}>
      <p className="mb-2" style={{ color: '#2e2e2e', fontWeight: 600 }}>
        Información sobre los CRAU
      </p>
      <p className="mb-2">
        Dado que se trata de una asociación de animales sin refugio, las actividades que se han de realizar son variadas y muchas de ellas online o en domicilio. Por lo tanto, no es posible contabilizar la participación en horas sino en tareas. Las equivalencias se desglosan de la siguiente manera:
      </p>
      <ul className="list-disc pl-5 space-y-1">
        {CRAU_ITEMS.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}