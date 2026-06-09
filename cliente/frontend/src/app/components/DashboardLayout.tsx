import { Link, Outlet, useNavigate, useLocation } from 'react-router';
import {
  Heart, LayoutDashboard, PawPrint, Package,
  ClipboardList, Users, LogOut, ChevronRight, ClipboardCheck, FileText,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AppContext';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  minRole?: 'voluntario' | 'encargado' | 'administrador';
}

const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Panel principal', icon: <LayoutDashboard className="w-5 h-5" /> },
  { to: '/dashboard/animals', label: 'Animales', icon: <PawPrint className="w-5 h-5" /> },
  { to: '/dashboard/warehouse', label: 'Almacén', icon: <Package className="w-5 h-5" /> },
  { to: '/dashboard/requests', label: 'Solicitudes', icon: <ClipboardList className="w-5 h-5" /> },
  { to: '/dashboard/adoption-requests', label: 'Adopciones', icon: <ClipboardCheck className="w-5 h-5" /> },
  { to: '/dashboard/formularios', label: 'Formularios', icon: <FileText className="w-5 h-5" />, minRole: 'encargado' },
  { to: '/dashboard/users', label: 'Usuarios', icon: <Users className="w-5 h-5" />, minRole: 'administrador' },
];

function NavLink({ item, onClick }: { item: NavItem; onClick?: () => void }) {
  const location = useLocation();
  const isActive = item.to === '/dashboard'
    ? location.pathname === '/dashboard'
    : location.pathname.startsWith(item.to);

  return (
    <Link
      to={item.to}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm group ${
        isActive
          ? 'text-white shadow-md'
          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
      }`}
      style={isActive ? { backgroundColor: '#547792', boxShadow: '0 4px 12px rgba(84,119,146,0.35)' } : {}}
    >
      {item.icon}
      <span>{item.label}</span>
      {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
    </Link>
  );
}

const roleLabels = { voluntario: 'Voluntario/a', encargado: 'Encargado/a', administrador: 'Administrador/a' };
const roleColors = { voluntario: 'bg-[#94B4C1]', encargado: 'bg-[#94B4C1]', administrador: 'bg-[#547792]' };

export default function DashboardLayout() {
  const { currentUser, logout, canAccess } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const visibleItems = navItems.filter(item => !item.minRole || canAccess(item.minRole));

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-700">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#547792' }}>
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-white" style={{ fontWeight: 600 }}>Vidanimal</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 flex flex-col gap-1">
        {visibleItems.map(item => (
          <NavLink key={item.to} item={item} onClick={() => setSidebarOpen(false)} />
        ))}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-slate-700">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-9 h-9 ${roleColors[currentUser.role]} rounded-full flex items-center justify-center text-white text-sm`} style={{ fontWeight: 600 }}>
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm truncate" style={{ fontWeight: 500 }}>{currentUser.name}</p>
            <p className="text-slate-400 text-xs">{roleLabels[currentUser.role]}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors text-sm w-full px-1"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-slate-800 flex-col flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 bg-slate-800 flex flex-col z-10">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 h-16 flex items-center justify-between flex-shrink-0">
          <button
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
            onClick={() => setSidebarOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-sm text-gray-500 transition-colors hidden sm:block"
              onMouseEnter={e => (e.currentTarget.style.color = '#547792')}
              onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}
            >
              ← Ver web pública
            </Link>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs text-white ${roleColors[currentUser.role]}`}>
              {roleLabels[currentUser.role]}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
