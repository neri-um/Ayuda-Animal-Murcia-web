import { CheckCircle2 } from 'lucide-react';

export const CLAUSULA_DATOS =
  'En cumplimiento de lo dispuesto en el Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo, de 27 de abril de 2016, relativo a la protección de las personas físicas en lo que respecta al tratamiento de datos personales y a la libre circulación de estos datos, así como en la Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales se le informa que ASOC Ayuda Animal (con CIF G73418873) es la responsable del tratamiento de sus datos con la finalidad de poder conocer y contactar con los adoptantes, antiguos adoptantes o acogidas de los animales que se encuentran en adopción o adoptados de la Asociación. Los datos de carácter personal aportados solo se conservarán durante el tiempo necesario para cumplir con la finalidad para la que se ha recabado y para determinar las posibles responsabilidades que se pudieran derivar de dicha finalidad y del tratamiento de los datos. Asimismo, se informa al interesado que no se comunicarán los datos a terceros, salvo obligación legal. El interesado podrá ejercitar sus derechos de acceso, rectificación, oposición, supresión, portabilidad y limitación del tratamiento así como, a no ser objeto de decisiones basadas únicamente en el tratamiento automatizado de sus datos, para ello se deberá dirigir a la atención de Asociación Ayuda Animal a través de ayudanimal_pm@hotmail.es.';

export function Seccion({
  titulo,
  descripcion,
  children,
  formato = 'titulo',
}: {
  titulo: string;
  descripcion?: string;
  children: React.ReactNode;
  formato?: 'titulo' | 'card';
}) {
  const cabecera = (
    <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-100">
      <span className="text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full"
        style={{ backgroundColor: '#f7e3b0', color: '#2e2e2e' }}>
        {titulo}
      </span>
    </div>
  );
  if (formato === 'card') {
    return (
      <section className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        {cabecera}
        {descripcion && <p className="text-sm text-gray-500 mb-4">{descripcion}</p>}
        <div className="flex flex-col gap-4">{children}</div>
      </section>
    );
  }
  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold mb-1" style={{ color: '#2e2e2e' }}>
        {titulo}
      </h3>
      {descripcion && (
        <p className="text-sm mb-4" style={{ color: '#727272' }}>
          {descripcion}
        </p>
      )}
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

export function AceptacionClausula({
  acepta,
  onChange,
}: {
  acepta: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="mt-2">
      <div
        className="max-h-48 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs leading-relaxed mb-3"
        style={{ color: '#555' }}
      >
        <p className="mb-2" style={{ color: '#2e2e2e', fontWeight: 600 }}>
          Cláusula de Protección de Datos
        </p>
        {CLAUSULA_DATOS}
      </div>
      <label className="flex items-start gap-2 text-sm cursor-pointer" style={{ color: '#2e2e2e' }}>
        <input
          type="checkbox"
          required
          checked={acepta}
          onChange={e => onChange(e.target.checked)}
          className="w-4 h-4 mt-0.5"
        />
        <span className="leading-snug">
          He leído y acepto la <strong>cláusula de protección de datos</strong>{' '}
          <span style={{ color: '#b91c1c' }}>*</span>
        </span>
      </label>
    </div>
  );
}

export function ExitoFormulario({
  titulo,
  texto,
  onReiniciar,
}: {
  titulo: string;
  texto: string;
  onReiniciar: () => void;
}) {
  return (
    <div className="text-center py-10">
      <CheckCircle2 className="w-12 h-12 mx-auto mb-3" style={{ color: '#547792' }} />
      <p className="font-semibold mb-1" style={{ color: '#2e2e2e' }}>
        {titulo}
      </p>
      <p className="text-sm mb-6" style={{ color: '#727272' }}>
        {texto}
      </p>
      <button onClick={onReiniciar} className="text-sm underline" style={{ color: '#547792' }}>
        Enviar otra solicitud
      </button>
    </div>
  );
}
