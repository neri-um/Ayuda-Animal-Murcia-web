import { Link, Outlet, useNavigate, NavLink } from 'react-router';
import { Heart, Menu, X, LogIn, LayoutDashboard, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AppContext';

export default function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4">
      <nav className="max-w-5xl mx-auto rounded-2xl shadow-xl border"
        style={{ backgroundColor: '#1c3043', borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="px-5 sm:px-7">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#547792' }}>
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="text-white hidden sm:block" style={{ fontSize: '1rem', fontWeight: 600 }}>Vidanimal</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-5">
              {[
                { to: '/', label: 'Adoptar' },
                { to: '/quienes-somos', label: 'Quiénes somos' },
                { to: '/contacto', label: 'Contacto' },
              ].map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className="text-sm transition-colors"
                  style={({ isActive }) => ({ color: isActive ? '#94B4C1' : 'rgba(255,255,255,0.65)', fontWeight: isActive ? 600 : 400 })}
                >
                  {label}
                </NavLink>
              ))}
              {currentUser ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl transition-colors text-sm font-semibold"
                    style={{ backgroundColor: '#547792', color: 'white' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#3d6180')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#547792')}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Panel
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 text-sm transition-colors"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                  >
                    <LogOut className="w-4 h-4" />
                    Salir
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl transition-colors text-sm font-semibold"
                  style={{ backgroundColor: '#547792', color: 'white' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#3d6180')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#547792')}
                >
                  <LogIn className="w-4 h-4" />
                  Acceso voluntarios
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg transition-colors"
              style={{ color: 'rgba(255,255,255,0.7)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'white')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t px-5 py-4 flex flex-col gap-3 rounded-b-2xl"
            style={{ borderColor: 'rgba(255,255,255,0.08)', backgroundColor: '#1c3043' }}>
            <Link to="/" onClick={() => setMenuOpen(false)} className="py-1.5 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>Adoptar</Link>
            <Link to="/quienes-somos" onClick={() => setMenuOpen(false)} className="py-1.5 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>Quiénes somos</Link>
            <Link to="/contacto" onClick={() => setMenuOpen(false)} className="py-1.5 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>Contacto</Link>
            {currentUser ? (
              <>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-white px-4 py-2 rounded-xl text-sm w-fit" style={{ backgroundColor: '#547792' }}>
                  <LayoutDashboard className="w-4 h-4" /> Panel de control
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 text-sm w-fit">
                  <LogOut className="w-4 h-4" /> Cerrar sesión
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-white px-4 py-2 rounded-xl text-sm w-fit" style={{ backgroundColor: '#547792' }}>
                <LogIn className="w-4 h-4" /> Acceso voluntarios
              </Link>
            )}
          </div>
        )}
      </nav>
      </div>

      {/* Content — pt-24 clears the floating navbar */}
      <main className="flex-1 pt-24">
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: '#213448' }} className="text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">

            {/* Brand */}
            <div className="md:col-span-4">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#547792' }}>
                  <Heart className="w-5 h-5 text-white fill-white" />
                </div>
                <div>
                  <div className="text-white font-bold">Ayuda Animal Murcia</div>
                  <div className="text-xs text-gray-500">Protectora de animales</div>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
                Rescatamos, cuidamos y encontramos hogar para los animales más vulnerables
                de la Región de Murcia desde 2019.
              </p>
            </div>

            {/* Navigation */}
            <div className="md:col-span-2">
              <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wide">Navegar</h4>
              <ul className="space-y-2.5 text-sm">
                {[
                  { to: '/', label: 'Adoptar' },
                  { to: '/quienes-somos', label: 'Quiénes somos' },
                  { to: '/contacto', label: 'Contacto' },
                  { to: '/login', label: 'Acceso voluntarios' },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="hover:text-white transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="md:col-span-3">
              <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wide">Contacto</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">📍</span>
                  <span>Región de Murcia</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">✉️</span>
                  <a href="mailto:info@ayudaanimalmurcia.org" className="hover:text-white transition-colors">
                    info@ayudaanimalmurcia.org
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">📱</span>
                  <span>968 XX XX XX</span>
                </li>
              </ul>
            </div>

            {/* Hours + social */}
            <div className="md:col-span-3">
              <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wide">Horario</h4>
              <ul className="space-y-2 text-sm mb-6">
                <li className="flex justify-between gap-4">
                  <span>Lun – Vie</span>
                  <span className="text-gray-300">9:00 – 18:00</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span>Sábados</span>
                  <span className="text-gray-300">10:00 – 14:00</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span>Domingos</span>
                  <span className="text-gray-500">Cerrado</span>
                </li>
              </ul>
              <div className="flex gap-2">
                {['Facebook', 'Instagram'].map(red => (
                  <span key={red}
                    className="px-3 py-1.5 rounded-lg text-xs border text-gray-400 cursor-pointer hover:text-white hover:border-gray-500 transition-colors"
                    style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                    {red}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
            style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <span>© {new Date().getFullYear()} Ayuda Animal Murcia · Todos los derechos reservados</span>
            <div className="flex items-center gap-1 text-gray-500">
              <Heart className="w-3 h-3 fill-current" style={{ color: '#547792' }} />
              <span>Hecho con amor por y para los animales</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}