import { Heart, Menu, X, LogIn, LayoutDashboard, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useApp();

  const isAdmin = Boolean(user?.roles?.includes('ROLE_ADMIN'));

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#547792] text-white">
              <Heart className="w-5 h-5" />
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-900">Ayuda Animal Murcia</span>
              <span className="text-xs text-slate-500">Adopción responsable</span>
            </div>
          </a>

          <button
            type="button"
            className="inline-flex lg:hidden items-center justify-center rounded-xl border border-slate-200 px-3 py-2 text-slate-700 hover:bg-slate-50"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          <nav className="hidden lg:flex items-center gap-3 text-sm">
            <a href="/" className="text-slate-600 hover:text-slate-900">Inicio</a>
            <a href="/quienes-somos" className="text-slate-600 hover:text-slate-900">Quiénes somos</a>
            <a href="/animales" className="text-slate-600 hover:text-slate-900">Animales en adopción</a>
            <a href="/contacto" className="text-slate-600 hover:text-slate-900">Contacto</a>

            {isAdmin && (
              <a
                href="/dashboard"
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Panel
              </a>
            )}

            {user ? (
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 text-white px-3 py-1.5 text-xs font-semibold hover:bg-slate-800"
              >
                <LogOut className="w-3.5 h-3.5" />
                Cerrar sesión
              </button>
            ) : (
              <a
                href="/login"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#547792] text-white px-3 py-1.5 text-xs font-semibold hover:bg-[#3d6180]"
              >
                <LogIn className="w-3.5 h-3.5" />
                Iniciar sesión
              </a>
            )}
          </nav>
        </div>

        {menuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white">
            <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col gap-2 text-sm">
              <a href="/" className="text-slate-600 hover:text-slate-900">Inicio</a>
              <a href="/quienes-somos" className="text-slate-600 hover:text-slate-900">Quiénes somos</a>
              <a href="/animales" className="text-slate-600 hover:text-slate-900">Animales en adopción</a>
              <a href="/contacto" className="text-slate-600 hover:text-slate-900">Contacto</a>

              {isAdmin && (
                <a
                  href="/dashboard"
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 mt-2"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Panel
                </a>
              )}

              {user ? (
                <button
                  type="button"
                  onClick={logout}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-slate-900 text-white px-3 py-1.5 text-xs font-semibold hover:bg-slate-800"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Cerrar sesión
                </button>
              ) : (
                <a
                  href="/login"
                  className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-[#547792] text-white px-3 py-1.5 text-xs font-semibold hover:bg-[#3d6180]"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Iniciar sesión
                </a>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Aquí se renderizan las páginas públicas */}
      </main>
    </div>
  );
}
