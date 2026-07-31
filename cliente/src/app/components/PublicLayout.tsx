import { Link, Outlet, useNavigate, NavLink } from 'react-router';
import { Menu, X, LogIn, LayoutDashboard, LogOut, Instagram, Facebook, MapPin, Mail, Phone } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AppContext';
import LOGO_URL from '../public/logo.jpg';

function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ backgroundColor: '#2e2e2e', color: '#d9d9d9' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={LOGO_URL} alt="Ayuda Animal Murcia" className="h-7 w-auto flex-shrink-0" />
              <span className="font-bold text-base" style={{ color: '#f7e3b0' }}>Ayuda Animal Murcia</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#727272' }}>
              Asociación sin ánimo de lucro dedicada al rescate, cuidado y
              adopción responsable de animales en la Región de Murcia.
            </p>
            <div className="flex gap-3 mt-5">
              <a href="https://www.instagram.com/ayudaanimalmurcia" target="_blank" rel="noopener noreferrer"
                aria-label="Instagram de Ayuda Animal Murcia"
                className="rounded-full p-2 transition-colors hover:bg-white/10"
                style={{ border: '1px solid #727272' }}>
                <Instagram className="w-4 h-4" style={{ color: '#d9d9d9' }} />
              </a>
              <a href="https://www.facebook.com/ayudaanimalmurcia" target="_blank" rel="noopener noreferrer"
                aria-label="Facebook de Ayuda Animal Murcia"
                className="rounded-full p-2 transition-colors hover:bg-white/10"
                style={{ border: '1px solid #727272' }}>
                <Facebook className="w-4 h-4" style={{ color: '#d9d9d9' }} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#f7e3b0' }}>Explora</h3>
            <ul className="space-y-2 text-sm">
              {[
                { to: '/', label: 'Inicio' },
                { to: '/adoptar', label: 'Adoptar' },
                { to: '/apadrinar', label: 'Apadrinar' },
                { to: '/colaborar', label: 'Colaborar' },
                { to: '/donar', label: 'Donar' },
                { to: '/quienes-somos', label: 'Quiénes somos' },
                { to: '/contacto', label: 'Contacto' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="transition-colors hover:text-white" style={{ color: '#727272' }}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#f7e3b0' }}>Contacto</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#727272' }} />
                <span style={{ color: '#727272' }}>Murcia, Región de Murcia, España</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" style={{ color: '#727272' }} />
                <a href="mailto:info@ayudaanimalmurcia.org" className="transition-colors hover:text-white" style={{ color: '#727272' }}>info@ayudaanimalmurcia.org</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" style={{ color: '#727272' }} />
                <a href="tel:+34600000000" className="transition-colors hover:text-white" style={{ color: '#727272' }}>+34 600 000 000</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#f7e3b0' }}>Legal</h3>
            <ul className="space-y-2 text-sm">
              {[
                { to: '/aviso-legal', label: 'Aviso legal' },
                { to: '/privacidad', label: 'Política de privacidad' },
                { to: '/cookies', label: 'Política de cookies' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="transition-colors hover:text-white" style={{ color: '#727272' }}>{label}</Link>
                </li>
              ))}
            </ul>
            <p className="text-xs mt-4 leading-relaxed" style={{ color: '#727272' }}>
              Asociación inscrita en el Registro de Asociaciones de la Región de Murcia. CIF: G-XXXXXXXX
            </p>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #3f3f3f' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs" style={{ color: '#727272' }}>
          <p>© {year} Ayuda Animal Murcia. Todos los derechos reservados.</p>
          <p>Hecho con ♥ por voluntarios.</p>
        </div>
      </div>
    </footer>
  );
}

export default function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors hover:text-[#f7e3b0] ${ isActive ? 'text-[#f7e3b0]' : 'text-slate-300' }`;

  const navLinkClassMobile = ({ isActive }: { isActive: boolean }) =>
    `block text-sm font-medium ${ isActive ? 'text-[#f7e3b0]' : 'text-slate-600' }`;

  return (
    <div className="w-full min-h-screen flex flex-col" style={{ backgroundColor: '#f7f7f7' }}>
      <header className="fixed top-0 left-0 right-0 z-50 border-b" style={{ backgroundColor: '#2e2e2e', borderColor: '#3f3f3f' }}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <img src={LOGO_URL} alt="Logo Ayuda Animal Murcia" className="h-9 w-auto flex-shrink-0" />
              <span className="font-bold text-lg" style={{ color: '#f7e3b0' }}>Ayuda Animal Murcia</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <NavLink to="/" end className={navLinkClass}>Inicio</NavLink>
              <NavLink to="/adoptar" className={navLinkClass}>Adoptar</NavLink>
              <NavLink to="/colaborar" className={navLinkClass}>Colaborar</NavLink>
              <NavLink to="/quienes-somos" className={navLinkClass}>Quiénes somos</NavLink>
              <NavLink to="/contacto" className={navLinkClass}>Contacto</NavLink>
              {currentUser ? (
                <>
                  <NavLink to="/dashboard" className={navLinkClass}>
                    <LayoutDashboard className="h-4 w-4 inline mr-1" />Dashboard
                  </NavLink>
                  <button
                    onClick={() => { logout(); navigate('/'); }}
                    className="text-sm font-medium flex items-center gap-1 transition-colors hover:text-[#f7e3b0]"
                    style={{ color: '#d9d9d9' }}
                  >
                    <LogOut className="h-4 w-4" />Salir
                  </button>
                </>
              ) : (
                <NavLink to="/login" className={navLinkClass}>
                  <LogIn className="h-4 w-4 inline mr-1" />Login
                </NavLink>
              )}
            </nav>

            <button className="md:hidden p-2 transition-colors" style={{ color: '#d9d9d9' }}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}>
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t bg-white px-4 py-4 space-y-3" style={{ borderColor: '#d9d9d9' }}>
            <NavLink to="/" end className={navLinkClassMobile} onClick={() => setMenuOpen(false)}>Inicio</NavLink>
            <NavLink to="/adoptar" className={navLinkClassMobile} onClick={() => setMenuOpen(false)}>Adoptar</NavLink>
            <NavLink to="/colaborar" className={navLinkClassMobile} onClick={() => setMenuOpen(false)}>Colaborar</NavLink>
            <NavLink to="/quienes-somos" className={navLinkClassMobile} onClick={() => setMenuOpen(false)}>Quiénes somos</NavLink>
            <NavLink to="/contacto" className={navLinkClassMobile} onClick={() => setMenuOpen(false)}>Contacto</NavLink>
            {currentUser ? (
              <>
                <NavLink to="/dashboard" className={navLinkClassMobile} onClick={() => setMenuOpen(false)}>
                  <LayoutDashboard className="h-4 w-4 inline mr-1" />Dashboard
                </NavLink>
                <button onClick={() => { logout(); navigate('/'); setMenuOpen(false); }}
                  className="block w-full text-left text-sm font-medium text-slate-600">
                  <LogOut className="h-4 w-4 inline mr-1" />Salir
                </button>
              </>
            ) : (
              <NavLink to="/login" className={navLinkClassMobile} onClick={() => setMenuOpen(false)}>
                <LogIn className="h-4 w-4 inline mr-1" />Login
              </NavLink>
            )}
          </div>
        )}
      </header>

      <main className="w-full pt-16 flex-1"><Outlet /></main>
      <SiteFooter />
    </div>
  );
}
