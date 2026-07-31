import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AppContext';

const LOGO_URL = 'https://i.ibb.co/BHC8hVCV/LOGO-CON-FONDO-removebg-preview.png';

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
    <div
      className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12"
      style={{ backgroundColor: '#f3f0ea' }}
    >
      {/* Fondo decorativo — manchas suaves con colores corporativos */}
      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none',
      }}>
        <div style={{
          position: 'absolute', top: '-10%', left: '-5%',
          width: '45vw', height: '45vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(84,119,146,0.13) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-8%', right: '-6%',
          width: '40vw', height: '40vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(247,227,176,0.25) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', top: '40%', right: '10%',
          width: '20vw', height: '20vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(61,97,128,0.08) 0%, transparent 70%)',
        }} />
      </div>

      <div className="w-full max-w-sm relative" style={{ zIndex: 1 }}>
        {/* Card */}
        <div
          className="overflow-hidden"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '1.5rem',
            boxShadow: '0 8px 40px rgba(46,46,46,0.12), 0 2px 8px rgba(46,46,46,0.06)',
            border: '1px solid rgba(84,119,146,0.12)',
          }}
        >
          {/* Cabecera con fondo oscuro corporativo */}
          <div
            className="px-8 pt-8 pb-7 text-center"
            style={{ backgroundColor: '#2e2e2e' }}
          >
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <img
                src={LOGO_URL}
                alt="Logo Ayuda Animal Murcia"
                style={{ height: '52px', width: 'auto' }}
              />
            </div>
            <h1
              className="font-bold"
              style={{ color: '#f7e3b0', fontSize: '1.25rem', letterSpacing: '-0.01em' }}
            >
              Ayuda Animal Murcia
            </h1>
            <p style={{ color: 'rgba(247,227,176,0.55)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
              Panel de gestión · Vidanimal
            </p>
          </div>

          {/* Separador con acento corporativo */}
          <div style={{ height: '3px', background: 'linear-gradient(to right, #547792, #f7e3b0, #547792)' }} />

          {/* Formulario */}
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Email */}
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                  style={{ color: '#547792' }}
                >
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  required
                  placeholder="tu@correo.org"
                  style={{
                    width: '100%',
                    border: '1.5px solid #dce4ea',
                    borderRadius: '0.75rem',
                    padding: '0.75rem 1rem',
                    fontSize: '0.9rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: '#f9fbfc',
                    color: '#2e2e2e',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#547792')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#dce4ea')}
                />
              </div>

              {/* Contraseña */}
              <div>
                <label
                  htmlFor="login-password"
                  className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                  style={{ color: '#547792' }}
                >
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    required
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      border: '1.5px solid #dce4ea',
                      borderRadius: '0.75rem',
                      padding: '0.75rem 2.75rem 0.75rem 1rem',
                      fontSize: '0.9rem',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      backgroundColor: '#f9fbfc',
                      color: '#2e2e2e',
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = '#547792')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#dce4ea')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    style={{
                      position: 'absolute', right: '0.75rem', top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#94a3b8', padding: '0.25rem',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#547792')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  className="flex items-start gap-2.5 px-4 py-3 rounded-xl text-sm"
                  style={{
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#b91c1c',
                  }}
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Botón */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2"
                style={{
                  backgroundColor: loading ? '#94B4C1' : '#547792',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  padding: '0.8rem 1.5rem',
                  borderRadius: '0.75rem',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s',
                  marginTop: '0.5rem',
                  letterSpacing: '0.01em',
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#3d6180'; }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = '#547792'; }}
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
            <div className="mt-6 text-center">
              <Link
                to="/"
                className="text-sm transition-colors"
                style={{ color: '#94a3b8' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#547792')}
                onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
              >
                ← Volver a la web pública
              </Link>
            </div>
          </div>
        </div>

        {/* Pie de card */}
        <p className="text-center mt-5 text-xs" style={{ color: '#b0a99a' }}>
          Acceso restringido a personal autorizado
        </p>
      </div>
    </div>
  );
}
