import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Heart, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AppContext';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const ok = await login(email, password);
    if (ok) {
      navigate('/dashboard');
    } else {
      setError('Email o contraseña incorrectos, o cuenta desactivada.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12" style={{ background: 'linear-gradient(135deg, #EAE0CF, #dce8ed)' }}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8 text-center" style={{ background: 'linear-gradient(to right, #547792, #3d6180)' }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
              <Heart className="w-7 h-7 text-white fill-white" />
            </div>
            <h2 className="text-white" style={{ fontSize: '1.4rem' }}>Acceso voluntarios</h2>
            <p className="text-white/70 text-sm mt-1">Panel de gestión – Vidanimal</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  required
                  placeholder="tu@correo.org"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
                  onFocus={e => (e.currentTarget.style.borderColor = '#547792')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    required
                    placeholder="••••••••"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none"
                    onFocus={e => (e.currentTarget.style.borderColor = '#547792')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 text-white py-3 rounded-xl transition-colors mt-2"
                style={{ backgroundColor: '#547792', fontWeight: 600 }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#3d6180')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#547792')}
              >
                <LogIn className="w-4 h-4" />
                Entrar al panel
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/" className="text-sm text-gray-400 transition-colors"
                onMouseEnter={e => (e.currentTarget.style.color = '#547792')}
                onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}
              >
                ← Volver a la web pública
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
