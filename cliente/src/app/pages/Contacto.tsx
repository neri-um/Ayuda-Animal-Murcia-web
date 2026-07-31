import { useState } from 'react';
import { Link } from 'react-router';
import {
  Phone, Mail, MapPin, Clock, Heart, PawPrint,
  Send, CheckCircle2, ArrowRight, AlertCircle
} from 'lucide-react';

// ─── Formspree: los mensajes del formulario llegan a ayudaanimalm@gmail.com ────────
// Si necesitas cambiar el destino, ve a https://formspree.io y actualiza
// el formulario con ID: mvzejpjd
// Plan gratuito: 50 envíos/mes, sin tarjeta de crédito.
// ───────────────────────────────────────────────────────────────────────────────
const FORMSPREE_ID = 'mvzejpjd';
// ───────────────────────────────────────────────────────────────────────────────

const CONTACT_INFO = [
  {
    icon: Phone,
    label: 'Teléfono',
    value: '722 19 69 33',
    sub: 'Lun–Vie 9:00–18:00',
    href: 'tel:+34722196933',
  },
  {
    icon: Mail,
    label: 'Correo electrónico',
    value: 'ayudaanimalm@gmail.com',
    sub: 'Respondemos lo antes posible',
    href: 'mailto:ayudaanimalm@gmail.com',
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
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          email: form.email,
          asunto: form.asunto,
          mensaje: form.mensaje,
        }),
      });

      if (res.ok) {
        setSent(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(
          data?.errors?.[0]?.message ??
          'No se pudo enviar el mensaje. Inténtalo de nuevo o escríbenos directamente a ayudaanimalm@gmail.com'
        );
      }
    } catch {
      setError('Error de conexión. Comprueba tu internet e inténtalo de nuevo.');
    } finally {
      setSending(false);
    }
  };

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors";

  return (
    <div>
      {/* Hero */}
      <section className="relative py-24 overflow-hidden" style={{ backgroundColor: '#2e2e2e' }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <PawPrint className="absolute" style={{ width: '18rem', height: '18rem', top: '-2rem', right: '-1rem', transform: 'rotate(20deg)', color: 'rgba(255,255,255,0.04)' }} />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <h1 className="mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: '#f0e8d0', lineHeight: 1.2 }}>
            Contacta con nosotros
          </h1>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'rgba(240,232,208,0.75)' }}>
            ¿Tienes dudas sobre adopción, acogida o quieres colaborar? Estas son nuestras formas de contacto.
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
              <p className="text-gray-500 text-sm mb-8">Puedes escribirnos un WhatsApp o enviarnos un e-mail.</p>

              <div className="space-y-4 mb-10">
                {CONTACT_INFO.map((item, i) => {
                  const Icon = item.icon;
                  const content = (
                    <div className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#f0e8d0' }}>
                        <Icon className="w-5 h-5" style={{ color: '#2e2e2e' }} />
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
              <div className="p-6 rounded-2xl" style={{ backgroundColor: '#faf7f0' }}>
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
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#f0e8d0' }}>
                      <CheckCircle2 className="w-8 h-8" style={{ color: '#2e2e2e' }} />
                    </div>
                    <h3 className="text-gray-900 mb-2" style={{ fontWeight: 700 }}>¡Mensaje enviado!</h3>
                    <p className="text-gray-500 text-sm mb-6">Gracias por escribirnos. Te responderemos lo antes posible.</p>
                    <button
                      onClick={() => { setSent(false); setForm({ nombre: '', email: '', asunto: '', mensaje: '' }); }}
                      className="text-sm underline"
                      style={{ color: '#2e2e2e' }}
                    >
                      Enviar otro mensaje
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-gray-900 mb-1" style={{ fontWeight: 700, fontSize: '1.2rem' }}>Envínos un mensaje</h3>
                    <p className="text-gray-500 text-sm mb-6">Rellena el formulario y te contestamos pronto.</p>

                    {error && (
                      <div className="flex items-start gap-3 p-4 rounded-xl mb-4 text-sm" style={{ backgroundColor: '#fef2f2', color: '#991b1b' }}>
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

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
                            onFocus={e => (e.currentTarget.style.borderColor = '#2e2e2e')}
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
                            onFocus={e => (e.currentTarget.style.borderColor = '#2e2e2e')}
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
                          onFocus={e => (e.currentTarget.style.borderColor = '#2e2e2e')}
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
                          onFocus={e => (e.currentTarget.style.borderColor = '#2e2e2e')}
                          onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={sending}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl transition-all hover:opacity-90 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                        style={{ backgroundColor: '#2e2e2e', color: '#f0e8d0', fontWeight: 600 }}
                      >
                        {sending ? (
                          <>
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Enviar mensaje
                          </>
                        )}
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
      <section className="py-16" style={{ backgroundColor: '#f0e8d0' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mb-3" style={{ fontWeight: 700, fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', color: '#2e2e2e' }}>
            ¿Estas pensando en adoptar?
          </h2>
          <p className="text-sm mb-6 max-w-lg mx-auto" style={{ color: '#5a5a5a' }}>
            Conoce a todos los animales que tenemos en adopción. 
          </p>
          <Link
            to="/adoptar"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl transition-all hover:shadow-lg hover:opacity-90"
            style={{ backgroundColor: '#2e2e2e', color: '#f0e8d0', fontWeight: 600 }}
          >
            <PawPrint className="w-5 h-5" />
            Ver animales disponibles
          </Link>
        </div>
      </section>
    </div>
  );
}
