import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AppContext';
import LOGO_URL from '../public/logopng.png';

// Paleta extraída 1:1 del Home.tsx
// fondo:      #f7f7f7
// superficie: #ffffff
// negro:      #2e2e2e
// gris texto: #727272
// borde:      #d9d9d9
// crema:      #f7e3b0  ← color de acción principal

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
    if (ok) navigate('/dashboard');
    else setError('Email o contraseña incorrectos, o cuenta desactivada.');
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1rem',
      backgroundColor: '#f7f7f7',
    }}>
      <div style={{ width: '100%', maxWidth: '22rem' }}>

        {/* Card */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '1.25rem',
          border: '1px solid #d9d9d9',
          boxShadow: '0 4px 24px rgba(46,46,46,0.08)',
          overflow: 'hidden',
        }}>

          {/* Cabecera oscura */}
          <div style={{ backgroundColor: '#2e2e2e', padding: '2rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.875rem' }}>
              <img
                src={LOGO_URL}
                alt="Logo Ayuda Animal Murcia"
                style={{ height: '52px', width: 'auto' }}
              />
            </div>
            <h1 style={{ margin: 0, color: '#f7e3b0', fontSize: '1.15rem', fontWeight: 700 }}>
              Ayuda Animal Murcia
            </h1>
            <p style={{ margin: '0.2rem 0 0', color: 'rgba(247,227,176,0.5)', fontSize: '0.78rem' }}>
              Panel de gestión · Vidanimal
            </p>
          </div>

          {/* Separador crema */}
          <div style={{ height: '3px', backgroundColor: '#f7e3b0' }} />

          {/* Formulario */}
          <div style={{ padding: '1.75rem' }}>
            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

              {/* Email */}
              <div>
                <label
                  htmlFor="login-email"
                  style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#2e2e2e', marginBottom: '0.35rem' }}
                >
                  Email
                </label>
                <input
                  id="login-email" type="email" value={email} required
                  placeholder="tu@correo.org"
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  onFocus={e  => (e.currentTarget.style.borderColor = '#2e2e2e')}
                  onBlur={e   => (e.currentTarget.style.borderColor = '#d9d9d9')}
                  style={{
                    width: '100%', border: '1.5px solid #d9d9d9', borderRadius: '0.625rem',
                    padding: '0.65rem 0.875rem', fontSize: '0.875rem', outline: 'none',
                    transition: 'border-color 0.15s', backgroundColor: '#f7f7f7', color: '#2e2e2e',
                  }}
                />
              </div>

              {/* Contraseña */}
              <div>
                <label
                  htmlFor="login-password"
                  style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#2e2e2e', marginBottom: '0.35rem' }}
                >
                  Contraseña
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="login-password" type={showPass ? 'text' : 'password'} value={password} required
                    placeholder="••••••••"
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    onFocus={e  => (e.currentTarget.style.borderColor = '#2e2e2e')}
                    onBlur={e   => (e.currentTarget.style.borderColor = '#d9d9d9')}
                    style={{
                      width: '100%', border: '1.5px solid #d9d9d9', borderRadius: '0.625rem',
                      padding: '0.65rem 2.5rem 0.65rem 0.875rem', fontSize: '0.875rem', outline: 'none',
                      transition: 'border-color 0.15s', backgroundColor: '#f7f7f7', color: '#2e2e2e',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    onMouseEnter={e => (e.currentTarget.style.color = '#2e2e2e')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#727272')}
                    style={{
                      position: 'absolute', right: '0.65rem', top: '50%',
                      transform: 'translateY(-50%)', background: 'none', border: 'none',
                      cursor: 'pointer', color: '#727272', padding: '0.2rem',
                      display: 'flex', alignItems: 'center', transition: 'color 0.15s',
                    }}
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
                  padding: '0.7rem 0.875rem', borderRadius: '0.625rem',
                  backgroundColor: '#fef2f2', border: '1px solid #fecaca',
                  color: '#b91c1c', fontSize: '0.82rem',
                }}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ marginTop: '0.05rem' }} />
                  <span>{error}</span>
                </div>
              )}

              {/* Botón crema */}
              <button
                type="submit"
                disabled={loading}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.85'; }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.opacity = '1'; }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  width: '100%',
                  backgroundColor: loading ? '#e8d49a' : '#f7e3b0',
                  color: '#2e2e2e',
                  fontWeight: 600, fontSize: '0.9rem',
                  padding: '0.8rem', borderRadius: '0.75rem',
                  border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'opacity 0.15s', marginTop: '0.25rem',
                }}
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
                  <><LogIn className="w-4 h-4" />Entrar al panel</>
                )}
              </button>
            </form>

            {/* Volver */}
            <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
              <Link
                to="/"
                onMouseEnter={e => (e.currentTarget.style.color = '#2e2e2e')}
                onMouseLeave={e => (e.currentTarget.style.color = '#727272')}
                style={{ fontSize: '0.82rem', color: '#727272', textDecoration: 'none', transition: 'color 0.15s' }}
              >
                ← Volver a la web pública
              </Link>
            </div>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.7rem', color: '#727272' }}>
          Acceso restringido a personal autorizado
        </p>
      </div>
    </div>
  );
}
