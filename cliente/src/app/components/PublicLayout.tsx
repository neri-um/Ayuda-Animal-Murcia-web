import { Link, Outlet, useNavigate, NavLink } from 'react-router';
import { Heart, Menu, X, LogIn, LayoutDashboard, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AppContext';

export default function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const isAdmin = Boolean(currentUser?.roles?.includes('ROLE_ADMIN'));

  return (
    <div className="w-full min-h-screen bg-slate-50">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-500" fill="currentColor" />
              <span className="font-bold text-lg text-slate-900">Ayuda Animal Murcia</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <NavLink to="/" className={({ isActive }) => `text-sm font-medium transition-colors hover:text-red-500 ${isActive ? 'text-red-500' : 'text-slate-600'}`}>
                Inicio
              </NavLink>
              <NavLink to="/animales" className={({ isActive }) => `text-sm font-medium transition-colors hover:text-red-500 ${isActive ? 'text-red-500' : 'text-slate-600'}`}>
                Animales
              </NavLink>
              <NavLink to="/quienes-somos" className={({ isActive }) => `text-sm font-medium transition-colors hover:text-red-500 ${isActive ? 'text-red-500' : 'text-slate-600'}`}>
                Quié¡¡nes somos
              </NavLink>
              {currentUser ? (
                <>
                  <NavLink to="/dashboard" className={({ isActive }) => `text-sm font-medium transition-colors hover:text-red-500 ${isActive ? 'text-red-500' : 'text-slate-600'}`}>
                    <LayoutDashboard className="h-4 w-4 inline mr-1" />
                    Dashboard
                  </NavLink>
                  <button
                    onClick={() => { logout(); navigate('/'); }}
                    className="text-sm font-medium text-slate-600 hover:text-red-500 flex items-center gap-1"
                  >
                    <LogOut className="h-4 w-4" />
                    Salir
                  </button>
                </>
              ) : (
                <NavLink to="/login" className={({ isActive }) => `text-sm font-medium transition-colors hover:text-red-500 ${isActive ? 'text-red-500' : 'text-slate-600'}`}>
                  <LogIn className="h-4 w-4 inline mr-1" />
                  Login
                </NavLink>
              )}
            </nav>
            <button
              className="md:hidden p-2 text-slate-600 hover:text-slate-900"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
            <NavLink to="/" className={({ isActive }) => `block text-sm font-medium ${isActive ? 'text-red-500' : 'text-slate-600'}`} onClick={() => setMenuOpen(false)}>
              Inicio
            </NavLink>
            <NavLink to="/animales" className={({ isActive }) => `block text-sm font-medium ${isActive ? 'text-red-500' : 'text-slate-600'}`} onClick={() => setMenuOpen(false)}>
              Animales
            </NavLink>
            <NavLink to="/quienes-somos" className={({ isActive }) => `block text-sm font-medium ${isActive ? 'text-red-500' : 'text-slate-600'}`} onClick={() => setMenuOpen(false)}>
              Quié¡¡nes somos
            </NavLink>
            {currentUser ? (
              <>
                <NavLink to="/dashboard" className={({ isActive }) => `block text-sm font-medium ${isActive ? 'text-red-500' : 'text-slate-600'}`} onClick={() => setMenuOpen(false)}>
                  <LayoutDashboard className="h-4 w-4 inline mr-1" />
                  Dashboard
                </NavLink>
                <button
                  onClick={() => { logout(); navigate('/'); setMenuOpen(false); }}
                  className="block w-full text-left text-sm font-medium text-slate-600 hover:text-red-500"
                >
                  <LogOut className="h-4 w-4 inline mr-1" />
                  Salir
                </button>
              </>
            ) : (
              <NavLink to="/login" className={({ isActive }) => `block text-sm font-medium ${isActive ? 'text-red-500' : 'text-slate-600'}`} onClick={() => setMenuOpen(false)}>
                <LogIn className="h-4 w-4 inline mr-1" />
                Login
              </NavLink>
            )}
          </div>
        )}
      </header>
      <main className="w-full pt-16">
        <Outlet />
      </main>
    </div>
  );
}
