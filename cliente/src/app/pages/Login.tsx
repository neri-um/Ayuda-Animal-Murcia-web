import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AppContext';

const LOGO_URL = '/logo.jpg';

/* Paleta corporativa
   --negro:   #2e2e2e
   --azul:    #547792
   --azul-dk: #3d6180
   --crema:   #f7e3b0
   --fondo:   #EAE0CF  (igual que el resto de la web pública)
   --gris-tx: #727272
*/

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) {
      navigate('/dashboard');
    } else {
      setError('Email o contraseña incorrectos, o cuenta desactivada.');
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1rem',
      backgroundColor: '#EAE0CF',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Manchas decorativas corporativas */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-8%', left: '-4%', width: '42vw', height: '42vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(84,119,146,0.18) 0%, transparent 65%)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '38vw', height: '38vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(247,227,176,0.45) 0%, transparent 65%)' }} />
        <div style={{ position: 'absolute', top: '35%', right: '8%', width: '18vw', height: '18vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(46,46,46,0.06) 0%, transparent 70%)' }} />
      </div>

      <div className="w-full max-w-sm" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '1.5rem',
          boxShadow: '0 8px 40px rgba(46,46,46,0.14), 0 2px 8px rgba(46,46,46,0.07)',
          border: '1px solid rgba(84,119,146,0.15)',
          overflow: 'hidden',
        }}>

          {/* Cabecera oscura */}
          <div style={{ backgroundColor: '#2e2e2e', padding: '2rem 2rem 1.75rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <img src={LOGO_URL} alt="Logo Ayuda Animal Murcia" style={{ height: '54px', width: 'auto' }} />
            </div>
            <h1 style={{ color: '#f7e3b0', fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.01em', margin: 0 }}>
              Ayuda Animal Murcia
            </h1>
            <p style={{ color: 'rgba(247,227,176,0.5)', fontSize: '0.78rem', marginTop: '0.25rem' }}>
              Panel de gestión · Vidanimal
            </p>
          </div>

          {/* Separador degradado corporativo */}
          <div style={{ height: '3px', background: 'linear-gradient(to right, #547792, #f7e3b0, #547792)' }} />

          {/* Formulario */}
          <div style={{ padding: '2rem' }}>
            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {/* Email */}
              <div>
                <label htmlFor="login-email" style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#547792', marginBottom: '0.4rem' }}>
                  Email
                </label>
                <input
                  id="login-email" type="email" value={email} required
                  placeholder="tu@correo.org"
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  onFocus={e  => (e.currentTarget.style.borderColor = '#547792')}
                  onBlur={e   => (e.currentTarget.style.borderColor = '#d8cfc4')}
                  style={{ width: '100%', border: '1.5px solid #d8cfc4', borderRadius: '0.75rem', padding: '0.7rem 0.9rem', fontSize: '0.88rem', outline: 'none', transition: 'border-color 0.2s', backgroundColor: '#faf8f5', color: '#2e2e2e' }}
                />
              </div>

              {/* Contraseña */}
              <div>
                <label htmlFor="login-password" style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#547792', marginBottom: '0.4rem' }}>
                  Contraseña
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="login-password" type={showPass ? 'text' : 'password'} value={password} required
                    placeholder="••••••••"
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    onFocus={e  => (e.currentTarget.style.borderColor = '#547792')}
                    onBlur={e   => (e.currentTarget.style.borderColor = '#d8cfc4')}
                    style={{ width: '100%', border: '1.5px solid #d8cfc4', borderRadius: '0.75rem', padding: '0.7rem 2.6rem 0.7rem 0.9rem', fontSize: '0.88rem', outline: 'none', transition: 'border-color 0.2s', backgroundColor: '#faf8f5', color: '#2e2e2e' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    onMouseEnter={e => (e.currentTarget.style.color = '#547792')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#b0a99a')}
                    style={{ position: 'absolute', right: '0.7rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#b0a99a', padding: '0.2rem', display: 'flex', alignItems: 'center' }}
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', padding: '0.75rem 1rem', borderRadius: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', fontSize: '0.85rem' }}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ marginTop: '0.1rem' }} />
                  <span>{error}</span>
                </div>
              )}

              {/* Botón */}
              <button
                type="submit"
                disabled={loading}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#3d6180'; }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = '#547792'; }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', backgroundColor: loading ? '#8fa8b8' : '#547792', color: '#ffffff', fontWeight: 600, fontSize: '0.9rem', padding: '0.8rem', borderRadius: '0.75rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s', marginTop: '0.25rem' }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
                    </svg>
                    Entrando...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Entrar al panel
                  </>
                )}
              </button>
            </form>

            {/* Volver */}
            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <Link
                to="/"
                onMouseEnter={e => (e.currentTarget.style.color = '#547792')}
                onMouseLeave={e => (e.currentTarget.style.color = '#b0a99a')}
                style={{ fontSize: '0.85rem', color: '#b0a99a', textDecoration: 'none', transition: 'color 0.2s' }}
              >
                ← Volver a la web pública
              </Link>
            </div>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.72rem', color: '#a09689' }}>
          Acceso restringido a personal autorizado
        </p>
      </div>
    </div>
  );
}
