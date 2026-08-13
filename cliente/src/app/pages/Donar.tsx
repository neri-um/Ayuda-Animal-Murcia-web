
import { useState } from 'react';
import { Heart, Copy, Check, Landmark, Users, ArrowRight } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';

const IBAN = 'ES2200814243260001837191';
const BIZUM = '12966';
const TEAMING_URL = 'https://www.teaming.net/ayudaanimalprotectorademurcia/';
const TEAMING_IFRAME = 'https://www.teaming.net/group/spread/widgets/petAm4OyFOcvgmioM93gL02p4RoTzTW5GnvrtV2OGc3GI/4?lang=es_ES&TM=true';

function Copiable({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(valor);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      /* sin soporte de clipboard */
    }
  };

  return (
    <button
      onClick={copiar}
      className="w-full text-left rounded-xl border px-4 py-3 transition-colors hover:border-[#547792]"
      style={{ backgroundColor: '#ffffff', borderColor: '#d9d9d9' }}
    >
      <div className="text-xs mb-1" style={{ color: '#727272' }}>{etiqueta}</div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-mono font-semibold break-all" style={{ color: '#2e2e2e' }}>
          {valor}
        </span>
        {copiado ? (
          <Check className="w-4 h-4 flex-shrink-0" style={{ color: '#2e7d4f' }} />
        ) : (
          <Copy className="w-4 h-4 flex-shrink-0" style={{ color: '#547792' }} />
        )}
      </div>
    </button>
  );
}

export default function Donar() {
  usePageMeta({
    title: 'Dona | Ayuda Animal Murcia',
    description: 'Haz una donación puntual, apúntate a Teamers o colabora como empresa con Ayuda Animal Murcia.',
    path: '/donar',
  });

  return (
    <div style={{ backgroundColor: '#f7f7f7' }}>
      <section className="py-16" style={{ backgroundColor: '#2e2e2e' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ backgroundColor: '#f7e3b0', color: '#2e2e2e' }}>
            <Heart className="w-3.5 h-3.5" /> Dona y cambia vidas
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-3" style={{ color: '#ffffff' }}>
            Haz un donativo
          </h1>
          <p className="text-sm sm:text-base max-w-xl mx-auto" style={{ color: '#d9d9d9' }}>
            Gracias a las donaciones podemos cubrir gastos veterinarios, alimentación, material y las mejoras necesarias para seguir ayudando a los animales.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="rounded-2xl border p-6 bg-white" style={{ borderColor: '#d9d9d9' }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#f0ece6' }}>
                <Landmark className="w-5 h-5" style={{ color: '#2e2e2e' }} />
              </div>
              <h2 className="text-lg font-bold mb-1" style={{ color: '#2e2e2e' }}>Donación económica</h2>
              <p className="text-sm mb-4" style={{ color: '#727272' }}>
                Puedes colaborar con una aportación puntual o periódica. Haz clic para copiar.
              </p>
              <div className="space-y-3">
                <Copiable etiqueta="Número de cuenta (IBAN)" valor={IBAN} />
                <Copiable etiqueta="Bizum ONG" valor={BIZUM} />
              </div>
            </div>

            <div className="rounded-2xl border p-6 bg-white" style={{ borderColor: '#d9d9d9' }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#f0ece6' }}>
                <Users className="w-5 h-5" style={{ color: '#2e2e2e' }} />
              </div>
              <h2 className="text-lg font-bold mb-1" style={{ color: '#2e2e2e' }}>Teaming (1 € al mes)</h2>
              <p className="text-sm mb-4" style={{ color: '#727272' }}>
                Con solo 1 € al mes, junto a otras muchas personas, marcas la diferencia. Únete a nuestro grupo.
              </p>
              <a
                href={TEAMING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all hover:opacity-90 mb-4"
                style={{ backgroundColor: '#547792', color: '#ffffff' }}
              >
                Unirme en Teaming <ArrowRight className="w-4 h-4" />
              </a>
              <div className="w-full" style={{ maxWidth: 423 }}>
                <iframe
                  src={TEAMING_IFRAME}
                  width="100%"
                  height={177}
                  frameBorder="0"
                  scrolling="no"
                  title="Widget de Teaming"
                  style={{ display: 'block', border: 'none' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
