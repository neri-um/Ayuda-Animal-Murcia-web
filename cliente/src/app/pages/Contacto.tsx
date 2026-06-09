import { useState } from 'react';
import { Link } from 'react-router';
import {
  Phone, Mail, MapPin, Clock, Heart, PawPrint,
  Send, CheckCircle2, ArrowRight
} from 'lucide-react';

const CONTACT_INFO = [
  {
    icon: Phone,
    label: 'Teléfono',
    value: '968 XX XX XX',
    sub: 'Lun–Vie 9:00–18:00',
    href: 'tel:+34968000000',
  },
  {
    icon: Mail,
    label: 'Correo electrónico',
    value: 'info@ayudaanimalmurcia.org',
    sub: 'Respondemos en 24–48 h',
    href: 'mailto:info@ayudaanimalmurcia.org',
  },
  {
    icon: MapPin,
    label: 'Ubicación',
    value: 'Región de Murcia',
    sub: 'Dirección exacta al concertar visita',
    href: undefined,
  },
  {
    icon: Clock,
    label: 'Horario',
    value: 'Lun–Vie 9:00–18:00',
    sub: 'Sáb 10:00–14:00 · Dom cerrado',
    href: undefined,
  },
];

const FAQS = [
  {
    q: '¿Cuánto cuesta adoptar?',
    a: 'La adopción es gratuita. Solo pedimos el compromiso de cuidar al animal responsablemente.',
  },
  {
    q: '¿Puedo llevar a mis hijos a conocer los animales?',
    a: 'Sí, las visitas familiares son bienvenidas. Te pedimos que conciertes la visita con antelación.',
  },
  {
    q: '¿Qué pasa si no puedo quedármelo?',
    a: 'Contacta con nosotros antes de tomar ninguna decisión. Siempre encontramos una solución juntos.',
  },
  {
    q: '¿Puedo ser familia de acogida temporal?',
    a: 'Sí, necesitamos familias de acogida. Escríbenos y te explicamos cómo funciona el programa.',
  },
];

export default function Contacto() {
  const [form, setForm] = useState({ nombre: '', email: '', asunto: '', mensaje: '' });
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // En producción esto enviaría el formulario a un backend o servicio de email
    setSent(true);
  };

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors";

  return (
    <div>
      {/* Hero */}
      <section className="relative py-24 text-white overflow-hidden" style={{ backgroundColor: '#213448' }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <PawPrint className="absolute text-white/5" style={{ width: '18rem', height: '18rem', top: '-2rem', right: '-1rem', transform: 'rotate(20deg)' }} />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm mb-6" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
            <Heart className="w-4 h-4 fill-white" />
            Estamos aquí para ayudarte
          </div>
          <h1 className="text-white mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700 }}>
            Contacta con nosotros
          </h1>
          <p className="text-white/75 text-lg max-w-xl mx-auto">
            ¿Tienes dudas sobre adopción, acogida o quieres colaborar? Escríbenos y te respondemos en menos de 48 horas.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 50L1440 50L1440 15C1200 50 900 0 720 15C540 30 240 0 0 15L0 50Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Info + Formulario */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">

            {/* Info de contacto */}
            <div>
              <h2 className="text-gray-900 mb-2" style={{ fontSize: '1.5rem', fontWeight: 700 }}>Información de contacto</h2>
              <p className="text-gray-500 text-sm mb-8">Puedes escribirnos, llamarnos o visitarnos en nuestras instalaciones.</p>

              <div className="space-y-4 mb-10">
                {CONTACT_INFO.map((item, i) => {
                  const Icon = item.icon;
                  const content = (
                    <div className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#dce8ed' }}>
                        <Icon className="w-5 h-5" style={{ color: '#547792' }} />
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 mb-0.5">{item.label}</div>
                        <div className="text-sm text-gray-900" style={{ fontWeight: 600 }}>{item.value}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{item.sub}</div>
                      </div>
                    </div>
                  );
                  return item.href ? (
                    <a key={i} href={item.href}>{content}</a>
                  ) : (
                    <div key={i}>{content}</div>
                  );
                })}
              </div>

              {/* Redes sociales */}
              <div className="p-6 rounded-2xl" style={{ backgroundColor: '#f0f6f9' }}>
                <h4 className="text-gray-900 mb-3 text-sm" style={{ fontWeight: 600 }}>Síguenos en redes</h4>
                <div className="flex gap-3">
                  {['Facebook', 'Instagram'].map(red => (
                    <span key={red} className="px-4 py-2 rounded-full text-xs border border-gray-200 bg-white text-gray-600" style={{ fontWeight: 500 }}>
                      {red}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-3">Publicamos novedades, animales disponibles y eventos.</p>
              </div>
            </div>

            {/* Formulario */}
            <div>
              <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-8">
                {sent ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#dce8ed' }}>
                      <CheckCircle2 className="w-8 h-8" style={{ color: '#547792' }} />
                    </div>
                    <h3 className="text-gray-900 mb-2" style={{ fontWeight: 700 }}>¡Mensaje enviado!</h3>
                    <p className="text-gray-500 text-sm mb-6">Gracias por escribirnos. Te responderemos en menos de 48 horas.</p>
                    <button
                      onClick={() => { setSent(false); setForm({ nombre: '', email: '', asunto: '', mensaje: '' }); }}
                      className="text-sm underline"
                      style={{ color: '#547792' }}
                    >
                      Enviar otro mensaje
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-gray-900 mb-1" style={{ fontWeight: 700, fontSize: '1.2rem' }}>Envíanos un mensaje</h3>
                    <p className="text-gray-500 text-sm mb-6">Rellena el formulario y te contestamos pronto.</p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Nombre *</label>
                          <input
                            required
                            type="text"
                            placeholder="Tu nombre"
                            value={form.nombre}
                            onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                            className={inputCls}
                            onFocus={e => (e.currentTarget.style.borderColor = '#547792')}
                            onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Email *</label>
                          <input
                            required
                            type="email"
                            placeholder="tu@email.com"
                            value={form.email}
                            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                            className={inputCls}
                            onFocus={e => (e.currentTarget.style.borderColor = '#547792')}
                            onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Asunto *</label>
                        <select
                          required
                          value={form.asunto}
                          onChange={e => setForm(f => ({ ...f, asunto: e.target.value }))}
                          className={inputCls}
                          onFocus={e => (e.currentTarget.style.borderColor = '#547792')}
                          onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                        >
                          <option value="">Selecciona un asunto</option>
                          <option value="adopcion">Información sobre adopción</option>
                          <option value="acogida">Ser familia de acogida</option>
                          <option value="voluntariado">Voluntariado</option>
                          <option value="donacion">Donaciones</option>
                          <option value="animal-encontrado">He encontrado un animal</option>
                          <option value="otro">Otro</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Mensaje *</label>
                        <textarea
                          required
                          rows={5}
                          placeholder="Cuéntanos en qué podemos ayudarte..."
                          value={form.mensaje}
                          onChange={e => setForm(f => ({ ...f, mensaje: e.target.value }))}
                          className={inputCls}
                          style={{ resize: 'none' }}
                          onFocus={e => (e.currentTarget.style.borderColor = '#547792')}
                          onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 text-white py-3.5 rounded-xl transition-all hover:opacity-90 hover:shadow-lg"
                        style={{ backgroundColor: '#547792', fontWeight: 600 }}
                      >
                        <Send className="w-4 h-4" />
                        Enviar mensaje
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-gray-900 mb-2">Preguntas frecuentes</h2>
            <p className="text-gray-500 text-sm">Las dudas más habituales antes de adoptar</p>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <span className="text-sm text-gray-900" style={{ fontWeight: 600 }}>{faq.q}</span>
                  <span className="ml-4 text-gray-400 flex-shrink-0" style={{ transform: openFaq === i ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4">
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ backgroundColor: '#dce8ed' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-gray-900 mb-3" style={{ fontWeight: 700, fontSize: 'clamp(1.3rem, 3vw, 1.8rem)' }}>
            ¿Prefieres venir a conocernos?
          </h2>
          <p className="text-gray-600 text-sm mb-6 max-w-lg mx-auto">
            Puedes visitarnos durante nuestro horario de atención. ¡Los animales estarán encantados de conocerte!
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white px-8 py-3.5 rounded-xl transition-all hover:shadow-lg hover:opacity-90"
            style={{ backgroundColor: '#547792', fontWeight: 600 }}
          >
            <PawPrint className="w-5 h-5" />
            Ver animales disponibles
          </Link>
        </div>
      </section>
    </div>
  );
}
